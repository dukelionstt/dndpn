import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { WidgetsListService } from "../data/widgets.list.service";
import { Widget } from "../model/widget-model";



@Component({
    selector: 'tag-list',
    templateUrl: './tag.list.component.html'
})


export class TagListComponent implements OnInit{

  @Input()
  quill!: any;

  tag = 'person';

  widgets!: Widget[]
  loading!: boolean
  icons = new Map();

  constructor(private widgetsList: WidgetsListService){}

  ngOnInit(): void {
      this.loading = true

      this.icons.set(PERSON, '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>')
      this.icons.set(PLACE, '<img src="https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png"/>')
      this.icons.set(ITEM, '<img src="https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png"/>')
      this.icons.set(MISC, '<img src="https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png"/>')

      this.widgets = this.widgetsList.getWidgetsList();
      this.loading = false


  }

  goToTagInPage(index:number){
    this.quill.setSelection(index,1)
  }

  getImgSrc(imgtype: string){
    return this.icons.get(imgtype);
  }
}
