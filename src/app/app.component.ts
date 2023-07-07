import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewContainerRef,
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
import { ExportImportService } from './data/export.import.service';
import { ExportConents } from './model/export.contetns-model';
import { BooleanInput, tuple } from 'ng-zorro-antd/core/types';
import { ITEM, MISC, PERSON, PLACE } from './constants';
import { NewPageEntry } from './model/new-page-entry-model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OpenMenuComponent } from './modal/open-menu/open-menu.component';
import { PageMenu } from './model/page-menu-model';
import { PageNameData } from './model/page-name.model';

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
  pageNameList!: Map<string, PageNameData>;
  newPageEntry!: NewPageEntry;
  pagesToOpen!: Map<string, boolean>;

  isExportModalVisible!: BooleanInput;
  isExportModalLoading!: BooleanInput;
  isPageMenuModalVisible!: BooleanInput;
  isPageMenuModalLoading!: BooleanInput;
  isNoteBook!: boolean;
  isAllPagesOpen!: boolean;
  isNewPage!: boolean;
  dateToday!: string;
  pageIds!: number[];
  selectClass!: string[];
  exportContents!: ExportConents[];
  exportPageButtonFlags!: Map<string, boolean>;
  toggleClass!: string;
  isSingleDocumentChecked!: Boolean;
  pageMenuChoice!: string;
  currentSelectedTab!: number;

  constructor(
    private noteBookservice: NotebookService,
    private pageService: PageService,
    private elementRef: ElementRef,
    private log: LoggerService,
    private renderer: Renderer2,
    private menuService: MenuService,
    private exportService: ExportImportService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.log.info(`starting`, this.ngOnInit.name, AppComponent.name);
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
    this.isPageMenuModalVisible = false;
    this.isPageMenuModalLoading = false;
    this.isSingleDocumentChecked = false;
    this.isNoteBook = false;
    this.isAllPagesOpen = false;
    this.isNewPage = true;
    this.pageIds = this.noteBook.pages.map((page) => page.id);
    this.selectClass = this.exportContents = [];
    this.exportPageButtonFlags = this.pagesToOpen = new Map();
    this.toggleClass = '';
    this.dateToday = new Date().toLocaleDateString();

    this.pageNameList = this.pageNameListExtraction(this.pages);
    this.log.debug(
      `the pageNameList size is ${this.pageNameList.size}`,
      'ngOnInit',
      'AppComponent'
    );
    this.newPageEntry = this.setupNewPageEntry();
    this.log.info(`finishing`, 'ngOnInit', 'AppComponent');
  }

  private pageNameListExtraction(pages: Page[]) {
    this.log.info('starting', 'pageNameListExtraction', 'AppComponent');
    let temp = new Map<string, PageNameData>();
    let tabIndex = 0;
    pages.forEach((page) => {
      if (page.isOpen) {
        temp.set(page.id.toString(), {name: page.name, tab: tabIndex});
        tabIndex++;
      }
    });

    this.log.info('finishing', 'pageNameListExtraction', 'AppComponent');
    return temp;
  }

  private setupNewPageEntry() {
    return {
      date: this.dateToday,
      type: '',
      name: '',
    };
  }

  private setupNewpageTags() {
    return {
      person: [],
      place: [],
      item: [],
      misc: [],
    };
  }

  exportModalCancel() {
    this.isExportModalVisible = false;
  }

  ngAfterViewInit(): void {
    this.log.info(
      `setting up electron brige`,
      'ngAfterViewInit',
      'AppComponent'
    );
    let bridgeDiv = this.elementRef.nativeElement.querySelector('#bridgeDiv');
    this.renderer.listen(bridgeDiv, 'command', (event) => {
      this.log.info(`angular got the event finally`);
      this.log.info(event.detail.text());
      this.menuService.runCommnad(event.detail.text());
      this.log.info(`menuservice command called`);
    });
    this.log.info(
      `assigned listener to div`,
      'ngAfterViewInit',
      'AppComponent'
    );
  }

  openPageMenu() {
    this.log.info(`starting`, 'openPageMenu', 'AppComponent');

    const modal = this.modal.create<OpenMenuComponent, PageMenu>({
      nzTitle: 'Page Menu',
      nzContent: OpenMenuComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        newPageEntry: this.newPageEntry,
        pages: this.noteBook.pages,
        pagesToOpen: this.pagesToOpen,
        isAllPagesOpen:
          this.pageNameList.size != this.noteBook.pages.length ? false : true,
        isNewPage: this.isNewPage,
      },
      nzOnOk: () => this.pageMenuSuccess(),
      nzOnCancel: () =>this.pageMenuModalCancel()
    });
    modal.getContentComponent();
  }

  pageMenuSuccess() {
    this.log.info('starting', 'pageMenuSuccess', 'AppComponent');
    this.log.debug(
      `isNewPage currently set to ${this.isNewPage}`,
      'pageMenuSuccess',
      'AppComponent'
    );
    let newTabindex;
    if (this.isNewPage) {
      console.debug(this.newPageEntry);
      let newId = this.pageIds[this.pageIds.length - 1] + 1;
      this.noteBook.pages.push({
        id: newId,
        date: this.newPageEntry.date,
        name: this.newPageEntry.name,
        type: this.newPageEntry.type,
        page: '',
        tags: this.setupNewpageTags(),
        isOpen: true,
      });
      console.debug(this.noteBook);
      newTabindex = this.pageNameList.size+1
      this.pageNameList.set(newId.toString(), {name: this.newPageEntry.name, tab: newTabindex});

      this.currentSelectedTab = newTabindex
    } else {
      console.debug(this.noteBook.pages);
      if(this.pagesToOpen.size >= 1){
        this.pagesToOpen.forEach((val,key) => {
          if(val){
            if(!this.pageNameList.has(key)){
              newTabindex = this.pageNameList.size+1
              this.pageNameList.set(key, {name: this.noteBook.pages[parseInt(key)-1].name, tab: newTabindex})
              this.currentSelectedTab = newTabindex
            }
          }
        })
      }

      this.pagesToOpen = new Map();
    }
    this.isNewPage = true;

    this.log.info('finishing', 'pageMenuSuccess', 'AppComponent');
  }

  openPage() {}

  closePage({ index }: { index: number }) {
    this.log.debug(
      `tab ${index} closed -test-`,
      this.closePage.name,
      AppComponent.name
    );

    this.pageNameList.delete((index + 1).toString());
    //TODO: update the isOpen on page or pages
  }

  pageMenuModalCancel() {
    this.noteBook.pages.forEach(page => {
      if(!this.pageNameList.has(page.id.toString())){
        page.isOpen = false;
      }
    });
    this.pagesToOpen = new Map();
  }

  // checkPageToBeOpened(id: number){
  //   if(this.pagesToOpen.indexOf(id) != -1){
  //     this.checkPage(id, true);
  //   } else {
  //     this.checkPage(id, false);
  //   }
  // }

  // private checkPage(id: number, state: boolean){
  //   let uncheckboxId = `${id}uncheckedPageOption`
  //   let checkboxId = `${id}checkedPageOption`
  //   let uncheckbox = this.elementRef.nativeElement.querySelector(uncheckboxId)
  //   let checkbox = this.elementRef.nativeElement.querySelector(checkboxId)
  //   if(state){
  //     this.renderer.setAttribute(checkbox,"hidden", "true");
  //     this.renderer.setAttribute(uncheckbox,"hidden", "false");
  //   } else {
  //     this.renderer.setAttribute(checkbox,"hidden", "false");
  //     this.renderer.setAttribute(uncheckbox,"hidden", "true");
  //   }
  // }

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

    if (this.exportPageButtonFlags.get(id)) {
      this.log.debug(`app.component::updateIds -  adding class`);
      // this.toggleClass = 'btn-select';
      this.selectClass[id] = 'btn-select';
    } else {
      this.log.debug(`app.component::updateIds -  removing class`);
      // this.toggleClass = '';
      this.selectClass[id] = '';
    }
    if (this.pageIds.includes(id)) {
      let tempIds: number[] = [];
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

  selectNotebook() {
    this.isNoteBook = !this.isNoteBook;
  }

  export() {
    this.isExportModalLoading = true;
    this.pages[0].page = this.htmlEncoder.encodeValue(
      this.quill.root.innerHTML
    );
    this.noteBook.pages = this.pages;
    let document: string = '';
    if (this.isSingleDocumentChecked) {
      if (this.isNoteBook) {
        this.noteBook.pages.forEach((page) => {
          document +=
            this.htmlEncoder.decodeValue(page.page) +
            `<hr style="border: 1px solid;" id="exportPageBreak">`;
        });
        // this.exportContents.push({ pageName: this.noteBook.name, content: document });
      } else {
        for (let id in this.pageIds) {
          document +=
            this.htmlEncoder.decodeValue(this.pages[id].page) +
            `<hr style="border: 1px solid;">`;
        }
        // this.exportContents.push({ pageName: "export", content: document });
      }
    }
    this.log.debug(`export will be :`);
    this.log.debug(document);
    this.isExportModalLoading = false;
    this.isExportModalVisible = false;

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
