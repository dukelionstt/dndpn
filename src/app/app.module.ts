import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { QuillModule } from "ngx-quill";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
  QuillModule.forRoot({
    modules: {
      toolbar: {
        container: [
          [{ 'size': ['small', false, 'large'] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['emoji'],
        ],
        handlers: {
          'emoji': function () { }
        },
      },
      "emoji-toolbar": true,
      "emoji-shortname": true,
      "emoji-textarea": true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
