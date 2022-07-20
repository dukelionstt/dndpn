import { Component, EventEmitter, Output, ViewChild } from "@angular/core";



@Component({
    selector: 'toolbar',
    templateUrl: './quill.toolbar.component.html'
})

export class QuillToolbarComponent{

    range : any;
    text : string = '';
    quill: any;

    visible = false;

    open(){
        this.visible = true;
    }

    close(){
        this.visible = false;
    }

    created(editor: any){
        this.quill = editor;
      }

    personClick(){

      this.open();


      // this.range = this.quill.getSelection();
      // this.text = this.quill.getText(this.range.index, this.range.length);

      // this.quill.deleteText(this.range.index, this.text.length)

      // this.quill.insertEmbed(this.range.index, 'person', '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>'+this.text+'|93');
      // this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

    }

}
