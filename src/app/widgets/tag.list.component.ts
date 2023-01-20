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
    this.loading = true;

    // this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png')
    // this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/F1B620/castle.png')
    // this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
    // this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/952B60/magical-scroll.png')

    // this.widgets = this.widgetsList.getWidgetsList();
    this.widgetStates = WIDGET_STATES;
    this.menuService.personWidgetEvent.subscribe(
      this.openCloseWidget(PERSON, false, !this.widgetStates.get(PERSON))
    );
    this.menuService.placeWidgetEvent.subscribe(
      this.openCloseWidget(PLACE, false, !this.widgetStates.get(PLACE))
    );
    this.menuService.itemWidgetEvent.subscribe(
      this.openCloseWidget(ITEM, false, !this.widgetStates.get(ITEM))
    );
    this.menuService.miscWidgetEvent.subscribe(
      this.openCloseWidget(MISC, false, !this.widgetStates.get(MISC))
    );

    this.active = false;
    this.isNewButton = false;
  }

  ngAfterViewInit(): void {
    this.addAnimationListeners();
    this.loading = false;
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

  openCloseWidget(widgetName: string, animation: boolean, open: boolean) {
    let widget = this.elementRef.nativeElement.querySelector(
      `#${widgetName}Widget`
    );
    if (animation) {
      this.renderer.removeClass(widget, open ? 'open' : 'close');
      this.renderer.addClass(widget, open ? 'opened' : 'closed');
    } else {
      this.renderer.addClass(widget, open ? 'open' : 'close');
    }
    this.widgetStates.set(widgetName, !this.widgetStates.get(widgetName));
    this.log.debug(this.widgetStates);
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
