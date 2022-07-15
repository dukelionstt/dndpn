import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';


import { AppComponent } from './app.component';
import { QuillToolbarComponent } from './quill/quill.toolbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TagListComponent } from './widgets/tag.list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';


registerLocaleData(en);


@NgModule({
  declarations: [
    AppComponent,
    QuillToolbarComponent,
    TagListComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    QuillModule.forRoot(),
    BrowserAnimationsModule,
    //ui
    FormsModule,
    HttpClientModule,
    NzGridModule,
    NzLayoutModule,
    NzDrawerModule,
    NzInputModule,
    NzButtonModule,
    NzCollapseModule,
    NzSelectModule,
    NzTypographyModule
    
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
