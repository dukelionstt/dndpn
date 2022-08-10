import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from "@angular/core";
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
export class SidebarComponent implements OnInit, OnChanges{

    @Input()
    pages!: Page[];

    @Input()
    sideBarTitle!: string;

    @Input()
    tagEntry!: TagEntry;

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

    ngOnChanges(changes: SimpleChanges): void {
        // for(const propName in changes){
        //     if(propName == 'textSelection'){
        //         if(changes[propName].currentValue != ''){
        //             this.tagEntry.name = changes[propName].currentValue
        //             this.tagEntry.misc = [this.sideBarTitle, changes[propName].currentValue]
        //         }
        //     } else if(propName == 'sideBarTitle'){
        //         if(changes[propName].currentValue != ''){
        //             if(this.tagEntry.name != undefined || this.tagEntry.name != ''){
        //                 this.tagEntry.misc = [this.sideBarTitle, this.tagEntry.name]
        //             } else {
        //                 this.tagEntry.misc = [this.sideBarTitle]
        //             }

        //         }
        //     }
        //     console.log(propName)
        // }
    }

    save(){
        // todo
    }

    spaceBar(){
        //todo
    }

    tagSave(){
      let tags = this.pages[0].tags.get(this.sideBarTitle);
      let id = tags.length
      tags.push(this.convertEntry(this.sideBarTitle));
      this.pages[0].tags.set(this.sideBarTitle, tags);

      this.newTagSave.emit(id);
    }

    toggleSideBar(type:string, flag:boolean){
        //placeholder
    }

    convertEntry(objectType: string): any{

        switch(objectType){
            case PERSON:
                let person: Person = {
                    id: this.tagEntry.id!,
                    name: this.tagEntry.name!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!
                }
                return person
            case PLACE:
                let place: Place = {
                    id: this.tagEntry.id!,
                    name: this.tagEntry.name!,
                    location: this.tagEntry.location!,
                    area: this.tagEntry.area!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!
                }
                return place
            case ITEM:
                let item: Item = {
                    id: this.tagEntry.id!,
                    name: this.tagEntry.name!,
                    type: this.tagEntry.itemtype,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!
                }
                return item
            case MISC:
                let misc: Misc = {
                    id: this.tagEntry.id!,
                    name: this.tagEntry.name!,
                    date: this.tagEntry.date,
                    misc: this.tagEntry.misc,
                    notes: this.tagEntry.notes!
                }
                return misc
            default:
                break
        }
    }
}

