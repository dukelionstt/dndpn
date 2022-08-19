import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { ItemTypesService } from "../data/item.types.service";

import { TagsDropdownService } from "../data/tags-dropdown.service";
import { Item } from "../model/item-model";
import { Misc } from "../model/misc-model";
import { Page } from "../model/page-model";
import { Person } from "../model/person-model";
import { Place } from "../model/place-model";
import { TagEntry } from "../model/tag-entry-model";

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

    @Input()
    pages!: Page[];

    @Input()
    sideBarTitle!: string;

    @Input()
    tagEntry!: TagEntry;

    @Input()
    updateIndicator!: boolean;

    @Input()
    changeIndicator!: boolean;

    @Input()
    updateType!: string;

    @Output()
    newTagSave = new EventEmitter<any>();

    selectedTags = [];
    listOfTags: Array<{value:string, label:string}> = [];
    listOfItemTypes: Array<{value:string, label:string}> = [];
    date: Date = new Date()




    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    constructor(private tagsDropdown: TagsDropdownService,
                private intemTypeDropdown: ItemTypesService){}

    ngOnInit(): void {
        this.listOfTags = this.tagsDropdown.getListOfTags(this.sideBarTitle);
        this.listOfItemTypes = this.intemTypeDropdown.getListofItemTypes();

        // this.validateForm = this.formbuilder.group({
        //   personNameTxtBx: null,
        //   personNotesTxtAr: null,
        //   personDateLbl: null
        // })
    }

    save(){
        // todo
    }

    spaceBar(){
        //todo
    }

    tagSave(){
        let tags: any;
        let id = 0;
        if(this.updateIndicator){
            tags = this.pages[0].tags.get(this.updateType);
            id = this.tagEntry.id

            if(tags[id].name != this.tagEntry.name){
                this.changeIndicator = true;
            }
            tags[id] = this.convertEntry(this.updateType, id);
            this.pages[0].tags.set(this.sideBarTitle, tags);

        } else {
            tags = this.pages[0].tags.get(this.sideBarTitle);
            id = tags.length
            tags.push(this.convertEntry(this.sideBarTitle, id));
            this.pages[0].tags.set(this.sideBarTitle, tags);
        }

        

        this.newTagSave.emit([id, this.changeIndicator]);
    }

    convertEntry(objectType: string, id: number): any{

        switch(objectType){
            case PERSON:
                let person: Person = {
                    id: id,
                    name: this.tagEntry.name!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!,
                    metaData: {
                        range: this.tagEntry.range,
                        length: this.tagEntry.name.length,
                        buttonIndex: 0
                    }
                }
                return person
            case PLACE:
                let place: Place = {
                    id: id,
                    name: this.tagEntry.name!,
                    location: this.tagEntry.location!,
                    area: this.tagEntry.area!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!,
                    metaData: {
                        range: this.tagEntry.range,
                        length: this.tagEntry.name.length,
                        buttonIndex: 0
                    }
                }
                return place
            case ITEM:
                let item: Item = {
                    id: id,
                    name: this.tagEntry.name!,
                    type: this.tagEntry.itemtype,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!,
                    metaData: {
                        range: this.tagEntry.range,
                        length: this.tagEntry.name.length,
                        buttonIndex: 0
                    }
                }
                return item
            case MISC:
                let misc: Misc = {
                    id: id,
                    name: this.tagEntry.name!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!,
                    metaData: {
                        range: this.tagEntry.range,
                        length: this.tagEntry.name.length,
                        buttonIndex: 0
                    }
                }
                return misc
            default:
                break
        }
    }
}

