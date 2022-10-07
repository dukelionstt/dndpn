import {
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
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { WidgetsListService } from '../data/widgets.list.service';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { Widget } from '../model/widget-model';
import { QuillToolbarComponent } from '../quill/quill.toolbar.component';
import { IconService } from '../service/icon.service';
import { HiglightEditorTagsService } from './higlight.editor.tags.service';

const POST_FIX_ACTIVE = 'TagActive';
const POST_FIX = 'Tag';

@Component({
  selector: 'tag-list',
  templateUrl: './tag.list.component.html',
})
export class TagListComponent implements OnInit {
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
    private highlightTagService: HiglightEditorTagsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png')
    // this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/F1B620/castle.png')
    // this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
    // this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/952B60/magical-scroll.png')

    // this.widgets = this.widgetsList.getWidgetsList();
    this.loading = false;
    this.active = false;
    this.isNewButton = false;
  }

  goToTagInPage(event: any, index: number, type: string) {
    this.log.info(`goToTagInPage process :: Started`);
    this.log.debug(`passed in, index:${index} & type:${type} passed.`);
    this.highlightTagService.highlightProcess(
      event,
      new Map<string, number[]>().set(type, [index]),
      type,
      index
    );

    this.log.info(`highlight process :: Finished`);
  }
}
