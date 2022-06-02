import { Component } from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill  from "quill";

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

  created(editor: any){
    this.quill = editor;
  }
  
}
