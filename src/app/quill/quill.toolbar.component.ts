import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { Page } from "../model/page-model";
import { TagEntry } from "../model/tag-entry-model";


@Component({
    selector: 'toolbar',
    templateUrl: './quill.toolbar.component.html'
})
export class QuillToolbarComponent implements OnInit{

    @Input()
    pages!: Page[];

    @Input()
    tagEntry!: TagEntry;

    @Input()
    quill!: any;

    @Output() newQuillEditor = new EventEmitter<any>();

    range : any;
    text : string = '';

    sideBarTitle!: string;
    textPresent!: boolean;
    content!: any;

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
        this.content = { "ops": [
                            { "insert": "This is some " },
                            {
                                "attributes": { "0": "p", "1": "e", "2": "r", "3": "s", "4": "o", "5": "n" },
                                "insert": { "person": 'Dave' }
                            },
                            { "insert": " content for future " },{"attributes": { "0": "p", "1": "e", "2": "r", "3": "s", "4": "o", "5": "n" },"insert": { "person": 'Cat' }
                            },{ "insert": "etc.\n" } ] };

    }

    // Need to bring in id handeling for the tags as this will fix bug of gettting name from person object
    onNewTagSave(event: any){
        if(this.textPresent){
            this.quill.deleteText(this.range.index, this.text.length)

            // this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.icons.get(this.sideBarTitle)+this.text+'|93');
            this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.text, this.sideBarTitle));
            this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

            this.textPresent = false;
        } else {
            // this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.icons.get(this.sideBarTitle)+this.pages[0].person[event].name+'|93');
            this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.pages[0].person[event].name, this.sideBarTitle));
            this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

            this.textPresent = false;
        }

        this.close();
    }

    private forValue(text: string, icontype: string){
        return  this.icons.get(icontype) + text + '|93 '
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

        this.quill.setContents(this.content)

        this.quill.focus()
        this.quill.setSelection(13,1)
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
