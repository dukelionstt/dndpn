import { Component, OnInit } from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill  from "quill";
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
export class AppComponent implements OnInit {
  title = 'dndpn';
  quill : any;
  noteBook!: NoteBook;
  pages!: Page[];

  constructor(private noteBookservice: NotebookService){}

  ngOnInit(): void {
    this.noteBook = this.noteBookservice.getNoteBook();
    this.pages = this.noteBook.pages;
  }

  created(editor: any){
    this.quill = editor;
  }

}
