import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit{

    selectedTags = ['person'];
    listOfTags: Array<{value:string, label:string}> = [];
    date: Date = new Date()
    type: string = "person"
    // TagData!: FormGroup;

    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    dateString:string = this.date.toDateString();

    // constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.listOfTags.push({value:'Dave', label:'Dave'});
        
        // this.TagData =this.formBuilder.group({
        //     personNameTxtBx: [null],
        //     personNotesTxtAr: [null],
        //     personDateLbl: [null],
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