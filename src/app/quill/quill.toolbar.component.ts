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

    //id resolved next step is to stop duplicate entries is the user clicks on the tag and no change has occured to the
    //values passed in by the opening button.
    onNewTagSave(id: number){

      if(this.textPresent){
          this.quill.deleteText(this.range.index, this.text.length)
          this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.text, this.sideBarTitle));
          this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

          this.textPresent = false;
      } else {
          this.quill.insertEmbed(this.range.index, this.sideBarTitle, this.forValue(this.pages[0].tags.get(this.sideBarTitle)[id].name, this.sideBarTitle));
          this.quill.setSelection(this.range.index + this.text.length , this.range.index + this.text.length);

          this.textPresent = false;
      }

      this.attachClickEvent(this.sideBarTitle, id)

      this.close();
    }

    private forValue(text: string, icontype: string){
        return  this.icons.get(icontype) + text
    }

    private attachClickEvent(buttonClass: string, id: number){
      // maintains the number of entries on the page for each tag type, which allows the correct
      //button to get its event handler
      let count = this.buttonEvents.get(buttonClass)
      let queryString = '.'+ buttonClass

      //finds the button all the buttons on the page that matches the class passed in eg person
      //then the count that has be retireved above allows us to find this latest version
      let button = this.elementRef.nativeElement.querySelectorAll(queryString)[count];
      //adds the event to the button
      this.renderer.listen(button, 'click', (event) => this.temphandeler(event, id, buttonClass));

      //increment the button so we can find the new one on the next call
      count++
      //store the increment
      this.buttonEvents.set(buttonClass, count);
    }

    open(){
        this.visible = true;
    }

    close(){

        this.visible = false;
    }

    temphandeler(event: any, id: number, type: string){
      let tagData = this.pages[0].tags.get(type)[id]
      this.displayDataSidebar(tagData, type);
      this.sideBarTitle = type
      this.open();
    }

    private displayDataSidebar(tagData: any, type: string){

      switch(type){
        case PERSON:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
        break;
        case PLACE:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.location = tagData.location
            this.tagEntry.area = tagData.area
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
        break;
        case ITEM:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.itemtype = tagData.itemtype
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
        break;
        case MISC:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
        break;
        default:
            break
    }

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
