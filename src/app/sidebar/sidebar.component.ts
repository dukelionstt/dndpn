import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

    validateForm! : FormGroup;
    selectedTags = ['person'];
    listOfTags: Array<{value:string, label:string}> = [];
    date: Date = new Date()

    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    dateString:string = this.date.toDateString();

constructor(private formbuilder: FormBuilder){}

    ngOnInit(): void {
        this.listOfTags.push({value:'Dave', label:'Dave'});

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
}
