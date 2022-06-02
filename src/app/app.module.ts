import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';

import { AppComponent } from './app.component';
import { QuillToolbarComponent } from './quill/quill.toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    QuillToolbarComponent
  ],
  imports: [
    BrowserModule,
    QuillModule.forRoot()
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
