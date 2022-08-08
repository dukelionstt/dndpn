import { Component, OnInit } from "@angular/core";
import { WidgetsListService } from "../data/widgets.list.service";
import { Widget } from "../model/widget-model";

@Component({
    selector: 'tag-list',
    templateUrl: './tag.list.component.html'
})


export class TagListComponent implements OnInit{
    tag = 'person';

    widgets!: Widget[]
    loading!: boolean

    constructor(private widgetsList: WidgetsListService){}

    ngOnInit(): void {
        this.loading = true
        this.widgets = this.widgetsList.getWidgetsList();
        this.loading = false
    }
}