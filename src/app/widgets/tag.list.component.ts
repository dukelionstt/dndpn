import {

  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  Sanitizer,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { last } from 'rxjs';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { WidgetsListService } from '../data/widgets.list.service';
import { LoggerService } from '../logger.service';
import { WIDGET_STATES } from '../mock-data/widget-states-mock';

import { Page } from '../model/page-model';
import { Widget } from '../model/widget-model';
import { QuillToolbarComponent } from '../quill/quill.toolbar.component';
import { IconService } from '../service/icon.service';
import { MenuService } from '../service/menu.service';
import { HiglightEditorTagsService } from './higlight.editor.tags.service';

const POST_FIX_ACTIVE = 'TagActive';
const POST_FIX = 'Tag';

@Component({
  selector: 'tag-list',
  templateUrl: './tag.list.component.html',
})

export class TagListComponent implements OnInit, AfterViewInit {

  @Input()
  quill!: any;

  @Input()
  pages!: Page[];

  @Input()
  quilltoolbar!: QuillToolbarComponent;

  @ViewChild('tagButton')
  tagButton!: ElementRef;

  tag = 'person';

  widgets!: Widget[];

  widgetStates!: Map<string, boolean>;
  loading!: boolean;
  active!: boolean;
  isNewButton!: boolean;
  previousIndex!: number;
  previousButton!: any;
  previousID!: number;
  previousType!: string;
  previousState!: boolean;
  icons = new IconService();
  tags = new Map();

  constructor(
    private widgetsList: WidgetsListService,
    private log: LoggerService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private highlightTagService: HiglightEditorTagsService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.log.info(`tag.list.compent::ngOnInit:: starting`);
    this.loading = true;

    // this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png')
    // this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/F1B620/castle.png')
    // this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
    // this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/952B60/magical-scroll.png')

    this.active = false;
    this.isNewButton = false;
    this.log.info(`tag.list.compent::ngOnInit:: finished`);
  }

  ngAfterViewInit(): void {
    this.widgetStates = WIDGET_STATES;
    this.log.info(`tarting`,this.openCloseWidget.name, TagListComponent.name);
    // this.widgets = this.widgetsList.getWidgetsList();
    this.log.debug(`setting widget states`,this.openCloseWidget.name, TagListComponent.name);

    this.log.debug(
      `adding menu service listeners`, this.openCloseWidget.name, TagListComponent.name
    );

    this.menuService.personWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(PERSON)
    }
    );
    this.log.debug(`person widget added`,this.openCloseWidget.name, TagListComponent.name);
    this.menuService.placeWidgetEvent.subscribe( (flag) => {
      this.openCloseWidget(PLACE)
    }
      
    );
    this.log.debug(`place widget added`,this.openCloseWidget.name, TagListComponent.name);
    this.menuService.itemWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(ITEM)
    }
    );
    this.log.debug(`item widget added`,this.openCloseWidget.name, TagListComponent.name);
    this.menuService.miscWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(MISC)
    }
    );

    this.menuService.allTagsEvent.subscribe( (flag) => {
      this.openCloseWidget(PERSON)
      this.openCloseWidget(PLACE)
      this.openCloseWidget(ITEM)
      this.openCloseWidget(MISC)
    }
     
      
    );
    this.log.debug(`misc widget added`,this.openCloseWidget.name, TagListComponent.name);
    this.log.debug(
      `adding animation listeners`, this.openCloseWidget.name, TagListComponent.name
    );
    this.addAnimationListeners();
    this.log.debug(
      `animation listeners complete`, this.openCloseWidget.name, TagListComponent.name
    );
    this.loading = false;
    this.log.info(`inishing`,this.openCloseWidget.name, TagListComponent.name);
  }

  private addAnimationListeners() {
    for (let [key, value] of Object.entries(this.pages[0].tags)) {
      this.log.debug(`${key} is getting an event listener`);

      let widget = this.elementRef.nativeElement.querySelector(`#${key}Widget`);
      this.renderer.listen(widget, 'animationend', ($event) => {

        this.log.debug(`Animation running "${$event.animationName}"`);

        if ($event.animationName === 'closing') {

          this.log.info(`Closing ${key} widget`);
          this.openCloseWidget(key, true, false);
          this.log.info(`${key} widget closed`);

        } else if ($event.animationName === 'opening') {
          
          this.openCloseWidget(key, true, true);
        }
        this.log.debug(`Animation "${$event.animationName}" complete`);
      });
      this.log.debug(`${key} listener added`);
    }
  }

  openCloseWidget(widgetName: string, animation?: boolean, open?: boolean) {
    this.log.info(`Starting`,  this.openCloseWidget.name, TagListComponent.name);

    let widgetElementId = `#${widgetName}Widget`;
    this.log.debug(
      `getting widget element id ${widgetElementId}`, this.openCloseWidget.name, TagListComponent.name
    );
    let widget = this.elementRef.nativeElement.querySelector(widgetElementId);

    this.log.debug(widget,  this.openCloseWidget.name, TagListComponent.name);
    this.log.debug(
      `widget found, adding class`,  this.openCloseWidget.name, TagListComponent.name
    );

    this.log.debug(`open is set to ${open}`, this.openCloseWidget.name, TagListComponent.name)
    this.log.debug(`animation is set to ${animation}`, this.openCloseWidget.name, TagListComponent.name)

    let flag = open != undefined ? open : !this.widgetStates.get(widgetName);
    let animationFlag = animation != undefined? animation : false; 

    this.log.debug(`flag is set to ${flag}`, this.openCloseWidget.name, TagListComponent.name)
    this.log.debug(`animationFlag is set to ${animationFlag}`, this.openCloseWidget.name, TagListComponent.name)

    if (animationFlag) {
      this.renderer.removeClass(widget, flag ? 'open' : 'close');
      this.renderer.addClass(widget, flag ? 'opened' : 'closed');
      // this.widgetStates.set(widgetName, !this.widgetStates.get(widgetName));
      this.widgetStates.set(widgetName, flag);
    } else {
      this.renderer.removeClass(widget, flag ? 'closed' : 'opened');
      this.renderer.addClass(widget, flag ? 'open' : 'close');
    }
    
    this.log.debug(this.widgetStates);
    this.log.info(`Finishing`,  this.openCloseWidget.name, TagListComponent.name);
  }

  goToTagInPage(event: any, index: number, type: string) {
    this.log.info(`highlight process :: Started`);
    this.log.debug(
      `highlight tag called, index:${index} & type:${type} passed. This is in tag list component`
    );

    this.log.debug(type + index);
    this.log.debug(event);
    let pathIndex = this.findButtonElement(event.path);

    if (this.isNewButton) {
      this.log.info(`tag button toggle present, switching highlights`);
      this.previousState = !this.previousState;
      this.previousButton[this.previousIndex].classList = this.updateClassList(
        this.previousButton[this.previousIndex].classList,
        this.previousType,
        this.previousState
      );
      this.highlightTagService.sendHighlightTag(
        [this.previousID],
        this.previousType,
        this.previousState
      );
      this.isNewButton = false;
      this.log.info(`tag button toggle present, highlights switched`);
    } else {
      this.active = !this.active;
    }

    event.path[pathIndex].classList = this.updateClassList(
      event.path[pathIndex].classList,
      type,
      this.active
    );
    this.highlightTagService.sendHighlightTag([index], type, this.active);
    this.log.info(`new tag button entries highlighted`);

    this.previousButton = event.path;
    this.previousIndex = pathIndex;
    this.previousID = index;
    this.previousType = type;
    this.previousState = this.active;

    this.log.info(`highlight process :: Finished`);
  }

  private findButtonElement(path: any) {
    this.log.info(`find button element :: Started`);
    let index = 0;
    for (let element of path) {
      if (element.nodeName == 'BUTTON') {
        if (this.previousButton) {
          this.log.debug(
            `The previous element: ${
              this.previousButton[this.previousIndex].id
            }`
          );
          this.log.debug(`new element to be checked: ${element.id}`);
          if (this.previousButton[this.previousIndex].id != element.id) {
            if (this.previousState) {
              this.log.debug(`changing the is new button to true`);
              this.isNewButton = true;
            }
          }
        }
        break;
      } else {
        index++;
      }
    }
    this.log.info(`find button element :: Finished`);
    return index;
  }

  private updateClassList(
    classList: DOMTokenList,
    type: string,
    active: boolean
  ) {
    this.log.info(`updateing tag button :: Started`);
    this.log.info(`updating ${type} tag button status to active: ${active}`);
    this.log.debug(`altering class list`);
    this.log.debug(classList);
    let index = 0;

    if (active) {
      try {
        classList.replace(type + POST_FIX, type + POST_FIX_ACTIVE);
        this.log.info(`${type} tag button active`);
        this.log.debug(`class list changed`);
        this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
        );
        this.log.error(error);
      }
    } else {
      try {
        classList.replace(type + POST_FIX_ACTIVE, type + POST_FIX);
        this.log.info(`${type} tag button de-active`);
        this.log.debug(`class list changed`);
        this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
        );
        this.log.error(error);
      }
    }
    this.log.info(`updateing tag button :: Finished`);
    return classList;
  }

  // getImgSrc(imgtype: string){
  //   return this.icons.get(imgtype);
  // }

}
