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

    updateTags(element: string){

        let tempList: any[] = [];
        let replaceList: number[] = [];
        let updateList: any[] = [];
        let elementUpper = element.charAt(0).toUpperCase() + element.slice(1);

        this.tagEntry.misc.forEach(tag => { tempList.push(tag) })

        if(element != 'item'){
            if(this.tagEntry[element as keyof TagEntry] != this.tagEntry['previous'+elementUpper as keyof TagEntry]){
                
                let index = tempList.indexOf(this.tagEntry['previous'+elementUpper as keyof TagEntry].toString())
                if(index != -1){
                    tempList[index] = this.tagEntry[element as keyof TagEntry].toString();
                } else {
                    tempList.push(this.tagEntry[element as keyof TagEntry].toString());
                }                    
                Object.defineProperty(this.tagEntry, 'previous'+elementUpper, {
                    value: this.tagEntry[element as keyof TagEntry].toString()
                });
            } 
        } else {
            if(this.updateIndicator && this.tagEntry.previousItemtype.length > 0){

                this.tagEntry.itemtype.forEach(item => {
                    if(!this.tagEntry.previousItemtype.includes(item)){
                        tempList.push(item)
                    }
                })

                this.tagEntry.previousItemtype.forEach(previousItem => {
                    if(!this.tagEntry.itemtype.includes(previousItem)){
                        tempList.splice(tempList.indexOf(previousItem),tempList.indexOf(previousItem)+1)
                    }
                })
            //     this.tagEntry.previousItemtype.forEach(item => {
            //         if(!this.tagEntry.itemtype.includes(item)){
                        
            //             replaceList.push(tempList.indexOf(item))
            //         }
            //     })

            //     if(replaceList.length > 0){
            //         let i =0;
            //         replaceList.forEach(index => {
            //             tempList[index] = this.tagEntry.itemtype[i++]
            //         })
            //     }

            //     if(updateList.length > 0){
            //         updateList.forEach(item => {
            //             tempList.push(item)
            //         })
            //     }
            // } else {
            //     this.tagEntry.itemtype.forEach(item => {
            //         tempList.push(item)
            //     })
            // }

                this.tagEntry.previousItemtype = this.tagEntry.itemtype
            }
        }

        // switch(element){
        //     case 'area' || 'location':
        //         tempList.push(this.tagEntry.area);
        //         tempList.push(this.tagEntry.location);
        //     break;
        //     case 'item':
        //         tempList.concat(this.tagEntry.itemtype);
        //     break;
        // }

        // tempList.concat(this.tagEntry.misc)

        this.tagEntry.misc = tempList   

    }

    spaceBar(){
        //todo
    }
    // listOfTags(){
    //     return {

    //     }
    // }

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
            if(!tagList){
                tagList = []
            } else {
                id = tagList.length
            }
            
            tagList.push(this.tagService.convertDatatoTagListEntry(this.sideBarTitle, id, this.tagEntry));
            this.pages[0].tags[this.sideBarTitle as keyof Tags] = tagList;
        }

        this.newTagSave.emit([id, this.changeIndicator]);
    }


}

