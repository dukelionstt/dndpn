import { Component, OnInit } from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta }  from "quill";

import { NotebookService } from './data/notebook.service';
import { NoteBook } from './model/notebook-model';
import { Page } from './model/page-model';

PersonBlot["blotName"] = 'person';
PersonBlot["tagName"] = 'button';

Quill.register(PersonBlot);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dndpn';
  quill : any;
  document!: any;
  noteBook: NoteBook = this.noteBookservice.getNoteBook();
  pages: Page[] = this.noteBook.pages;

  constructor(private noteBookservice: NotebookService){}

  setNewQuillEditor(editor: any){
    this.quill = editor;
  }

  save(){
    this.document = this.quill.getContents();
  }

}
