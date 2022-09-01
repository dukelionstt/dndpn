import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { WidgetsListService } from "../data/widgets.list.service";
import { LoggerService } from "../logger.service";
import { Page } from "../model/page-model";
import { Widget } from "../model/widget-model";



@Component({
    selector: 'tag-list',
    templateUrl: './tag.list.component.html'
})


export class TagListComponent implements OnInit{

  @Input()
  quill!: any;

  @Input()
  pages!: Page[];

  @Output() highlightTag = new EventEmitter();

  tag = 'person';

  widgets!: Widget[]
  loading!: boolean
  icons = new Map();
  tags = new Map();

  constructor(private widgetsList: WidgetsListService,
              private log: LoggerService,
              private elementRef: ElementRef,
              private renderer: Renderer2){}

  ngOnInit(): void {
      this.loading = true

      this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/008080/human-head.png')
      this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png')
      this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
      this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png')

      // this.widgets = this.widgetsList.getWidgetsList();
      this.loading = false
  }

  goToTagInPage(index:number, type: string){
    // this.quill.setSelection(index,1)
    let temp = new Map<string, number[]>();
    temp.set(type, [index])
    this.log.debug(`highlight tag called, index:${index} & type:${type} passed. This is in tag list component`)
    this.highlightTag.emit(temp)
    temp.clear
  }

  getImgSrc(imgtype: string){
    return this.icons.get(imgtype);
  }
}
