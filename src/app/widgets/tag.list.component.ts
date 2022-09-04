import { Component, Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, Sanitizer, ViewChild, ViewChildren } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ITEM, MISC, PERSON, PLACE } from "../constants";
import { WidgetsListService } from "../data/widgets.list.service";
import { LoggerService } from "../logger.service";
import { Page } from "../model/page-model";
import { Widget } from "../model/widget-model";

const POST_FIX_ACTIVE = "TagButtonActive"
const POST_FIX = "TagButton"


@Component({
    selector: 'tag-list',
    templateUrl: './tag.list.component.html'
})


export class TagListComponent implements OnInit{

  @Input()
  quill!: any;

  @Input()
  pages!: Page[];

  @Output() highlightTag = new EventEmitter();

  @ViewChild('tagButton')
  tagButton!: ElementRef;

  tag = 'person';

  widgets!: Widget[]
  loading!: boolean
  active!: boolean;
  isNewButton!: boolean;
  previousIndex!: number;
  previousButton!: any;
  previousID!: number;
  previousType!: string;
  icons = new Map();
  tags = new Map();
  highlightConfig!: {active: boolean, map: Map<boolean, Map<string,number[]>>}

  constructor(private widgetsList: WidgetsListService,
              private log: LoggerService,
              private elementRef: ElementRef,
              private renderer: Renderer2){}

  ngOnInit(): void {
      this.loading = true

      this.icons.set(PERSON, 'https://img.icons8.com/ios-glyphs/15/008080/human-head.png')
      this.icons.set(PLACE, 'https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png')
      this.icons.set(ITEM, 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png')
      this.icons.set(MISC, 'https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png')

      // this.widgets = this.widgetsList.getWidgetsList();
      this.loading = false;
      this.active = false;
      this.isNewButton = false;
      this.highlightConfig = {
        map:new Map<boolean, Map<string,number[]>>(),
        active: false
      }
    }

  goToTagInPage(event: any, index:number, type: string){

    this.log.info(`highlight process :: Starting`)
    this.log.debug(`highlight tag called, index:${index} & type:${type} passed. This is in tag list component`)

    this.log.debug(type+index)
    this.log.debug(event)
    let pathIndex = this.findButtonElement(event.path)
    let temp = new Map<string, number[]>();
    let tempPrevious = new Map<string, number[]>();
    let indexList: number[] = [index];
    let indexPevious: number[] = [this.previousIndex];

    if(this.isNewButton){
      this.log.debug(`Different button clicked so toggle`)
      this.log.debug(`Previous button is:`)
      this.log.debug(this.previousButton)
      this.log.debug(`This pervioius index = ${this.previousIndex}`)
      this.previousButton[this.previousIndex].classList = this.updateClassList(this.previousButton[this.previousIndex].classList, type, this.active)
      this.log.debug(`previous button should have updated`)
      this.log.debug(this.previousButton)
      tempPrevious.set(type, indexPevious)

      this.log.debug(`now changing the new button, currently set to:`)
      this.log.debug(event.path[pathIndex])
      event.path[pathIndex].classList = this.updateClassList(event.path[pathIndex].classList, type, !this.active)
      this.log.debug(`cahnged the button, currently set to:`)
      this.log.debug(event.path[pathIndex])
      this.isNewButton = false
    } else {
      event.path[pathIndex].classList = this.updateClassList(event.path[pathIndex].classList, type, this.active)
    }

    this.previousButton = event.path
    this.previousIndex = pathIndex
    this.previousID = index
    this.previousType = type

    this.log.debug(`the previous button is:`)
    this.log.debug(this.previousButton)

    if(this.active){
      this.active = false
    } else {
      this.active = true
    }

    temp.set(type, indexList)

    this.highlightConfig.map.set(this.active, temp)
    this.highlightConfig.map.set(!this.active, tempPrevious)
    this.highlightConfig.active = this.active

    this.log.debug(`event object formed`)
    this.log.debug(this.highlightConfig)

    
    this.highlightTag.emit(this.highlightConfig)

    temp.clear


    this.log.info(`highlight process :: Starting`)
  }

  private findButtonElement(path: any){
    let index = 0;
    for(let element of path){
      if(element.nodeName == "BUTTON"){
        if(this.previousButton){
          this.log.debug(`The previous element: ${this.previousButton[this.previousIndex].id}`)
          this.log.debug(`new element to be checked: ${element.id}`)
          if(this.previousButton[this.previousIndex].id != element.id){
            this.log.debug(`changing the is new button to true`)
            this.isNewButton = true
          }
        }
        break
      } else {
        index++
      }
    }
    return index
  }

  private updateClassList(classList: DOMTokenList, type: string, active: boolean){
    this.log.debug(`altering class list`)
    this.log.debug(classList)
    let index = 0;
    
    if(!active){
      try {
        classList.replace(type+POST_FIX, type+POST_FIX_ACTIVE)
        this.log.debug(`class list changed`)
        this.log.debug(classList)
      } catch(error) {
        this.log.error(`issue in changing activer class for tag button, please review below`)
        this.log.error(error)
      }
    } else {
      try {
        classList.replace(type+POST_FIX_ACTIVE, type+POST_FIX)
        this.log.debug(`class list changed`)
        this.log.debug(classList)
      } catch(error) {
        this.log.error(`issue in changing activer class for tag button, please review below`)
        this.log.error(error)
      }
    }

    return classList
  }

  getImgSrc(imgtype: string){
    return this.icons.get(imgtype);
  }
}
