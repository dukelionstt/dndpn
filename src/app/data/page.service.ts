import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private file: FileService, private log: LoggerService) { }

  savePage(page: any, fileName: string){
    this.file.saveFile(fileName, JSON.stringify(page))
    .subscribe(data => {
      this.log.debug(data)
      if(!data.saved){
        throw data.message
      } 
    });
  }
}
