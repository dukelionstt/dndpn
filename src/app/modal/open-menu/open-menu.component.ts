import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
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
  isNewPage!: boolean;

  dateToday = new Date().toLocaleDateString();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private log: LoggerService
  ) {}

  ngOnInit(): void {
    this.log.info('starting', 'ngOnInit', 'OpenMenuComponent');
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
    this.log.info('finishing', 'ngAfterViewInit', 'OpenMenuComponent');
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
    this.checkPage(id, newIsOpen);

    // if (this.pagesToOpen.has(id)) {
    //   let newCheckedState = !this.pagesToOpen.get(id);
    //   this.checkPage(id, newCheckedState);
    //   this.pagesToOpen.set(id, newCheckedState);
    //   this.log.info(
    //     `id ${id} endtry in pages to open changed to ${newCheckedState}`,
    //     'checkPageToBeOpened',
    //     'OpenMenuComponent'
    //   );
    // } else {
    //   this.checkPage(id, true);
    //   this.pagesToOpen.set(id, true);
    //   this.log.info(
    //     `id ${id} added to pagesToOpen`,
    //     'checkPageToBeOpened',
    //     'OpenMenuComponent'
    //   );
    // }

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

  updateActivePanel(state: boolean) {
    this.log.info('starting', 'updateActivePanel', 'OpenMenuComponent');
    this.isNewPage = state;
    this.log.info(
      `current state it ${state}`,
      'updateActivePanel',
      'OpenMenuComponent'
    );
    this.log.info('finished', 'updateActivePanel', 'OpenMenuComponent');
  }
}
