import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";
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

    @Output() newQuillEditor = new EventEmitter<any>();

    range : any;
    text : string = '';
    quill: any;
    sideBarTitle!: string;
    textPresent!: boolean;
    listenerPresent!: boolean;

    personTag: string = PERSON
    placeTag: string = PLACE
    itemTag: string = ITEM
    miscTag: string = MISC

    visible = false;

    icons = new Map();
    buttonEvents = new Map();

    constructor( private renderer:Renderer2, private elementRef: ElementRef){}

    ngOnInit(): void {
        this.icons.set(PERSON, '<img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png"/>')
        this.icons.set(PLACE, '<img src="https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png"/>')
        this.icons.set(ITEM, '<img src="https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png"/>')
        this.icons.set(MISC, '<img src="https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png"/>')

        this.buttonEvents.set(PERSON, 0);
        this.buttonEvents.set(PLACE, 0);
        this.buttonEvents.set(ITEM, 0);
        this.buttonEvents.set(MISC, 0);

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
        this.listenerPresent = false;
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

        this.attachClickEvent(this.sideBarTitle)

        this.close();
    }

    private forValue(text: string, icontype: string){
        return  this.icons.get(icontype) + text + '|93 '
    }

    private attachClickEvent(buttonClass: string){
      let count = this.buttonEvents.get(buttonClass)
      // let queryString = '//button[@class="'+ buttonClass +'"]['+ count +']'
      let queryString = '.'+ buttonClass

      let button = this.elementRef.nativeElement.querySelectorAll(queryString)[count]
      this.renderer.listen(button, 'click', (event) => this.temphandeler(event));
    //   button.addEventListener('click', this.temphandeler(this));
      count++
      this.buttonEvents.set(buttonClass, count);
    }

    open(){
        this.visible = true;
    }

    close(){

        this.visible = false;
    }

    temphandeler(event: any){
      console.log(event);
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
