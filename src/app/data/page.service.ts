import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private file: FileService, private log: LoggerService) { }

  savePage(page: Page, fileName: string){
    this.file.saveFile(fileName, JSON.stringify(page))
    .subscribe((data: any) => {
      this.log.debug(data)
      if(!data.saved){
        throw data.message
      }
    });
  }
}
