import { Component, OnInit} from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta }  from "quill";

import { NotebookService } from './data/notebook.service';
import { NoteBook } from './model/notebook-model';
import { Page } from './model/page-model';
import { LoggerService } from './logger.service';
import { NOTEBOOK } from './mock-data/notebook-mock';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { PageService } from './data/page.service';

PersonBlot["blotName"] = 'person';
PersonBlot["tagName"] = 'button';

Quill.register(PersonBlot);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dndpn';
  quill : any;
  document!: any;
  noteBook!: NoteBook;
  pages!: Page[];
  htmlEncoder = new HttpUrlEncodingCodec()

  constructor(private noteBookservice: NotebookService, private log: LoggerService, private pageService: PageService){}

  ngOnInit(): void {
    this.log.info(`setting up notebook`)
    this.noteBookservice.getNoteBook().subscribe((data: any) => {
      this.log.info(`notebook setup start`)
      this.noteBook = this.noteBookservice.buildNoteBook(data)
      this.pages = this.noteBook.pages
      this.log.info(`notebook setup finish`)
    });

    // this.noteBook = NOTEBOOK
    // this.pages = this.noteBook.pages

  }

  setNewQuillEditor(editor: any){
    this.quill = editor;
  }

  savePage(id: number){
    // this.document = this.quill.getContents();
    let page = this.quill.root.innerHTML;
    this.pages[id].page = this.htmlEncoder.encodeValue(page)
    this.noteBook.pages = this.pages
    try{
      this.pageService.savePage(this.pages[id], this.noteBook.pagesLocation[id])
      this.log.info("notebook saved")
    } catch(error){
      this.log.error(`notebook not saved`)
    }
  }

}
