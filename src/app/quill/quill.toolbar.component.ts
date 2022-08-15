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
    updateIndicator!: boolean;
    changeIndicator!: boolean;
    updateType!: string;

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
            itemtype: [],
            range: 0,
            buttonIndex: 0,
            lenght: 0

        }
        this.listenerPresent = false;
        this.updateIndicator = false;
        this.changeIndicator = false;
    }

    //id resolved next step is to stop duplicate entries is the user clicks on the tag and no change has occured to the
    //values passed in by the opening button.
    onNewTagSave(id: number){

      if(this.updateIndicator){
        if(this.changeIndicator){
          let range = this.pages[0].tags.get(this.updateType)[id].range
          let length = this.pages[0].tags.get(this.updateType)[id].name.length

          this.quill.removeFormat(range, length);
          this.updateTextInPage(range, this.updateType, this.pages[0].tags.get(this.updateType)[id].name)
        }
        this.attachClickEvent(this.sideBarTitle, id)
        this.updateIndicator = false
        this.changeIndicator = false

      } else {
        if(this.textPresent){
          this.quill.deleteText(this.range.index, this.text.length)
          this.updateTextInPage(this.range.index, this.sideBarTitle, this.forValue(this.text, this.sideBarTitle));

          this.textPresent = false;
      } else {
          this.updateTextInPage(this.range.index, this.sideBarTitle, this.forValue(this.pages[0].tags.get(this.sideBarTitle)[id].name, this.sideBarTitle));

          this.textPresent = false;
      }

        this.attachClickEvent(this.sideBarTitle, id)
      }

      this.close();
    }

    private forValue(text: string, icontype: string){
        return  this.icons.get(icontype) + text
    }

    private updateTextInPage(index: number, type: string, text: string){
      this.quill.insertEmbed(index, type, this.forValue(this.text, this.sideBarTitle));
          this.quill.setSelection(index + text.length , index + text.length);
    }

    private attachClickEvent(buttonClass: string, id: number){
      // maintains the number of entries on the page for each tag type, which allows the correct
      //button to get its event handler
      let count = this.buttonEvents.get(buttonClass)
      let queryString = '.'+ buttonClass

      //finds the button all the buttons on the page that matches the class passed in eg person
      //and there is also two systems to find out which button this is, first is a running count map for all
      //new button added to the page. The 
      let button: any;
      if(this.changeIndicator){
        button = this.elementRef.nativeElement.querySelectorAll(queryString)[this.pages[0].tags.get(buttonClass).metaData.buttonIndex];
      } else {
        button = this.elementRef.nativeElement.querySelectorAll(queryString)[count];
      }
      //adds the event to the button
      this.renderer.listen(button, 'click', (event) => this.tagViewAndUpdate(event, id, buttonClass));

      //recording the number of the button in order of buttons for that type so that if the text
      //is channge we can assign the correct button
      this.pages[0].tags.get(buttonClass)[id].metaData.buttonIndex = count

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

    tagViewAndUpdate(event: any, id: number, type: string){
      let tagData = this.pages[0].tags.get(type)[id]
      this.displayDataSidebar(tagData, type);
      
      this.sideBarTitle = type
      this.updateIndicator = true;
      this.updateType = type;
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
            this.tagEntry.range = tagData.range
        break;
        case PLACE:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.location = tagData.location
            this.tagEntry.area = tagData.area
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.range
        break;
        case ITEM:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.itemtype = tagData.itemtype
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.range
        break;
        case MISC:
            this.tagEntry.id = tagData.id
            this.tagEntry.name = tagData.name
            this.tagEntry.date = tagData.date
            this.tagEntry.misc = tagData.misc
            this.tagEntry.notes = tagData.notes
            this.tagEntry.range = tagData.range
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
      this.tagEntry.range = this.range.index

      this.open();
    }

}
