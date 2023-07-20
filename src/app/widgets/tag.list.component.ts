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
import { BehaviorSubject, last } from 'rxjs';
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
import { HighlightedTag } from '../model/highlighted-tag.model';

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
  selectedTab!: number;

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
  previousButton!: any;
  previousID!: number;
  previousType!: string;
  previousState!: boolean;
  icons = new IconService();
  tags = new Map();
  highlightedTagMap!: Map<string, HighlightedTag>

  constructor(
    private widgetsList: WidgetsListService,
    private log: LoggerService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private highlightTagService: HiglightEditorTagsService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.log.info(`starting`, 'OnInit', 'TagListComponent');
    this.loading = true;
    // this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png')
    // this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/F1B620/castle.png')
    // this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
    // this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/952B60/magical-scroll.png')

    this.active = false;
    this.isNewButton = false;
    this.log.info(`finished`, 'OnInit', 'TagListComponent');
  }

  ngAfterViewInit(): void {
    this.log.info(`Starting`, 'ngAfterViewInit', 'TagListComponent');
    this.widgetStates = WIDGET_STATES;

    // this.widgets = this.widgetsList.getWidgetsList();
    this.log.debug(
      `setting widget states`,
      'ngAfterViewInit',
      'TagListComponent'
    );

    this.log.debug(
      `adding menu service listeners`,
      'ngAfterViewInit',
      'TagListComponent'
    );
    // this.pages[this.selectedTab].

    this.menuService.personWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(PERSON);
    });
    this.log.debug(
      `person widget added`,
      'ngAfterViewInit',
      'TagListComponent'
    );
    this.menuService.placeWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(PLACE);
    });
    this.log.debug(`place widget added`, 'ngAfterViewInit', 'TagListComponent');
    this.menuService.itemWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(ITEM);
    });
    this.log.debug(`item widget added`, 'ngAfterViewInit', 'TagListComponent');
    this.menuService.miscWidgetEvent.subscribe((flag) => {
      this.openCloseWidget(MISC);
    });

    this.menuService.allTagsEvent.subscribe((flag) => {
      this.openCloseWidget(PERSON);
      this.openCloseWidget(PLACE);
      this.openCloseWidget(ITEM);
      this.openCloseWidget(MISC);
    });
    this.log.debug(`misc widget added`, 'ngAfterViewInit', 'TagListComponent');
    this.log.debug(
      `adding animation listeners`,
      'ngAfterViewInit',
      'TagListComponent'
    );
    this.addAnimationListeners();
    this.log.debug(
      `animation listeners complete`,
      'ngAfterViewInit',
      'TagListComponent'
    );
    this.loading = false;
    this.log.info(`finishing`, 'ngAfterViewInit', 'TagListComponent');
  }

  private addAnimationListeners() {
    this.log.info('Starting', 'addAnimationListeners', 'TagListComponent');
    for (let [key, value] of Object.entries(this.pages[0].tags)) {
      this.log.debug(
        `${key} is getting an event listener`,
        'addAnimationListeners',
        'TagListComponent'
      );

      let widget = this.elementRef.nativeElement.querySelector(`#${key}Widget`);
      this.renderer.listen(widget, 'animationend', ($event) => {
        this.log.debug(
          `Animation running "${$event.animationName}"`,
          'addAnimationListeners',
          'TagListComponent'
        );

        if ($event.animationName === 'closing') {
          this.log.info(
            `Closing ${key} widget`,
            'addAnimationListeners',
            'TagListComponent'
          );
          this.openCloseWidget(key, true, false);
          this.log.info(
            `${key} widget closed`,
            'addAnimationListeners',
            'TagListComponent'
          );
        } else if ($event.animationName === 'opening') {
          this.openCloseWidget(key, true, true);
        }
        this.log.debug(
          `Animation "${$event.animationName}" complete`,
          'addAnimationListeners',
          'TagListComponent'
        );
      });
      this.log.debug(
        `${key} listener added`,
        'addAnimationListeners',
        'TagListComponent'
      );
    }
    this.log.info('Finishing', 'addAnimationListeners', 'TagListComponent');
  }

  openCloseWidget(widgetName: string, animation?: boolean, open?: boolean) {
    this.log.info(`Starting`, 'openCloseWidget', 'TagListComponent');

    let widgetElementId = `#${widgetName}Widget`;
    this.log.debug(
      `getting widget element id ${widgetElementId}`,
      'openCloseWidget',
      'TagListComponent'
    );
    let widget = this.elementRef.nativeElement.querySelector(widgetElementId);

    this.log.debug(widget, 'openCloseWidget', 'TagListComponent');
    this.log.debug(
      `widget found, adding class`,
      'openCloseWidget',
      'TagListComponent'
    );

    this.log.debug(
      `open is set to ${open}`,
      'openCloseWidget',
      'TagListComponent'
    );
    this.log.debug(
      `animation is set to ${animation}`,
      'openCloseWidget',
      'TagListComponent'
    );

    let flag = open != undefined ? open : !this.widgetStates.get(widgetName);
    let animationFlag = animation != undefined ? animation : false;

    this.log.debug(
      `flag is set to ${flag}`,
      'openCloseWidget',
      'TagListComponent'
    );
    this.log.debug(
      `animationFlag is set to ${animationFlag}`,
      'openCloseWidget',
      'TagListComponent'
    );

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
    this.log.info(`Finishing`, 'openCloseWidget', 'TagListComponent');
  }

  goToTagInPage(buttonId: string, index: number, type: string) {
    this.log.info(`Started`, 'goToTagInPage', 'TagListComponent');
    this.log.debug(
      `highlight tag called, index:${index} & type:${type} passed. This is in tag list component`,
      'goToTagInPage',
      'TagListComponent'
    );

    this.log.debug(type + index, 'goToTagInPage', 'TagListComponent');
    
    

    this.log.debug(
      `This is a ${this.previousButton != buttonId? 'new button' : 'previous button'}`,
      'goToTagInPage',
      'TagListComponent'
    );

    if(this.previousButton != undefined){
      
      if (this.previousButton != buttonId) {
        this.log.info(
          `tag button toggle present, switching highlights`,
          'goToTagInPage',
          'TagListComponent'
        );
        this.previousState = !this.previousState;
        this.previousButton = this.updateClassList(
          this.previousButton,
          this.previousType,
          this.previousState
        );
        this.highlightTagService.sendHighlightTag(
          [this.previousID],
          this.previousType,
          this.previousState
        );
        this.isNewButton = false;
        this.log.info(
          `tag button toggle present, highlights switched`,
          'goToTagInPage',
          'TagListComponent'
        );
        
      } else {
        this.active = !this.active;
      }
    } else {
      this.active = !this.active;
    }

    this.updateClassList(buttonId, type, this.active );
    this.highlightTagService.sendHighlightTag([index], type, this.active);
    this.log.info(
      `new tag button entries highlighted`,
      'goToTagInPage',
      'TagListComponent'
    );
    this.previousButton = buttonId;
    this.previousID = index;
    this.previousType = type;
    this.previousState = this.active;

    

    

    this.log.info(`Finished`, 'goToTagInPage', 'TagListComponent');
  }

  // private findButtonElement(path: any) {
  //   this.log.info(`Started`, 'findButtonElement', 'TagListComponent');
  //   let index = 0;
  //   for (let element of path) {
  //     if (element.nodeName == 'BUTTON') {
  //       if (this.previousButton) {
  //         this.log.debug(
  //           `The previous element: ${
  //             this.previousButton[this.previousIndex].id
  //           }`,
  //           'findButtonElement',
  //           'TagListComponent'
  //         );
  //         this.log.debug(
  //           `new element to be checked: ${element.id}`,
  //           'findButtonElement',
  //           'TagListComponent'
  //         );
  //         if (this.previousButton[this.previousIndex].id != element.id) {
  //           if (this.previousState) {
  //             this.log.debug(
  //               `changing the is new button to true`,
  //               'findButtonElement',
  //               'TagListComponent'
  //             );
  //             this.isNewButton = true;
  //           }
  //         }
  //       }
  //       break;
  //     } else {
  //       index++;
  //     }
  //   }
  //   this.log.info(`Finished`, 'findButtonElement', 'TagListComponent');
  //   return index;
  // }

  private updateClassList(
    id: string,
    type: string,
    active: boolean
  ) {
    this.log.info(`starting`, 'updateClassList', 'TagListComponent');
    this.log.info(`updating ${type} tag button status to active: ${active}`, 'updateClassList', 'TagListComponent');
    let button = this.elementRef.nativeElement.querySelector(`#${id}`)
    this.log.debug(`altering class list`, 'updateClassList', 'TagListComponent');
    this.log.debug(button);
    let index = 0;

    if (active) {
      try {
        this.renderer.removeClass(button,type + POST_FIX);
        this.renderer.addClass(button, type + POST_FIX_ACTIVE);
        // (type + POST_FIX, type + POST_FIX_ACTIVE);
        this.log.info(`${type} tag button active`, 'updateClassList', 'TagListComponent');
        this.log.debug(`class list changed`, 'updateClassList', 'TagListComponent');
        // this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
          , 'updateClassList', 'TagListComponent'
        );
        this.log.error(error);
      }
    } else {
      try {
        // classList.replace(type + POST_FIX_ACTIVE, type + POST_FIX);
        this.renderer.removeClass(button,type + POST_FIX_ACTIVE);
        this.renderer.addClass(button, type + POST_FIX);
        this.log.info(`${type} tag button de-active`, 'updateClassList', 'TagListComponent');
        this.log.debug(`class list changed`, 'updateClassList', 'TagListComponent');
        // this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
          , 'updateClassList', 'TagListComponent'
        );
        this.log.error(error);
      }
    }
    this.log.info(`Finished`, 'updateClassList', 'TagListComponent');
    return id;
  }

  // getImgSrc(imgtype: string){
  //   return this.icons.get(imgtype);
  // }
}
