import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TagsDropdownService } from "../data/tags-dropdown.service";
import { PAGE } from "../mock-data/page-mock";
import { Page } from "../model/page-model";
import { Person } from "../model/person-model";

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

    // validateForm! : FormGroup;
    selectedTags = ['person'];
    listOfTags: Array<{value:string, label:string}> = [];
    date: Date = new Date()
    page: Page = PAGE;


    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    dateString:string = this.date.toDateString();

constructor(private tagsDropdown: TagsDropdownService, private person: Person){}

    ngOnInit(): void {
        this.listOfTags = this.tagsDropdown.getListOfTags('person');

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

    tagSave(type:string){
        //placeholder
    }

    toggleSideBar(type:string, flag:boolean){
        //placeholder
    }

    getPersonName(name: string){
      let nameSections = name.split('|')
      let tempPerson = this.page.person[Number(nameSections[1])];
      tempPerson.name = nameSections[0]
      this.page.person[0] = tempPerson
      //todo: a tag reference
      return tempPerson.name
    }
}
