import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { Page } from "../model/page-model";
import { TagEntry } from "../model/tag-entry-model";


@Component({
    selector: 'toolbar',
    templateUrl: './quill.toolbar.component.html'
})

export class QuillToolbarComponent implements OnInit, OnChanges{

    @Input()
    pages!: Page[];

    @Input()
    tagEntry!: TagEntry;

    @Output() newQuillEditor = new EventEmitter<any>();

    range : any;
    text : string = '';
    quill: any;
    sideBarTitle!: string;
    textPresent!: boolean;

    personTag: string = PERSON
    placeTag: string = PLACE
    itemTag: string = ITEM
    miscTag: string = MISC

    visible = false;

    icons = new Map();

    constructor(){}

    ngOnInit(): void {
        this.icons.set(PERSON, '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>')
        this.icons.set(PLACE, '<img src="https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png"/>')
        this.icons.set(ITEM, '<img src="https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png"/>')
        this.icons.set(MISC, '<img src="https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png"/>')

        this.tagEntry = {
            id: 0,
            name: '',
            date: '',
            misc: [],
            notes: '',
            location: '',
            area: '',
            itemtype: []

        }
    }
    
    onNewTagSave(event: any){
        if(this.textPresent){
            this.quill.deleteText(this.range.index, this.text.length)
        
            // this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.icons.get(this.sideBarTitle)+this.text+'|93');
            this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.text, this.sideBarTitle));
            this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);
        } else {
            // this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.icons.get(this.sideBarTitle)+this.pages[0].person[event].name+'|93');
            this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.pages[0].person[event].name, this.sideBarTitle));
            this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);
        }

        this.close();
    }

    private forValue(text: string, icontype: string){
        let spanOpenTag = '<span nz-tooltip [nzTooltipTitle]="toolTipTemplate" nzTooltipPlacement="leftBottom" (click)="tempAction()" >'
        let spanCloseTag = '</span>'
        return spanOpenTag + this.icons.get(icontype) + text + '|93 ' + spanCloseTag 
    }

    open(){
        this.visible = true;
    }

    close(){
        
        this.visible = false;
    }

    created(editor: any){
        this.quill = editor;
        this.newQuillEditor.emit(this.quill)

        this.quill.focus()
    }

    tagMenu(tagType: string){
      this.sideBarTitle = tagType;
      this.range = this.quill.getSelection();
      
      if(this.range.length == 0 || this.range == null){
        this.tagEntry.name = ''
        this.tagEntry.misc = [this.sideBarTitle]

        this.textPresent = false;
      } else {
        this.tagEntry.name = this.text = this.quill.getText(this.range.index, this.range.length);
        this.tagEntry.misc = [this.sideBarTitle, this.text]

        this.textPresent = true;
      }

      this.open();
    }

    tempAction(){
        console.log("clicked")
    }

    ngOnChanges(changes: SimpleChanges): void {
        for(const propName in changes){
        //     if(propName == 'textSelection'){
        //         if(changes[propName].currentValue != ''){
        //             this.tagEntry.name = changes[propName].currentValue
        //             this.tagEntry.misc = [this.sideBarTitle, changes[propName].currentValue]
        //         }
        //     } else if(propName == 'sideBarTitle'){
        //         if(changes[propName].currentValue != ''){
        //             if(this.tagEntry.name != undefined || this.tagEntry.name != ''){
        //                 this.tagEntry.misc = [this.sideBarTitle, this.tagEntry.name]
        //             } else {
        //                 this.tagEntry.misc = [this.sideBarTitle]
        //             }
                    
        //         }
        //     }
            console.log(propName)
        }
    }

    personClick(){

        // this.sideBarTitle = PERSON;
        // this.open();

      // this.range = this.quill.getSelection();
      // this.text = this.quill.getText(this.range.index, this.range.length);

      // this.quill.deleteText(this.range.index, this.text.length)

      // this.quill.insertEmbed(this.range.index, 'person', '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>'+this.text+'|93');
      // this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

    }

    getImageUrl(imageType: string){

    }

}
