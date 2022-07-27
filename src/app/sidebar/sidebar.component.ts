import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { ItemTypesService } from "../data/item.types.service";

import { TagsDropdownService } from "../data/tags-dropdown.service";
import { PAGE } from "../mock-data/page-mock";
import { Item } from "../model/item-model";
import { Misc } from "../model/misc-model";
import { Page } from "../model/page-model";
import { Person } from "../model/person-model";
import { Place } from "../model/place-model";
import { PersonBlot } from "../quill/person.blot";

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

    // validateForm! : FormGroup;

    selectedTags = [];
    listOfTags: Array<{value:string, label:string}> = [];
    listOfItemTypes: Array<{value:string, label:string}> = [];
    date: Date = new Date()
    tagEntry = {
      id: null,
      name: null,
      date: this.date.toDateString(),
      misc: [],
      notes: null,
      location: null,
      area: null,
      itemtype: []
    };

    @Input()
    pages!: Page[];

    @Input()
    sideBarTitle!: string;

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
        switch(this.sideBarTitle){
            case PERSON:
                this.pages[0].person.push(this.convertEntry(this.sideBarTitle));
            break;
            case PLACE:
                this.pages[0].place.push(this.convertEntry(this.sideBarTitle));
            break;
            case ITEM:
                this.pages[0].item.push(this.convertEntry(this.sideBarTitle));
            break;
            case MISC:
                this.pages[0].misc.push(this.convertEntry(this.sideBarTitle));
            break;
        }
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

