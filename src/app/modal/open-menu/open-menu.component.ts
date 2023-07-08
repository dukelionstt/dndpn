import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  inject
} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PageService } from 'src/app/data/page.service';
import { LoggerService } from 'src/app/logger.service';
import { Page } from 'src/app/model/page-model';

@Component({
  selector: 'app-open-menu',
  templateUrl: './open-menu.component.html',
  styleUrls: ['./open-menu.component.css'],
})
export class OpenMenuComponent implements OnInit, AfterViewInit {
  @Input()
  newPageEntry!: any;

  @Input()
  pages!: Page[];

  @Input()
  isAllPagesOpen!: boolean;

  @Input()
  pagesToOpen!: Map<string, boolean>;

  dateToday = new Date().toLocaleDateString();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private log: LoggerService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.log.info('starting', 'ngOnInit', 'OpenMenuComponent');
    // this.isNewPage = true;
    this.pageService.newPageTitleError.subscribe(() => this.titleError());
    this.log.info('finishing', 'ngOnInit', 'OpenMenuComponent');
  }

  ngAfterViewInit(): void {
    this.log.info('starting', 'ngAfterViewInit', 'OpenMenuComponent');
    this.pages.forEach((page) => {
      if (!page.isOpen) this.checkPage(page.id.toString(), page.isOpen);
    });
    this.log.info(
      'pageNameList populated',
      'ngAfterViewInit',
      'OpenMenuComponent'
    );
    // this.newPageEntry.newPage = true;
    this.log.info('finishing', 'ngAfterViewInit', 'OpenMenuComponent');
  }

  titleError(){
    this.log.info('starting', 'titleError', 'OpenMenuComponent');
    this.log.info('finishing', 'titleError', 'OpenMenuComponent');
  }

  checkPageToBeOpened(id: string) {
    this.log.info('starting', 'checkPageToBeOpened', 'OpenMenuComponent');

    this.log.debug(this.pages);
    this.log.debug(
      `page in pages with id ${parseInt(id) - 1} has open page value of ${
        this.pages[parseInt(id) - 1].isOpen
      }`,
      'checkPageToBeOpened',
      'OpenMenuComponent'
    );

    let newIsOpen = !this.pages[parseInt(id) - 1].isOpen;

    this.pages[parseInt(id) - 1].isOpen = newIsOpen;
    this.pagesToOpen.set(id, newIsOpen)
    this.checkPage(id, newIsOpen);

    this.log.info('finishing', 'checkPageToBeOpened', 'OpenMenuComponent');
  }

  private checkPage(id: string, state: boolean) {
    this.log.info('starting', 'checkPage', 'OpenMenuComponent');
    let uncheckboxId = `#uncheckedPageOption${id}`;
    let checkboxId = `#checkedPageOption${id}`;
    let uncheckbox: ElementRef;
    let checkbox: ElementRef;
    try {
      uncheckbox = this.elementRef.nativeElement.querySelector(uncheckboxId);
      checkbox = this.elementRef.nativeElement.querySelector(checkboxId);
      this.log.info('checkboxs set', 'checkPage', 'OpenMenuComponent');
    } catch (error) {
      this.log.error(
        'setting checkbox or uncheckbox failed please review the following',
        'checkPage',
        'OpenMenuComponent'
      );
      this.log.error(error, 'checkPage', 'OpenMenuComponent');
      return;
    }

    if (state) {
      this.log.info(
        `checking entry with id ${id}`,
        'checkPage',
        'OpenMenuComponent'
      );
      this.renderer.setStyle(checkbox, 'display', 'inline');
      this.renderer.setStyle(uncheckbox, 'display', 'none');
    } else {
      this.log.info(
        `unchecking entry with id ${id}`,
        'checkPage',
        'OpenMenuComponent'
      );
      this.renderer.setStyle(checkbox, 'display', 'none');
      this.renderer.setStyle(uncheckbox, 'display', 'inline');
    }

    this.log.info('finishing', 'checkPage', 'OpenMenuComponent');
  }

  updateActivePanel(panel: string) {
    this.log.info('starting', 'updateActivePanel', 'OpenMenuComponent');
    if(panel == 'new'){
      this.newPageEntry.newPage = true;
    } else if(panel == 'open'){
      this.newPageEntry.newPage = false;
    }
    this.log.info(
      `current state of new page is ${this.newPageEntry.newPage}`,
      'updateActivePanel',
      'OpenMenuComponent'
    );
    this.log.info('finished', 'updateActivePanel', 'OpenMenuComponent');
  }
}
