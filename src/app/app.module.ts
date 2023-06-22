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
import { HttpClientModule } from '@angular/common/http';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { MenuComponent } from './menu/menu.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzListModule } from 'ng-zorro-antd/list'

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    QuillToolbarComponent,
    TagListComponent,
    SidebarComponent,
    MenuComponent,
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
    NzTypographyModule,
    NzCardModule,
    NzToolTipModule,
    NzDropDownModule,
    NzBadgeModule,
    NzIconModule,
    NzModalModule,
    NzCheckboxModule,
    NzTabsModule,
    NzListModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
