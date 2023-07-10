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

  @Input()
  menuChoice!: string;

  @Input()
  fromMenu!: boolean;

  dateToday = new Date().toLocaleDateString();
  noNameErrorFlag!: any;
  duplicateNameErrorFlag!: any;
  duplicatedName!: string;
  isValidateState!: boolean;
  isOpenPage!: boolean;
  isNewPage!: boolean;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private log: LoggerService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.log.info('starting', 'ngOnInit', 'OpenMenuComponent');
    this.noNameErrorFlag = '';
    this.pageService.newPageNameError.subscribe((errorType) => errorType == 'name'? this.noNameError() : this.duplicateNameError());
    this.isOpenPage = true;
    this.isNewPage = true;
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
    this.isValidateState = false;

    this.log.debug(`the from menu is ${this.fromMenu}`, 'ngAfterViewInit', 'OpenMenuComponent');
    this.log.debug(`the menu choice is ${this.menuChoice}`, 'ngAfterViewInit', 'OpenMenuComponent');
    if(this.fromMenu){
      this.log.info('coming from the menu, setting view.', 'ngAfterViewInit', 'OpenMenuComponent');
      if(this.menuChoice == "open"){
        this.isOpenPage = true;
        this.isNewPage = false;
        this.newPageEntry.newPage = false;
      } else if(this.menuChoice == "new") {
        this.isOpenPage = false;
        this.isNewPage = true;
      }
    }

    this.log.info('finishing', 'ngAfterViewInit', 'OpenMenuComponent');
  }

  noNameError(){
    this.log.info('starting', 'noNameError', 'OpenMenuComponent');
    this.noNameErrorFlag = 'error';
    this.isValidateState = true;
    this.log.info('finishing', 'noNameError', 'OpenMenuComponent');
  }
  
  validateName(){
    this.log.info('starting', 'validateName', 'OpenMenuComponent');
    if(this.isValidateState){
      this.log.info('validating name input', 'validateName', 'OpenMenuComponent');
      if(this.newPageEntry.name.length != 0 && this.newPageEntry.name.search('\s') != -1){
        this.noNameErrorFlag = ''
        this.log.debug(`the two validating inputs are previous name: ${this.duplicatedName} and current name: ${this.newPageEntry.name}`, 'validateName', 'OpenMenuComponent');
        if(this.duplicatedName != this.newPageEntry.name){
          this.log.debug('clearing duplicate error', 'validateName', 'OpenMenuComponent');
          this.duplicateNameErrorFlag = ''
        } else {
          this.duplicateNameErrorFlag = 'error'
        }
      }
    }
    this.log.info('finishing', 'validateName', 'OpenMenuComponent');
  }

  duplicateNameError(){
    this.log.info('starting', 'duplicateNameError', 'OpenMenuComponent');
    this.duplicateNameErrorFlag = 'error';
    this.duplicatedName = this.newPageEntry.name
    this.isValidateState = true;
    this.log.info('finishing', 'duplicateNameError', 'OpenMenuComponent');
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
