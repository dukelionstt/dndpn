import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { ItemTypesService } from "../data/item.types.service";

import { TagsDropdownService } from "../data/tags-dropdown.service";
import { TagsService } from "../data/tags.service";
import { Page } from "../model/page-model";
import { TagEntry } from "../model/tag-entry-model";
import { Tags } from "../model/tags-model";

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
                private intemTypeDropdown: ItemTypesService,
                private tagService: TagsService){}

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
        let tagList: any;
        let id = 0;
        if(this.updateIndicator){
            // tagList = this.tagService.getListFromTags(this.updateType, this.pages[0].tags);
            tagList = this.pages[0].tags[this.updateType as keyof Tags]
            id = this.tagEntry.id

            if(tagList[id].name != this.tagEntry.name){
                this.changeIndicator = true;
            }
            tagList[id] = this.tagService.convertDatatoTagListEntry(this.updateType, id, this.tagEntry);
            this.pages[0].tags[this.updateType as keyof Tags] = tagList

        } else {
            tagList = this.pages[0].tags[this.sideBarTitle as keyof Tags]
            id = tagList.length
            tagList.push(this.tagService.convertDatatoTagListEntry(this.sideBarTitle, id, this.tagEntry));
            this.pages[0].tags[this.sideBarTitle as keyof Tags] = tagList;
        }

        this.newTagSave.emit([id, this.changeIndicator]);
    }


}

