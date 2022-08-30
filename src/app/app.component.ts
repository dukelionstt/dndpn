import { Component, OnInit } from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta }  from "quill";

import { NotebookService } from './data/notebook.service';
import { NoteBook } from './model/notebook-model';
import { Page } from './model/page-model';
import { LoggerService } from './logger.service';

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

  constructor(private noteBookservice: NotebookService, private log: LoggerService){}

  ngOnInit(): void {
    this.log.info(`setting up notebook`)
    this.noteBookservice.getNoteBook().subscribe((data: any) => {
      this.log.info(`notebook setup start`)
      this.noteBook = this.noteBookservice.buildNoteBook(data)
      this.pages = this.noteBook.pages
      this.log.info(`notebook setup finish`)
    });
    
  }

  setNewQuillEditor(editor: any){
    this.quill = editor;
  }

  save(){
    // this.document = this.quill.getContents();
    this.document = this.quill.root.innerHTML;
  }

}
