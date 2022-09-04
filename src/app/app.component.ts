import { Component, OnInit } from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta }  from "quill";

import { NotebookService } from './data/notebook.service';
import { NoteBook } from './model/notebook-model';
import { Page } from './model/page-model';
import { LoggerService } from './logger.service';
import { NOTEBOOK } from './mock-data/notebook-mock';

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
  sending!: boolean;
  highlightConfig!: {send: boolean, map: Map<boolean, Map<string,number[]>>}

  constructor(private noteBookservice: NotebookService, private log: LoggerService){}

  ngOnInit(): void {
    this.log.info(`setting up notebook`)
    // this.noteBookservice.getNoteBook().subscribe((data: any) => {
    //   this.log.info(`notebook setup start`)
    //   this.noteBook = this.noteBookservice.buildNoteBook(data)
    //   this.pages = this.noteBook.pages
    //   this.log.info(`notebook setup finish`)
    // });

    this.noteBook = NOTEBOOK
    this.pages = this.noteBook.pages

  }

  setNewQuillEditor(editor: any){
    this.quill = editor;
  }

  save(){
    // this.document = this.quill.getContents();
    this.document = this.quill.root.innerHTML;
    try{
      this.noteBookservice.saveNoteBook(this.noteBook)
      this.log.info("notebook saved")
    } catch(error){
      this.log.error(`notebook not saved`)
    }
  }

  highlightTag(config: any){
    this.log.debug(`Event recieved, got ${config}, setting that to highlightMap`)
    this.highlightConfig = config
    this.sending = config.send
  }

  resetSendingFlag(event: any){
    if(event){
      this.sending = false
    }
  }

}
