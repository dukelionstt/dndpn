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

    // dateString:string = this.date.getDay().toLocaleString() +"/"+ this.date.getMonth.toString() +"/"+ this.date.getFullYear.toString();
    dateString:string = this.date.toDateString();

    ngOnInit(): void {
        this.listOfTags.push({value:'Dave', label:'Dave'});
        
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