import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { Page } from "../model/page-model";


@Component({
    selector: 'toolbar',
    templateUrl: './quill.toolbar.component.html'
})

export class QuillToolbarComponent{

    @Input()
    pages!: Page[];

    @Output() newQuillEditor = new EventEmitter<any>();

    range : any;
    text : string = '';
    quill: any;
    sideBarTitle!: string;

    personTag: string = PERSON
    placeTag: string = PLACE
    itemTag: string = ITEM
    miscTag: string = MISC

    visible = false;

    open(){
        this.visible = true;
    }

    close(){
        this.visible = false;
    }

    created(editor: any){
        this.quill = editor;
        this.newQuillEditor.emit(this.quill)
    }

    tagMenu(tagType: string){
      this.sideBarTitle = tagType;
      this.open();

    }

    personClick(){

        this.sideBarTitle = PERSON;
        this.open();

      // this.range = this.quill.getSelection();
      // this.text = this.quill.getText(this.range.index, this.range.length);

      // this.quill.deleteText(this.range.index, this.text.length)

      // this.quill.insertEmbed(this.range.index, 'person', '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>'+this.text+'|93');
      // this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

    }

}
