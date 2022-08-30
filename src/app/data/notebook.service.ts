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
  // notebookPath: string = __dirname + 'src/app/mock-data/notebook-mock.json';
  notebook!: NoteBook;

  constructor(private log: LoggerService, private http: HttpClient, private file: FileService) {
  }

  getNoteBook(){
    this.log.info(`Get notbook service called`)
    return this.file.getFile("E:/backup/dndpn/src/app/mock-data/notebook-mock.json")
  }

  buildNoteBook(obj: any){
    this.log.debug(`building notebook started`)
    this.log.debug(obj)

    let notebook: NoteBook = { 
      id: obj.id,
      date: obj.date,
      name: obj.name,
      type: obj.type,
      pages: this.getPages(obj.pages)
    }
    this.log.debug(`Current state of notebook:`)
    this.log.debug(notebook)
    this.log.debug(`building notebook finished`)
    return notebook;
  }

  private getPages(locations: any){
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
    return pages;
  }

  private buildPage(obj: any){
    let page : Page ={
      id: obj.id,
      date: obj.date,
      name: obj.name,
      tags: new Map(Object.entries(obj.tags)),
      type: '',
      page: obj.page
    }

    this.log.debug(`checking the tags situation: ${page.tags.get('person')[0].id}`)
    return page;
  }
}
