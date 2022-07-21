import { Component, Input, OnInit } from "@angular/core";
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
    selectedTags = [];
    listOfTags: Array<{value:string, label:string}> = [];
    date: Date = new Date()
    personEntry: Person = {
      id: 0,
      name: '',
      date: this.date.toDateString(),
      misc: [],
      notes: ''
    };

    @Input()
    pages!: Page[];

    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    constructor(private tagsDropdown: TagsDropdownService){}

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
        if(type.match('person')){
          this.pages[0].person.push(this.personEntry);
          console.log(this.pages);
        }
    }

    toggleSideBar(type:string, flag:boolean){
        //placeholder
    }

    getPersonName(name: string){
      // let nameSections = name.split('|')
      // let tempPerson = this.page.person[Number(nameSections[1])];
      // tempPerson.name = nameSections[0]
      // this.page.person[0] = tempPerson
      // //todo: a tag reference
      // return tempPerson.name
    }
}
