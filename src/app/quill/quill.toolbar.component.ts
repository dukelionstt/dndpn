import { HttpUrlEncodingCodec } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, OnChanges, SimpleChange } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { LoggerService } from "../logger.service";
import { Page } from "../model/page-model";
import { TagEntry } from "../model/tag-entry-model";
import { Tag } from "../model/tag-model";
import { Tags } from "../model/tags-model";
import { IconService } from "../service/icon.service";
import { HiglightEditorTagsService } from "../widgets/higlight.editor.tags.service";


@Component({
    selector: 'toolbar',
    templateUrl: './quill.toolbar.component.html'
})
export class QuillToolbarComponent implements OnInit{

    @Input()
    pages!: Page[];

    @Input()
    tagEntry!: TagEntry;

    @Input()
    quill!: any;

    @Input()
    sending!: boolean;

    @Input()
    highlightConfig!: {send: boolean, map: Map<boolean, Map<string,number[]>>}

    @Output() newQuillEditor = new EventEmitter<any>();

    range : any;
    text : string = '';

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

    personTag: string = PERSON
    placeTag: string = PLACE
    itemTag: string = ITEM
    miscTag: string = MISC

    visible = false;

    icons = new IconService();
    buttonEvents = new Map();

    htmlDecoder = new HttpUrlEncodingCodec();


    constructor( private renderer:Renderer2, private elementRef: ElementRef, private log: LoggerService,
                  private highlightTagService: HiglightEditorTagsService){}

    ngOnInit(): void {
        this.log.info(`initilising variables for puill tool bar:: Started`)
        // this.icons.set(PERSON, '<img src="https://img.icons8.com/ios-glyphs/15/2b00d5/human-head.png"/>')
        // this.icons.set(PLACE, '<img src="https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png"/>')
        // this.icons.set(ITEM, '<img src="https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png"/>')
        // this.icons.set(MISC, '<img src="https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png"/>')

        this.buttonEvents.set(PERSON, 0);
        this.buttonEvents.set(PLACE, 0);
        this.buttonEvents.set(ITEM, 0);
        this.buttonEvents.set(MISC, 0);

        this.tagEntry = this.setupOrClearTagEntry();

        this.listenerPresent = false;
        this.updateIndicator = false;
        this.changeIndicator = false;
        this.loadingContent = false;

        this.highlightTagService.highLightTag.subscribe(tags => this.highlightTag(tags.ids, tags.type, tags.active))

        this.log.info(`initilising variables for puill tool bar:: finished`)
    }

    private setupOrClearTagEntry(){
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
        lenght: 0

      }
    }

    private loadPageContent(){
      this.log.info(`setting text content :: Started`);
      // this.quill.setContents(this.pages[0].page)
      this.quill.root.innerHTML = this.htmlDecoder.decodeValue(this.pages[0].page);
      this.log.info(`setting text content :: Finished`);

      this.log.info(`Applying event handlers to taged words :: Started`);
      for(let [key, value] of Object.entries(this.pages[0].tags)){
        this.log.info(`Working through ${key} set:: Started`);
        this.updateButtons(value, key)
        this.log.info(`Working through ${key} set:: Finished`);
      }
      this.log.info(`Applying event handlers to taged words :: Finished`);

    }

    private updateButtons(tagSet: any, tagtype: string){
        for(let tag of tagSet){
          this.log.debug(`Attacking click of ${tag.name}`)
          this.attachClickEvent(tagtype, tag.metaData.buttonIndex)
        }
        this.buttonEvents.set(tagtype, tagSet.length)
        this.log.info(`buttonevent tracker updated for ${tagtype} to ${tagSet.length}`)
    }

    
    //values passed in by the opening button.
    onNewTagSave(event: any[]){
      this.log.info(`newTagSave process :: Started`)
      let id = event[0]
      this.changeIndicator = event[1]

      this.log.debug(`followinnng have been set, id = ${id} and change indicator = ${this.changeIndicator}`)

      if(this.updateIndicator){
        this.log.debug(`update indicator present`)
        if(this.changeIndicator){
          this.log.debug(`Change indicator present`)
          
          let range = this.pages[0].tags[this.updateType as keyof Tags][id].metaData.range
          let length = this.pages[0].tags[this.updateType as keyof Tags][id].name.length

          this.log.debug(`Setting the following: range = ${range} and length = ${length}`)

          this.quill.removeFormat(range, length);
          this.log.debug(`previous word removed`)
          this.updateTextInPage(range, this.updateType, this.forValue(this.pages[0].tags[this.updateType as keyof Tags][id].name, this.updateType, id))

          this.attachClickEvent(this.sideBarTitle, id)
          this.changeIndicator = false
        }
        this.updateIndicator = false

      } else {
        this.log.debug(`update indicator absent`)
        if(this.textPresent){
          this.log.debug(`text present true`)
          this.quill.deleteText(this.range.index, this.text.length)
          this.log.debug(`Removed the previous word`)
          this.updateTextInPage(this.range.index, this.sideBarTitle, this.forValue(this.text, this.sideBarTitle, id));

          this.textPresent = false;
      } else {
        this.log.debug(`text present false`)
          this.updateTextInPage(this.range.index, this.sideBarTitle, this.forValue(this.pages[0].tags[this.sideBarTitle as keyof Tags][id].name, this.sideBarTitle, id));

          this.textPresent = false;
      }
      this.log.debug(`adding the button listener`)
        this.attachClickEvent(this.sideBarTitle, id)
      }

      this.close();
      this.log.info(`newTagSave process :: Finished`)
    }

    private forValue(text: string, icontype: string, id: number){
      this.log.debug(`setting ${this.icons.getIcon(icontype) + text}`)
      return  this.icons.getIcon(icontype) + text + this.setTooltip(icontype, id);
    }

    private setTooltip(type: string, id: number){

      let tooltip = '';

      switch(type){
        case PERSON:
          tooltip = '<div class="tooltip"><table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' + this.pages[0].tags.person[id].notes + '</td><table></div>'
        break;
        case PLACE:
          tooltip = '<div class="tooltip">' +
                    '<table class="tooltipTable"><tr><td><strong>Location:</strong></td><td>' + this.pages[0].tags.place[id].location + '</td></tr>' +
                    '<tr><td><strong>Area:</strong></td><td>' + this.pages[0].tags.place[id].area + '</td></tr>' +
                    '<tr><td><strong>Notes:</strong></td><td>' + this.pages[0].tags.place[id].notes + '</td></tr></table>' +
                  '</div>'
        break;
        case ITEM:
          tooltip = '<div class="tooltip">' +
                '<table class="tooltipTable"><tr><td><strong>Type:</strong></td><td>' + this.pages[0].tags.item[id].type + '</td>' +
                '<tr><td><strong>Notes:</strong></td><td>' + this.pages[0].tags.item[id].notes + '</td></tr></table>' +
              '</div>'
        break;
        case MISC:
          tooltip = '<div class="tooltip">' +
                '<table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' + this.pages[0].tags.misc[id].notes + '</td></tr></table>' +
              '</div>'
        break;
        default:
        break;
      }

      return tooltip;
    }

    private updateTextInPage(index: number, type: string, text: string){
      this.log.info(`updating text in page :: Starting`)
      this.log.debug(`padded in, index = ${index}, type = ${type} and text = ${text}`)

      this.quill.insertEmbed(index, type,text);
      this.quill.setSelection(index + text.length , index + text.length);
      this.log.info(`updating text in page :: Finnished`)
    }

    private attachClickEvent(buttonClass: string, id: number){
      this.log.info(`attach click envent :: Starting`)
      // maintains the number of entries on the page for each tag type, which allows the correct
      //button to get its event handler
      let count = this.buttonEvents.get(buttonClass)
      let queryString = '.'+ buttonClass

      this.log.debug(`this run is using: ButtonClass = ${buttonClass}, count = ${count} and querystring = ${queryString}`)

      //finds the button all the buttons on the page that matches the class passed in eg person
      //and there is also two systems to find out which button this is, first is a running count map for all
      //new button added to the page. The
      let button: any;
      if(this.changeIndicator || this.loadingContent){
        this.log.debug(`Running a change : ${this.changeIndicator} or loading : ${this.loadingContent}`)
        this.log.debug(`Updating button that matches index number: ${this.pages[0].tags[buttonClass as keyof Tags][id].metaData.buttonIndex}`)
        button = this.elementRef.nativeElement.querySelectorAll(queryString)[this.pages[0].tags[buttonClass as keyof Tags][id].metaData.buttonIndex];
      } else {
        this.log.debug(`Running a new button`)
        button = this.elementRef.nativeElement.querySelectorAll(queryString)[count];
      }
      //adds the event to the button
      this.renderer.listen(button, 'click', (event) => this.tagViewAndUpdate(event, id, buttonClass));
      this.renderer.listen(button, 'hover', (event) => this.toolTipIdAndTypeSet(event, id, buttonClass));
      this.log.debug(`click applied to button wth id = ${id}`)

      if(!this.changeIndicator && !this.loadingContent){
        //recording the number of the button in order of buttons for that type so that if the text
        //is channge we can assign the correct button
        this.pages[0].tags[buttonClass as keyof Tags][id].metaData.buttonIndex = count
        this.log.debug(`Button id is updated in page to ${count}`)

        //increment the button so we can find the new one on the next call
        count++

        //store the increment
        this.buttonEvents.set(buttonClass, count);
        this.log.debug(`button set ${buttonClass} has been updated to ${count}`)

      }
      this.log.info(`attach click envent :: Finish`)
    }

    open(){
        this.visible = true;
    }

    close(){
      this.log.info(` close :: starting` )
        this.visible = false;
        this.changeIndicator = false;
        this.updateIndicator = false;
        this.tagEntry = this.setupOrClearTagEntry();
      this.log.debug(`change indicator = ${this.changeIndicator}`)
      this.log.debug(`update indicator = ${this.updateIndicator}`)
      this.log.info(` close :: finishing` )
    }

    toolTipIdAndTypeSet(event: any, id: number, type: string){
      this.toolId = id
      this.toolType = type
    }

    tagViewAndUpdate(event: any, id: number, type: string){
      this.log.info(`starting the tag update view`)
      let tagData = this.pages[0].tags[type as keyof Tags][id]
      this.log.debug(tagData)
      this.displayDataSidebar(tagData, type);

      this.sideBarTitle = type
      this.updateIndicator = true;
      this.updateType = type;
      this.log.debug(`opening the side menu`)
      this.open();
      this.log.info(`finishing the tag update view`)
    }

    private displayDataSidebar(tagData: any, type: string){

      switch(type){
        case PERSON:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.previousName = tagData.name
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.metaData.range
            this.tagEntry.buttonIndex = tagData.metaData.buttonIndex
        break;
        case PLACE:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.previousName = tagData.name
            this.tagEntry.location = tagData.location
            this.tagEntry.previousLocation = tagData.location
            this.tagEntry.area = tagData.area
            this.tagEntry.previousArea = tagData.area
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.metaData.range
            this.tagEntry.buttonIndex = tagData.metaData.buttonIndex
        break;
        case ITEM:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.previousName = tagData.name
            this.tagEntry.itemtype = tagData.type
            this.tagEntry.previousItemtype = tagData.type
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.metaData.range
            this.tagEntry.buttonIndex = tagData.metaData.buttonIndex
        break;
        case MISC:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.previousName = tagData.name
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.metaData.range
            this.tagEntry.buttonIndex = tagData.metaData.buttonIndex
        break;
        default:
            break
      }

    }

    created(editor: any){
        this.log.info(`Quill editor created`)

        this.quill = editor;
        this.newQuillEditor.emit(this.quill)
        this.log.info(`new editor announced and shared`)

        this.log.info(`Setting content for the page:: Started`)
        this.loadingContent = true;
        try {
          this.loadPageContent()
        } catch (error) {
          this.log.error(`issue loading content`)
          this.log.error(`${error}`)
        } finally {
          this.loadingContent = false;
        }


        this.quill.focus()
    }

    tagMenu(tagType: string){
      this.sideBarTitle = tagType;
      this.range = this.quill.getSelection();

      if(this.range.length == 0 || this.range == null){
        this.tagEntry.name = ''
        this.tagEntry.misc = [this.sideBarTitle]

        this.textPresent = false;
      } else {
        this.tagEntry.name = this.text = this.quill.getText(this.range.index, this.range.length);
        this.tagEntry.misc = [this.sideBarTitle, this.text]

        this.textPresent = true;
      }
      this.tagEntry.range = this.range.index

      this.open();
    }

    // ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    //   for(let propName in changes){
    //     // this.log.debug(`changed detected ${propName}`)
    //     if(propName == "sending"){
    //       this.log.debug(`change in ${propName} detected`)
    //       if(this.sending){
    //         this.log.debug(`Recieved new message, highlighting tags`)
    //         this.log.debug(`highlighting complete`)
    //         this.highlightMessageRecieved.emit(true)
    //       } else {
    //         this.log.debug(`Message acknowledgement ignoring`)
    //       }
    //       // let change = changes[propName]
    //       // if(change.isFirstChange()){
    //       //   this.log.debug(`First time highlightedMap is set with `)
    //       // } else {
    //       //   this.log.debug(`acting on change, iterating map`)
    //       //     this.highlightConfig.map.forEach((tags: Map<string, number[]>, active:boolean) => {
    //       //       this.log.debug(`Working through active: ${active} buttons first`)
    //       //       tags.forEach((ids: number[], type: string) => {
    //       //         this.highlightTag(ids, type, active)
    //       //       })
    //       //     })
    //       // }
    //     }
    //   }
    // }

    highlightTag(ids: number[], type: string, active: boolean){
      this.log.debug(`iterating array`)
      for(let id of ids){
        this.log.debug(`first button wit id ${id} and type ${type} and this will be an active=${active} highlight`)
        this.applyHighlight(id, type, active)
      }

    }

    private applyHighlight(id: number, type: string, active: boolean){
      let button = this.elementRef.nativeElement.querySelectorAll("."+type)[id]
      this.log.debug(`button found ${button}`)
      if(active){
        this.log.debug(`hughlighting`)
        this.renderer.removeClass(button, "reference")
        this.renderer.addClass(button, "highlight")
        this.renderer.addClass(button, type+"Glow")
      } else {
        this.log.debug(`reverting`)
        this.renderer.removeClass(button, "highlight")
        this.renderer.removeClass(button, type+"Glow")
        this.renderer.addClass(button, "reference")
      }
    }

}
