import { HttpUrlEncodingCodec } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  OnChanges,
  SimpleChange,
  HostListener,
} from '@angular/core';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { TagEntry } from '../model/tag-entry-model';
import { Tag } from '../model/tag-model';
import { Tags } from '../model/tags-model';
import { IconService } from '../service/icon.service';
import { MenuService } from '../service/menu.service';
import { HiglightEditorTagsService } from '../widgets/higlight.editor.tags.service';
import { Delta, Quill } from 'quill';

@Component({
  selector: 'toolbar',
  templateUrl: './quill.toolbar.component.html',
})
export class QuillToolbarComponent implements OnInit {
  @Input()
  pages!: Page[];

  @Input()
  passingPageId!: string;

  @Input()
  tagEntry!: TagEntry;

  @Input()
  quill!: Quill;

  @Input()
  sending!: boolean;

  @Input()
  highlightConfig!: { send: boolean; map: Map<boolean, Map<string, number[]>> };

  @Output() newQuillEditor = new EventEmitter<any>();

  // @HostListener('document:command', ['$event'])
  // handleCommand(event: any){
  //   this.log.info(`Angular has receieved event`)
  //   this.log.info(event)
  // }

  range: any;
  text: string = '';

  sideBarTitle!: string;
  textPresent!: boolean;
  content!: any;
  listenerPresent!: boolean;
  updateIndicator!: boolean;
  changeIndicator!: boolean;
  loadingContent!: boolean;
  updateType!: string;
  toolType!: string;
  toolId!: number;
  pageId!: number;
  lastCursorPosition!: number;
  maxExtractLength!: number;

  personTag: string = PERSON;
  placeTag: string = PLACE;
  itemTag: string = ITEM;
  miscTag: string = MISC;

  visible = false;

  icons = new IconService();
  buttonEvents = new Map();

  htmlDecoder = new HttpUrlEncodingCodec();
  htmlEncoder = new HttpUrlEncodingCodec();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private log: LoggerService,
    private highlightTagService: HiglightEditorTagsService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.log.info(
      `initilising variables for puill tool bar:: Started`,
      this.ngOnInit.name,
      QuillToolbarComponent.name
    );

    this.buttonEvents.set(PERSON, 0);
    this.buttonEvents.set(PLACE, 0);
    this.buttonEvents.set(ITEM, 0);
    this.buttonEvents.set(MISC, 0);

    this.maxExtractLength = 150;

    this.tagEntry = this.setupOrClearTagEntry();

    this.listenerPresent = false;
    this.updateIndicator = false;
    this.changeIndicator = false;
    this.loadingContent = false;

    this.pageId = parseInt(this.passingPageId);
    console.debug(this.pageId);

    this.highlightTagService.highLightTag.subscribe((tags) => {
      if (tags.pageId+1 == this.pageId) {
        this.highlightTag(tags.ids, tags.type, tags.active);
      }
    });
    // this.menuService.getPasteQuill.subscribe(clipbaord => this.pasteClipboard(clipbaord))

    this.log.info(`initilising variables for puill tool bar:: finished`);
  }

  private setupOrClearTagEntry() {
    return {
      id: 0,
      name: '',
      previousName: '',
      date: '',
      misc: [],
      notes: '',
      location: '',
      previousLocation: '',
      area: '',
      previousArea: '',
      itemtype: [],
      previousItemtype: [],
      range: 0,
      buttonIndex: 0,
      lenght: 0,
    };
  }

  editorCreated(editor: any) {
    this.log.info(`starting`, 'editorCreated', 'QuillToolbarComponent');

    this.quill = editor;
    this.newQuillEditor.emit(this.quill);
    this.log.info(`new editor announced and shared`);
    let editorJustFilled = false;

    this.log.info(`Setting content for the page:: Started`);
    this.loadingContent = true;
    try {
      this.loadPageContent();
      editorJustFilled = true;
    } catch (error) {
      this.log.error(`issue loading content`);
      this.log.error(`${error}`);
    } finally {
      this.loadingContent = false;
    }

    this.log.debug(
      `before setting on change editor just filled is ${editorJustFilled}`,
      'editorCreated',
      'QuillToolbarComponent'
    );
    this.quill.on(
      'text-change',
      (delta: Delta, oldDelta: Delta, source: string) => {
        
        this.log.info(
          `text change from ${source}`,
          'editorCreated',
          'QuillToolbarComponent'
        );
        this.log.info(
          `before checking flag it is ${editorJustFilled}`,
          'editorCreated',
          'QuillToolbarComponent'
        );
        if (editorJustFilled) {
          editorJustFilled = false;
        } else {
          if (delta != oldDelta) {
            this.log.debug(
              `difference in detected, marking as not update`,
              'editorCreated',
              'QuillToolbarComponent'
            );
            this.pages[this.pageId - 1].saveUpToDate = false;
          } else {
            this.log.debug(
              `no difference update`,
              'editorCreated',
              'QuillToolbarComponent'
            );
            this.pages[this.pageId - 1].saveUpToDate = true;
          }
        }
      }
    );

    this.quill.focus();
    this.log.debug(
      `focus brought to the editor`,
      'editorCreated',
      'QuillToolbarComponent'
    );
    // this.getTagEntryExtract('0', PERSON);
    // this.log.debug(
    //   `just about to change editor fill flag to false`,
    //   'editorCreated',
    //   'QuillToolbarComponent'
    // );
    // editorJustFilled = false;
    // this.log.debug(`flag now changed`, 'editorCreated', 'QuillToolbarComponent');
    this.log.info(`finish`, 'editorCreated', 'QuillToolbarComponent');
  }

  private loadPageContent() {
    this.log.info('starting', 'loadPageContent', 'QuillToolbarComponent');
    this.log.info(
      `setting text content :: Started`,
      'loadPageContent',
      'QuillToolbarComponent'
    );
    // this.quill.setContents(this.pages[0].page) 
    this.quill.root.innerHTML = this.htmlDecoder.decodeValue(
      this.pages[this.pageId - 1].page
    );
    this.log.info(
      `setting text content :: Finished`,
      'loadPageContent',
      'QuillToolbarComponent'
    );

    this.log.info(
      `Applying event handlers to taged words :: Started`,
      'loadPageContent',
      'QuillToolbarComponent'
    );
    for (let [key, value] of Object.entries(this.pages[this.pageId - 1].tags)) {
      this.log.info(
        `Working through ${key} set:: Started`,
        'loadPageContent',
        'QuillToolbarComponent'
      );
      this.updateButtons(value, key);
      this.log.info(
        `Working through ${key} set:: Finished`,
        'loadPageContent',
        'QuillToolbarComponent'
      );
    }
    this.log.info(
      `Applying event handlers to taged words :: Finished`,
      'loadPageContent',
      'QuillToolbarComponent'
    );
    
    this.log.info('finishing', 'loadPageContent', 'QuillToolbarComponent');
  }

  private updateButtons(tagSet: any, tagtype: string) {
    this.log.info(`starting`, 'updateButtons', 'QuillToolbarComponent');

    for (let tag of tagSet) {
      this.log.debug(
        `Attacking click of ${tag.name}`,
        'updateButtons',
        'QuillToolbarComponent'
      );
      this.attachClickEvent(tagtype, tag.metaData.buttonIndex);
    }

    this.buttonEvents.set(tagtype, tagSet.length);
    this.log.info(
      `buttonevent tracker updated for ${tagtype} to ${tagSet.length}`,
      'updateButtons',
      'QuillToolbarComponent'
    );

    this.log.info(`finish`, 'updateButtons', 'QuillToolbarComponent');
  }

  changeOccured() {
    this.log.info(`starting`, 'changeOccured', 'QuillToolbarComponent');
    let currentContent = this.htmlEncoder.encodeValue(
      this.quill.root.innerHTML
    );
    if (currentContent != this.pages[this.pageId].page) {
      this.log.debug(
        `there is a difference since last save`,
        'changeOccured',
        'QuillToolbarComponent'
      );
      this.pages[this.pageId].saveUpToDate = false;
    } else {
      this.log.debug(
        `no change since last save`,
        'changeOccured',
        'QuillToolbarComponent'
      );
      this.pages[this.pageId].saveUpToDate = true;
    }
    this.log.info(`finish`, 'changeOccured', 'QuillToolbarComponent');
  }

  //values passed in by the opening button.
  onNewTagSave(event: any[]) {
    this.log.info(`Started`, 'onNewTagSave', 'QuillToolbarComponent');
    let id = event[0];
    this.changeIndicator = event[1];

    this.log.debug(
      `followinnng have been set, id = ${id} and change indicator = ${this.changeIndicator}`,
      'onNewTagSave',
      'QuillToolbarComponent'
    );

    if (this.updateIndicator) {
      this.log.debug(
        `update indicator present`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      if (this.changeIndicator) {
        this.log.debug(
          `Change indicator present`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );

        let range =
          this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
            .metaData.range;
        let length =
          this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
            .name.length;

        this.log.debug(
          `Setting the following: range = ${range} and length = ${length}`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );

        this.quill.removeFormat(range, length);
        this.log.debug(
          `previous word removed`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          range,
          this.updateType,
          this.forValue(
            this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
              .name,
            this.updateType,
            id
          )
        );

        this.attachClickEvent(this.sideBarTitle, id);
        this.changeIndicator = false;
      }
      this.updateIndicator = false;
    } else {
      this.log.debug(
        `update indicator absent`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      if (this.textPresent) {
        this.log.debug(
          `text present true`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.quill.deleteText(this.range.index, this.text.length);
        this.log.debug(
          `Removed the previous word`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          this.range.index,
          this.sideBarTitle,
          this.forValue(this.text, this.sideBarTitle, id)
        );

        this.textPresent = false;
      } else {
        this.log.debug(
          `text present false`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          this.range.index,
          this.sideBarTitle,
          this.forValue(
            this.pages[this.pageId - 1].tags[this.sideBarTitle as keyof Tags][
              id
            ].name,

            this.sideBarTitle,
            id
          )
        );

        this.textPresent = false;
      }
      this.log.debug(
        `adding the button listener`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      this.attachClickEvent(this.sideBarTitle, id);
    }

    this.close();
    this.log.info(`Finished`, 'onNewTagSave', 'QuillToolbarComponent');
  }

  private forValue(text: string, icontype: string, id: number) {
    this.log.info(`starting`, 'forValue', 'QuillToolbarComponent');
    this.log.debug(
      `setting ${this.icons.getIcon(icontype) + text}`,
      'forValue',
      'QuillToolbarComponent'
    );
    this.log.info(`Finished`, 'forValue', 'QuillToolbarComponent');
    return this.icons.getIcon(icontype) + text + this.setTooltip(icontype, id);
  }

  private setTooltip(type: string, id: number) {
    let tooltip = '';

    switch (type) {
      case PERSON:
        tooltip =
          '<div class="tooltip"><table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.person[id].notes +
          '</td><table></div>';
        break;
      case PLACE:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Location:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].location +
          '</td></tr>' +
          '<tr><td><strong>Area:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].area +
          '</td></tr>' +
          '<tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      case ITEM:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Type:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.item[id].type +
          '</td>' +
          '<tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.item[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      case MISC:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.misc[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      default:
        break;
    }

    return tooltip;
  }

  private updateTextInPage(index: number, type: string, text: string) {
    this.log.info(`Starting`, 'updateTextInPage', 'QuillToolbarComponent');
    this.log.debug(
      `padded in, index = ${index}, type = ${type} and text = ${text}`
    );

    this.quill.insertEmbed(index, type, text);
    this.quill.setSelection(index + text.length, index + text.length);
    this.log.info(`Finnished`, 'updateTextInPage', 'QuillToolbarComponent');
  }

  private attachClickEvent(buttonClass: string, id: number) {
    this.log.info(`Starting`, 'attachClickEvent', 'QuillToolbarComponent');
    // maintains the number of entries on the page for each tag type, which allows the correct
    //button to get its event handler
    let count = this.buttonEvents.get(buttonClass);
    let queryString = '.' + buttonClass;

    this.log.debug(
      `this run is using: ButtonClass = ${buttonClass}, count = ${count} and querystring = ${queryString}`,
      'attachClickEvent',
      'QuillToolbarComponent'
    );

    //finds the button all the buttons on the page that matches the class passed in eg person
    //and there is also two systems to find out which button this is, first is a running count map for all
    //new button added to the page. The
    let button: any;
    if (this.changeIndicator || this.loadingContent) {
      this.log.debug(
        `Running a change : ${this.changeIndicator} or loading : ${this.loadingContent}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      this.log.debug(
        `Updating button that matches index number: ${
          this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][id]
            .metaData.buttonIndex
        }`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      button =
        this.elementRef.nativeElement.querySelectorAll(queryString)[
          this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][id]
            .metaData.buttonIndex
        ];
    } else {
      this.log.debug(
        `Running a new button`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      button =
        this.elementRef.nativeElement.querySelectorAll(queryString)[count];
    }
    //adds the event to the button
    this.renderer.listen(button, 'click', (event) =>
      this.tagViewAndUpdate(event, id, buttonClass)
    );
    this.renderer.listen(button, 'hover', (event) =>
      this.toolTipIdAndTypeSet(event, id, buttonClass)
    );
    this.log.debug(
      `click applied to button wth id = ${id}`,
      'attachClickEvent',
      'QuillToolbarComponent'
    );

    if (!this.changeIndicator && !this.loadingContent) {
      //recording the number of the button in order of buttons for that type so that if the text
      //is channge we can assign the correct button
      this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][
        id
      ].metaData.buttonIndex = count;

      this.log.debug(
        `Button id is updated in page to ${count}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );

      //increment the button so we can find the new one on the next call
      count++;

      //store the increment
      this.buttonEvents.set(buttonClass, count);
      let tempMap: Map<string, ElementRef> = new Map();

      this.log.debug(
        `button set ${buttonClass} has been updated to ${count}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
    }
    this.log.info(`Finish`, 'attachClickEvent', 'QuillToolbarComponent');
  }

  open() {
    this.visible = true;
  }

  close() {
    this.log.info(`starting`, 'close', 'QuillToolbarComponent');
    this.visible = false;
    this.changeIndicator = false;
    this.updateIndicator = false;
    this.tagEntry = this.setupOrClearTagEntry();
    this.log.debug(
      `change indicator = ${this.changeIndicator}`,
      'close',
      'QuillToolbarComponent'
    );
    this.log.debug(
      `update indicator = ${this.updateIndicator}`,
      'close',
      'QuillToolbarComponent'
    );
    this.log.info(`finishing`, 'close', 'QuillToolbarComponent');
  }

  toolTipIdAndTypeSet(event: any, id: number, type: string) {
    this.toolId = id;
    this.toolType = type;
  }

  tagViewAndUpdate(event: any, id: number, type: string) {
    this.log.info(`starting`, 'tagViewAndUpdate', 'QuillToolbarComponent');
    let tagData = this.pages[0].tags[type as keyof Tags][id];
    this.log.debug(tagData);
    this.displayDataSidebar(tagData, type);

    this.sideBarTitle = type;
    this.updateIndicator = true;
    this.updateType = type;
    this.log.debug(
      `opening the side menu`,
      'tagViewAndUpdate',
      'QuillToolbarComponent'
    );
    this.open();
    this.log.info(`finishing`, 'tagViewAndUpdate', 'QuillToolbarComponent');
  }

  private displayDataSidebar(tagData: any, type: string) {
    switch (type) {
      case PERSON:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case PLACE:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.location = tagData.location;
        this.tagEntry.previousLocation = tagData.location;
        this.tagEntry.area = tagData.area;
        this.tagEntry.previousArea = tagData.area;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case ITEM:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.itemtype = tagData.type;
        this.tagEntry.previousItemtype = tagData.type;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case MISC:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      default:
        break;
    }
  }

  tagMenu(tagType: string) {
    this.sideBarTitle = tagType;
    this.range = this.quill.getSelection();

    if (this.range.length == 0 || this.range == null) {
      this.tagEntry.name = '';
      this.tagEntry.misc = [this.sideBarTitle];

      this.textPresent = false;
    } else {
      this.tagEntry.name = this.text = this.quill.getText(
        this.range.index,
        this.range.length
      );
      this.tagEntry.misc = [this.sideBarTitle, this.text];

      this.textPresent = true;
    }
    this.tagEntry.range = this.range.index;

    this.open();
  }

  getTagEntryExtract(rangeString: string, name: string, tagType: string){
    this.log.info('Starting', 'getTagEntryString', 'QuillToolbarComponent');
    let range = parseInt(rangeString);
    this.log.debug(`the params are rangeString, name, tagType :: ${rangeString}, ${name}, ${tagType}`, 'getTagEntryExtract', 'QuillToolbarComponent')
    this.log.debug(`range is number :: ${range}`, 'getTagEntryExtract', 'QuillToolbarComponent')

    this.log.debug(`next lind is tag ranges ::`, 'getTagEntryExtract', 'QuillToolbarComponent')
    this.log.debug(this.pages[this.pageId-1].tagRanges)
    this.log.debug(` next index  values that are equal :: ${this.pages[this.pageId-1].tagRanges.indexOf(range)+1}, ${this.pages[this.pageId-1].tagRanges.length}`, 'getTagEntryString', 'QuillToolbarComponent')
    this.log.debug(`previous index valuse that are greater than the other :: ${this.pages[this.pageId-1].tagRanges.indexOf(range)}, ${0}`, 'getTagEntryString', 'QuillToolbarComponent')


    let indexNextTag: number = this.pages[this.pageId-1].tagRanges.indexOf(range)+1 == this.pages[this.pageId-1].tagRanges.length ? -1 : this.pages[this.pageId-1].tagRanges[this.pages[this.pageId-1].tagRanges.indexOf(range)+1];
    let indexPreviousTag: number = this.pages[this.pageId-1].tagRanges.indexOf(range) > 0 ? this.pages[this.pageId-1].tagRanges[this.pages[this.pageId-1].tagRanges.indexOf(range)-1] : -1; 
    let extract: string = '';
    this.log.debug(`previous index and next index :: ${indexPreviousTag}, ${indexNextTag}`, 'getTagEntryString', 'QuillToolbarComponent')
    extract = this.formatExtract(
      this.getTextFromEditor(
        indexPreviousTag != -1? indexPreviousTag : 0,
        indexNextTag != -1? 
          indexNextTag : this.quill.getLength() > 150? 
            this.findFinishIndex(range) : this.quill.getLength()
      ),
      name,
      indexPreviousTag != -1? range - indexPreviousTag : range,
      tagType
    )
    this.log.debug(`extract :: ${extract}`, 'getTagEntryString', 'QuillToolbarComponent')
    this.log.info('finishing', 'getTagEntryString', 'QuillToolbarComponent');
    return extract;
  }
  
  
  private findFinishIndex(range: number) : number {
    this.log.info('Starting', 'findFinishIndex', 'QuillToolbarComponent');
      let tempString: string = '';
      this.quill.getText(range, 150).split(/\s/).forEach((value,index) => {
        if(index < 10){
          tempString += value +' '
         }else {
          return
         }   
      })
      this.log.info('Finishing', 'findFinishIndex', 'QuillToolbarComponent');
      return tempString.trimEnd.length
  }

  private getTextFromEditor(startIndex: number, finishIndex: number) : string {
    this.log.info('Starting', 'getTextFromEditor', 'QuillToolbarComponent');
    this.log.debug(`The passed in params are startIndex=${startIndex} and finishIndex=${finishIndex}`, 'getTextFromEditor', 'QuillToolbarComponent');
    this.log.info('Finishing', 'getTextFromEditor', 'QuillToolbarComponent');
    return this.quill.getText(startIndex, finishIndex - startIndex);
}
  
  private formatExtract(rawExtract: string, name: string, range: number, nameType: string) : string{
    this.log.info('Starting', 'formatExtract', 'QuillToolbarComponent');
    this.log.debug(`The passed in params are range :: ${range}`, 'formatExtract', 'QuillToolbarComponent');
    let beforeName: string = rawExtract.substring(0, range-1).trim();
    let afterName: string = rawExtract.substring(range-1).trim();
    this.log.info('Finishing', 'formatExtract', 'QuillToolbarComponent');

    return beforeName + this.wrapName(name, nameType) + afterName;
  }

  private wrapName(name: string, nameType: string) : string {
    this.log.info('Starting', 'wrapName', 'QuillToolbarComponent');
    
    this.log.info('Finishing', 'wrapName', 'QuillToolbarComponent');
    return ` <span class="${nameType} highlight ${nameType}Glow">${name}</span> `
  }

  highlightTag(ids: number[], type: string, active: boolean) {
    this.log.info('Starting', 'highlightTag', 'QuillToolbarComponent');
    this.log.debug(`iterating array`, 'highlightTag', 'QuillToolbarComponent');

    for (let id of ids) {
      this.log.debug(
        `first button wit id ${id} and type ${type} and this will be an active=${active} highlight`,
        'highlightTag',
        'QuillToolbarComponent'
      );
      this.applyHighlight(id, type, active);
    }
    this.log.info('Finishing', 'highlightTag', 'QuillToolbarComponent');
  }

  private applyHighlight(id: number, type: string, active: boolean) {
    this.log.info('Starting', 'applyHighlight', 'QuillToolbarComponent');
    let button = this.elementRef.nativeElement.querySelectorAll('.' + type)[id];
    this.log.debug(
      `button found ${button}`,
      'applyHighlight',
      'QuillToolbarComponent'
    );
    if (active) {
      this.log.debug(`highlighting`, 'applyHighlight', 'QuillToolbarComponent');
      this.renderer.removeClass(button, 'reference');
      this.renderer.addClass(button, 'highlight');
      this.renderer.addClass(button, type + 'Glow');
    } else {
      this.log.debug(`reverting`, 'applyHighlight', 'QuillToolbarComponent');
      this.renderer.removeClass(button, 'highlight');
      this.renderer.removeClass(button, type + 'Glow');
      this.renderer.addClass(button, 'reference');
    }
    this.log.info('Finishing', 'applyHighlight', 'QuillToolbarComponent');
  }
}
