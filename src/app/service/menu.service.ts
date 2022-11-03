import { EventEmitter, Injectable, Output } from '@angular/core';
import { FileService } from '../data/file.service';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  @Output() saveEvent: EventEmitter<any> = new EventEmitter();

  constructor(private log: LoggerService) { }


  savePage(){
    this.log.debug(`running the save page method in the menuservice class`)
    this.saveEvent.emit(true)
  }

  private menuCommands: { [K: string]: Function} = {
    save: this.savePage
  }

  runCommnad(command: string){
    this.log.info('in the menu service about run the ' + command)
     switch(command){
      case 'save':
        this.savePage();
      break;
     }
  }

}
