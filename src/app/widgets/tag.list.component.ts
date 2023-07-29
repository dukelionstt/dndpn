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
  highlightedTagMap: Map<string, Map<string, HighlightedTag>> = new Map();

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

  buildHighlightedTagMap() {
    this.log.info(`starting`, 'buildHighlightedTagMap', 'TagListComponent');
    // let childmap: Map<string, HighlightedTag> = new Map();

    for (let [key, value] of Object.entries(
      this.pages[this.selectedTab].tags
    )) {
      let childmap: Map<string, HighlightedTag> = new Map();
      this.log.debug(
        `running loop for key ${key} and value (next line)`,
        'buildHighlightedTagMap',
        'TagListComponent'
      );
      this.log.debug(value);
      for (let tag of value) {
        this.log.debug(
          `running loop tag (next line)`,
          'buildHighlightedTagMap',
          'TagListComponent'
        );
        this.log.debug(tag);
        let tempHighlightedTag: HighlightedTag = {
          buttonID: key + tag.metaData.buttonIndex,
          state: this.active,
          change: false,
        };
        childmap.set(tag.metaData.buttonIndex.toString(), tempHighlightedTag);
      }
      this.highlightedTagMap.set(key, childmap);
    }
    this.log.info(`finished`, 'buildHighlightedTagMap', 'TagListComponent');
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
    this.buildHighlightedTagMap();
    this.log.debug("displaying highlighedTagMap on mext log line", 'ngAfterViewInit', 'TagListComponent' )
    this.log.debug(this.highlightedTagMap);

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

    if (this.previousButton != undefined) {
      if (this.previousButton != buttonId) {
        if(this.previousState){
          this.updateHighlightedTagMap(this.previousButton, this.previousID.toString(), this.previousType, true)
        }
      }
    }
    this.previousState = this.updateHighlightedTagMap(buttonId, index.toString(), type, true);

    this.updateClassList();

    this.previousButton = buttonId;
    this.previousID = index;
    this.previousType = type;
    

    this.log.info(`Finished`, 'goToTagInPage', 'TagListComponent');
  }

  private updateHighlightedTagMap(
    buttonId: string,
    index: string,
    type: string,
    change: boolean
  ) {
    this.log.info(`Starting`, 'updateHighlightedTagMap', 'TagListComponent');
    this.log.info(`Values passed in are buttonID = ${buttonId}, index=${index}, type=${type} and change=${change}`, 'updateHighlightedTagMap', 'TagListComponent');

    let tempState: boolean = false;
    let tempHighlightedMap = this.highlightedTagMap.get(type);
    this.log.debug("displaying tempHighlightedMap on mext log line", 'updateHighlightedTagMap', 'TagListComponent' )
    this.log.debug(tempHighlightedMap);

    if (tempHighlightedMap) {
      let tempTagMap = tempHighlightedMap.get(index);
      this.log.debug("displaying tempTagMap on mext log line", 'updateHighlightedTagMap', 'TagListComponent' )
      this.log.debug(tempTagMap);
      if (tempTagMap) {
        if (tempTagMap.buttonID == buttonId) {
          tempTagMap.change = change;
          tempTagMap.state = tempState = change? !tempTagMap.state : tempTagMap.state;
          tempHighlightedMap.set(index, tempTagMap);
          this.highlightedTagMap.set(type, tempHighlightedMap);
        } else {
          this.log.error(
            `button id miss match, expected ${buttonId} but got ${tempTagMap?.buttonID} instead.`,
            'goToTagInPage',
            'TagListComponent'
          );
        }
      } else {
        this.log.error(
          `button index ${index} of type ${type} not present, cant update`,
          'updateHighlightedTagMap',
          'TagListComponent'
        );
      }
    } else {
      this.log.error(
        `${type} map is undefined, unable to update`,
        'updateHighlightedTagMap',
        'TagListComponent'
      );
    }

    this.log.info(`Finished`, 'updateHighlightedTagMap', 'TagListComponent');
    return tempState;
  }


  private updateClassList() {
    this.log.info(`starting`, 'updateClassList', 'TagListComponent');

    this.highlightedTagMap.forEach((tagMap, type) => {
      tagMap.forEach((tag, index) => {
        if (tag.change) {
          this.toggleClass(tag.buttonID, tag.state, type);
          this.highlightTagService.sendHighlightTag([parseInt(index)], type, tag.state, this.selectedTab)
          this.updateHighlightedTagMap(tag.buttonID, index, type, !tag.change);
        }
      });
    });

    this.log.info(`Finished`, 'updateClassList', 'TagListComponent');
  }

  private toggleClass(buttonID: string, state: boolean, type: string) {
    this.log.info(`starting`, 'toggleClass', 'TagListComponent');
    this.log.info(`Values passed in are buttonID = ${buttonID}, state=${state} and type=${type}`, 'toggleClass', 'TagListComponent');

    let button = this.elementRef.nativeElement.querySelector(`#${buttonID}`);
    this.log.debug('next line is the button object')
    this.log.debug(button)

    this.log.debug(
      `altering class list`,
      'toggleClass',
      'TagListComponent'
    );
    let index = 0;

    if (state) {
      try {
        this.renderer.removeClass(button, type + POST_FIX);
        this.renderer.addClass(button, type + POST_FIX_ACTIVE);
        
        
        this.log.info(
          `${type} tag button active`,
          'toggleClass',
          'TagListComponent'
        );
        this.log.debug(
          `class list changed`,
          'toggleClass',
          'TagListComponent'
        );
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`,
          'toggleClass',
          'TagListComponent'
        );
        this.log.error(error);
      }
    } else {
      try {
        this.renderer.removeClass(button, type + POST_FIX_ACTIVE);
        this.renderer.addClass(button, type + POST_FIX);
        this.log.info(
          `${type} tag button de-active`,
          'toggleClass',
          'TagListComponent'
        );
        this.log.debug(
          `class list changed`,
          'toggleClass',
          'TagListComponent'
        );
        // this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`,
          'toggleClass',
          'TagListComponent'
        );
        this.log.error(error);
      }
    }
    this.log.info(`Finished`, 'toggleClass', 'TagListComponent');
  }


}
