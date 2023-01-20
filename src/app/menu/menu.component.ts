import { Component, Input, OnInit, HostListener } from '@angular/core';
import Quill from 'quill';
import { NotebookService } from '../data/notebook.service';
import { PageService } from '../data/page.service';
import { LoggerService } from '../logger.service';
import { NoteBook } from '../model/notebook-model';
import { Page } from '../model/page-model';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  activePage!: number;
  copiedText!: string;
  focusElement!: any;

  @Input()
  quill!: Quill;
  @Input()
  pages!: Page[];
  @Input()
  notebook!: NoteBook;

  constructor(
    private notebookService: NotebookService,
    private pageService: PageService,
    private log: LoggerService
  ) {}

  ngOnInit(): void {
    this.pageService.activePage.subscribe((id) => (this.activePage = id));
  }

  newNotebook() {}

  newPage() {}

  openRecent() {}

  openNotebook() {}

  openPage() {}

  saveNotebook() {
    this.notebook.pages = this.pages;
    this.notebookService.saveNoteBook(this.notebook);
  }

  savePage() {
    this.pageService.savePage(
      this.pages[this.activePage],
      this.notebook.saveLocation +
        '\\pages\\' +
        this.pages[this.activePage].name +
        '.json'
    );
  }

  saveAll() {
    this.savePage();
    this.savePage();
  }

  autoSave() {
    //update
  }

  settings() {}

  closeNotebook() {}

  closePage() {}

  closeWindow() {}

  // edit options
  undo() {}

  redo() {}

  copy() {
    let temp = window.getSelection()?.toString();
    if (temp) {
      this.copiedText = temp;
      let clipboardItem = new Blob([temp]);
      navigator.clipboard.write([new ClipboardItem({ clipboardItem })]);
    }
  }

  cut() {}

  async paste() {}

  find() {}

  replace() {}

  findInPages() {}

  // view buttons
  notebookOverview() {}

  pageOverview() {}

  widgetOverview() {}

  widgetsAvailable() {}

  statisticsOverView() {}

  wordCount() {}

  referenceCount() {}

  tagCount() {}

  // help buttons
  basicNoteTaking() {}

  shortCutKeys() {}

  references() {}

  tags() {}

  widgets() {}

  linkingTogether() {}

  reportBug() {}

  featureRequest() {}

  contributing() {}

  about() {}
}