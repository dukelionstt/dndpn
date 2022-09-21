import { Injectable, Output, EventEmitter } from '@angular/core';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  @Output() passFocus: EventEmitter<any> = new EventEmitter();
  @Output() getPasteQuill: EventEmitter<any> = new EventEmitter();

  constructor(private log: LoggerService) { }

  sendFocusEvent(element: any){
    this.log.debug(`focus changed again`)
    this.log.debug(element)
    this.log.debug(element.editor)
    this.passFocus.emit(element);
    
  }

  pasteQuill(clipboard: ClipboardItems){
    this.getPasteQuill.emit(clipboard)
  }
}
