import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoggerService } from '../logger.service';
import { NOTEBOOK } from '../mock-data/notebook-mock';
import { Observable } from 'rxjs';
import { FileService } from './file.service';
import { NoteBook } from '../model/notebook-model';
import { Page } from '../model/page-model';


@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  constructor(private log: LoggerService, private http: HttpClient, private file: FileService) {
  }

 getNoteBook(){
    this.log.info(`Get notbook service called`)
    return this.file.getFile("E:\\backup\\dndpn\\src\\app\\mock-data\\notebook-mock.json")
  }

  saveNoteBook(notebook: NoteBook){
    this.log.info(`saving notebook file service :: started`)
    let success = false;
    this.file.saveFile("E:\\backup\\dndpn\\src\\app\\mock-data\\notebook-mock.json", JSON.stringify(notebook))
    .subscribe(data => {
      this.log.debug(data)
      if(!data.saved){
        throw data.message
      }
    });
  }

  buildNoteBook(obj: any){
    this.log.debug(`building notebook :: started`)
    this.log.debug(obj)

    let notebook: NoteBook = {
      id: obj.id,
      date: obj.date,
      name: obj.name,
      type: obj.type,
      pages: this.getPages(obj.pagesLocation),
      pagesLocation: obj.pagesLocation
    }
    this.log.debug(`Current state of notebook:`)
    this.log.debug(notebook)
    this.log.debug(`building notebook :: finished`)
    return notebook;
  }

  private getPages(locations: any){
    this.log.info(`get pages :: Started`)
    let pages: Page[] = [];
    this.log.debug(`building pages`)
    for(let file of locations){
      this.file.getFile(file).subscribe(data => {
        this.log.debug(`get api called for page: `)
        this.log.debug(data)
        pages.push(this.buildPage(data))
      })
    }
    this.log.debug(pages)
    this.log.info(`get pages :: Finished`)
    return pages;
  }

  private buildPage(obj: any){
    this.log.info(`build page :: Started`)
    let page : Page ={
      id: obj.id,
      date: obj.date,
      name: obj.name,
      tags: obj.tags,
      type: obj.type,
      page: obj.page
    }

    // this.log.debug(`checking the tags situation: ${page.tags.get('person')[0].id}`)
    this.log.info(`build page :: finished`)
    return page;
  }
}
