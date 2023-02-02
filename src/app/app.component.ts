import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta } from 'quill';

import { NotebookService } from './data/notebook.service';
import { NoteBook } from './model/notebook-model';
import { Page } from './model/page-model';
import { LoggerService } from './logger.service';
import { NOTEBOOK } from './mock-data/notebook-mock';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { PageService } from './data/page.service';
import { PlaceBlot } from './quill/place.blot';
import { ItemBlot } from './quill/item.blot';
import { MiscBlot } from './quill/misc.blot';
import { MenuService } from './service/menu.service';
import { not } from '@angular/compiler/src/output/output_ast';
import { ExportImportService } from './data/export.import.service';
import { ExportConents } from './model/export.contetns-model';
import { BooleanInput } from 'ng-zorro-antd/core/types';

PersonBlot['blotName'] = 'person';
PersonBlot['tagName'] = 'button';

PlaceBlot['blotName'] = 'place';
PlaceBlot['tagName'] = 'button';

ItemBlot['blotName'] = 'item';
ItemBlot['tagName'] = 'button';

MiscBlot['blotName'] = 'misc';
MiscBlot['tagName'] = 'button';

Quill.register(PersonBlot);
Quill.register(PlaceBlot);
Quill.register(ItemBlot);
Quill.register(MiscBlot);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'dndpn';
  quill: any;
  document!: any;
  noteBook!: NoteBook;
  pages!: Page[];
  htmlEncoder = new HttpUrlEncodingCodec();

  isExportModalVisible!: BooleanInput;
  isExportModalLoading!: BooleanInput;
  isNoteBook!: boolean;
  pageIds!: string[];
  exportContents!: ExportConents[];
  exportPageButtonFlags!: Map<string, boolean>;

  constructor(
    private noteBookservice: NotebookService,
    private log: LoggerService,
    private pageService: PageService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private menuService: MenuService,
    private exportService: ExportImportService
  ) {}

  ngOnInit(): void {
    this.log.info(`setting up notebook`);
    // this.noteBookservice.getNoteBook().subscribe((data: any) => {
    //   this.log.info(`notebook setup start`)
    //   this.noteBook = this.noteBookservice.buildNoteBook(data)
    //   this.pages = this.noteBook.pages
    //   this.log.info(`notebook setup finish`)
    // });

    this.noteBook = NOTEBOOK;
    this.pages = this.noteBook.pages;

    this.menuService.saveEvent.subscribe((event) => {
      this.savePage();
    });
    this.menuService.exportEvent.subscribe(() => {
      this.exportMenu();
    });

    this.isExportModalVisible = false;
    this.isExportModalLoading = false;
    this.isNoteBook = false;
    this.pageIds = [];
    this.exportContents = [];
    this.exportPageButtonFlags = new Map();
  }

  exportModalCancel() {
    this.isExportModalVisible = false;
  }

  ngAfterViewInit(): void {
    this.log.info(`app::component::ngAfterViewInit - setting up electron brige`)
    let bridgeDiv = this.elementRef.nativeElement.querySelector('#bridgeDiv');
    this.renderer.listen(bridgeDiv, 'command', (event) => {
      this.log.info(`angular got the event finally`);
      this.log.info(event.detail.text());
      this.menuService.runCommnad(event.detail.text());
      this.log.info(`menuservice command called`);
    });
    this.log.info(`app::component::ngAfterViewInit - assigned listener to div`)
  }

  exportMenu() {
    this.isExportModalVisible = true;
  }

  updateIds(id: any) {
    if (this.exportPageButtonFlags.has(id)) {
      let flag = this.exportPageButtonFlags.get(id);
      this.exportPageButtonFlags.set(id, !flag);
    } else {
      this.exportPageButtonFlags.set(id, true);
    }

    this.log.debug('app.component::updateIds - finding button element');
    this.log.debug(`finding button id #exportButton${id}`);
    let buttonId = `#exportButton${id}`
    let button = this.elementRef.nativeElement.querySelector(buttonId);
    console.log(button);

    if (this.exportPageButtonFlags.get(id)) {
      this.log.debug(`app.component::updateIds -  adding class`);
      this.renderer.addClass(button, 'btn-select');
    } else {
      this.log.debug(`app.component::updateIds -  removing class`);
      this.renderer.removeClass(button, 'btn-select');
    }
    if (this.pageIds.includes(id)) {
      let tempIds: string[] = [];
      this.pageIds.forEach((pageId) => {
        if (id != pageId) {
          tempIds.push(id);
        }
      });
      this.pageIds = tempIds;
    } else {
      this.pageIds.push(id);
    }
  }

  setNewQuillEditor(editor: any) {
    this.quill = editor;
  }

  savePage() {
    this.log.info('page has been saved fool');
  }

  export() {
    this.isExportModalLoading = true;
    this.pages[0].page = this.htmlEncoder.encodeValue(
      this.quill.root.innerHTML
    );
    this.noteBook.pages = this.pages;

    // if (this.isNoteBook) {
    //   this.noteBook.pages.forEach((page) => {
    //     this.exportContents.push({ pageName: page.name, content: page.page });
    //   });
    // } else {
    //   for (let id in this.pageIds) {
    //     this.exportContents.push({
    //       pageName: this.pages[id].name,
    //       content: this.pages[id].page,
    //     });
    //   }

    // this.exportService.export(this.exportContents).subscribe({
    //      next : response => {
    //        this.isExportModalVisible = false;
    //        this.isExportModalLoading = false;
    //      },
    //      error: err => {
    //        this.log.error(`app.component::export - error message: ${err}`);
    //      }
    // });
    // }
  }

  // savePage(id: number){
  //   // this.document = this.quill.getContents();
  //   let page = this.quill.root.innerHTML;
  //   this.pages[id].page = this.htmlEncoder.encodeValue(page)
  //   this.noteBook.pages = this.pages
  //   try{
  //     this.pageService.savePage(this.pages[id], this.noteBook.saveLocation+ "\\pages\\" +this.pages[id].name+".json")
  //     this.log.info("notebook saved")
  //   } catch(error){
  //     this.log.error(`notebook not saved`)
  //   }
  // }
}
