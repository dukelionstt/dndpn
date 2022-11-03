import { Component, OnInit, HostListener, AfterViewInit, ElementRef, Renderer2} from '@angular/core';
import { PersonBlot } from './quill/person.blot';
import Quill, { Delta }  from "quill";

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

PersonBlot["blotName"] = 'person';
PersonBlot["tagName"] = 'button';

PlaceBlot["blotName"] = 'place';
PlaceBlot["tagName"] = 'button';

ItemBlot["blotName"] = 'item';
ItemBlot["tagName"] = 'button';

MiscBlot["blotName"] = 'misc';
MiscBlot["tagName"] = 'button';

Quill.register(PersonBlot);
Quill.register(PlaceBlot);
Quill.register(ItemBlot);
Quill.register(MiscBlot);



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'dndpn';
  quill : any;
  document!: any;
  noteBook!: NoteBook;
  pages!: Page[];
  htmlEncoder = new HttpUrlEncodingCodec()
  
  constructor(private noteBookservice: NotebookService, 
              private log: LoggerService, 
              private pageService: PageService,
              private elementRef: ElementRef,
              private renderer: Renderer2,
              private menuService: MenuService){}

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

    this.menuService.saveEvent.subscribe((event) => {
      this.savePage();
    })

  }

  ngAfterViewInit(): void {
      let bridgeDiv = this.elementRef.nativeElement.querySelector('#bridgeDiv');
      this.renderer.listen(bridgeDiv, 'command', (event) => {
        this.log.info(`angular got the event finally`)
        this.log.info(event.detail.text())
        this.menuService.runCommnad(event.detail.text());
        this.log.info(`menuservice command called`)
      })
  }

  setNewQuillEditor(editor: any){
    this.quill = editor;
  }

  savePage(){
    this.log.info('page has been saved fool')
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
