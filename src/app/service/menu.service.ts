import { EventEmitter, Injectable, Output } from '@angular/core';
import { FileService } from '../data/file.service';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  @Output() saveEvent: EventEmitter<any> = new EventEmitter();
  @Output() newNotebookEvent : EventEmitter<any> = new EventEmitter();
  @Output() newPageEvent : EventEmitter<any> = new EventEmitter();
  @Output() openNotebookEvent : EventEmitter<any> = new EventEmitter();
  @Output() openPageEvent : EventEmitter<any> = new EventEmitter();
  @Output() saveNotebookEvent : EventEmitter<any> = new EventEmitter();
  @Output() savePageEvent : EventEmitter<any> = new EventEmitter();
  @Output() exportEvent : EventEmitter<any> = new EventEmitter();
  @Output() importEvent : EventEmitter<any> = new EventEmitter();
  @Output() openRecentEvent : EventEmitter<any> = new EventEmitter();
  @Output() closePageEvent : EventEmitter<any> = new EventEmitter();
  @Output() closeAllPagesEvent : EventEmitter<any> = new EventEmitter();
  @Output() closeNotebookEvent : EventEmitter<any> = new EventEmitter();
  @Output() allWidgetsEvent : EventEmitter<any> = new EventEmitter();
  @Output() personWidgetEvent : EventEmitter<any> = new EventEmitter();
  @Output() placeWidgetEvent : EventEmitter<any> = new EventEmitter();
  @Output() itemWidgetEvent : EventEmitter<any> = new EventEmitter();
  @Output() miscWidgetEvent : EventEmitter<any> = new EventEmitter();
  @Output() allTagsEvent : EventEmitter<any> = new EventEmitter();

  constructor(private log: LoggerService) { }

  runCommnad(command: string){
    this.log.info('in the menu service about run the ' + command)
     switch(command){
      case 'newNotebook':
        this.newNotebook();
      break;
      case 'newPage':
        this.newPage();
      break;
      case 'openNotebook':
        this.openNotebook();
      break;
      case 'openPage':
        this.openPage();
      break;
      case 'saveNotebook':
        this.saveNotebook();
      break;
      case 'savePage':
        this.savePage();
      break;
      case 'export':
        this.export();
      break;
      case 'import':
        this.import();
      break;
      // case 'openRecent':
      //   this.openRecent();
      // break;
      case 'closePage':
        this.closePage();
      break;
      case 'closeAllPages':
        this.closeAllPages();
      break;
      case 'closeNotebook':
        this.closeNotebook();
      break;
      case 'allWidgets':
        this.allWidgets();
        break;
      case 'personWidget':
        this.personWidget();
        break;
      case 'placeWidget':
        this.placeWidget();
        break;
      case 'itemWidget':
        this.itemWidget();
        break;
      case 'miscWidget':
        this.miscWidget();
        break;
      case 'allTags':
        this.allTags();
        break;
      case 'allWidgets':
        this.allWidgets();
      break;
      case 'personWidget':
        this.personWidget();
      break;
      case 'placeWidget':
        this.placeWidget();
      break;
      case 'itemWidget':
        this.itemWidget();
      break;
      case 'miscWidget':
        this.miscWidget();
      break;
      case 'allTags':
        this.allTags();
      break;
     }
  }
  
  private newNotebook(){
    this.newNotebookEvent.emit();    
  }
  
  private newPage(){
    this.newPageEvent.emit();    
  }
  
  private openNotebook(){
    this.openNotebookEvent.emit();    
  }
  
  private openPage(){
    this.openPageEvent.emit();    
  }
  
  private saveNotebook(){
    this.saveNotebookEvent.emit();    
  }
  
  private savePage(){
    this.savePageEvent.emit();    
  }
  
  private export(){
    this.exportEvent.emit();    
  }
  
  private import(){
    this.importEvent.emit();    
  }
  
  private openRecent(){
    this.openRecentEvent.emit();    
  }
  
  private closePage(){
    this.closePageEvent.emit();    
  }
  
  private closeAllPages(){
    this.closeAllPagesEvent.emit();    
  }
  
  private closeNotebook(){
    this.closeNotebookEvent.emit();    
  }
  
  private allWidgets(){
    this.allWidgetsEvent.emit();    
  }
  
  private personWidget(){
    this.personWidgetEvent.emit();    
  }
  
  private placeWidget(){
    this.placeWidgetEvent.emit();    
  }
  
  private itemWidget(){
    this.itemWidgetEvent.emit();    
  }
  
  private miscWidget(){
    this.miscWidgetEvent.emit();    
  }
  
  private allTags(){
    this.allTagsEvent.emit();    
  }
  

}
