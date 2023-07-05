import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-open-menu',
  templateUrl: './open-menu.component.html',
  styleUrls: ['./open-menu.component.css'],
})
export class OpenMenuComponent implements OnInit, AfterViewInit {
  @Input()
  newPageEntry!: any;

  @Input()
  pageNameList!: Map<string, string>;

  @Input()
  isAllPagesOpen!: boolean;

  pagesToOpen!: string[];
  dateToday = new Date().toLocaleDateString();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.pagesToOpen = [];
  }

  ngAfterViewInit(): void {
    console.debug('running AfterViewInit');
    this.pageNameList.forEach((value: string, key: string) =>
      this.checkPage(key, true)
    );
  }

  checkPageToBeOpened(id: string) {
    if (!this.pageNameList.has(id)) {
      this.checkPage(id, true);
      this.pagesToOpen.push(id);
    } else {
      this.checkPage(id, false);
      let temp: string[] = [];
      this.pagesToOpen.forEach((val) => {
        if (val != id) temp.push(val);
      });
      this.pagesToOpen = temp;
    }
  }

  private checkPage(id: string, state: boolean) {
    console.debug(
      `running check page with params: id as ${id} and state as ${state}`
    );
    let uncheckboxId = `#uncheckedPageOption${id}`;
    let checkboxId = `#checkedPageOption${id}`;
    console.debug(
      `unchecked id: ${uncheckboxId} and checked id: ${checkboxId}`
    );
    let uncheckbox = this.elementRef.nativeElement.querySelector(uncheckboxId);
    let checkbox = this.elementRef.nativeElement.querySelector(checkboxId);
    console.debug(uncheckbox);
    console.debug(checkbox);
    if (state) {
      console.debug('running check');
      this.renderer.removeStyle(checkbox, 'display');
      this.renderer.setStyle(uncheckbox, 'display', 'none');
    } else {
      console.debug('running uncheck');
      this.renderer.setStyle(checkbox, 'display', 'none');
      this.renderer.removeStyle(uncheckbox, 'display');
    }
  }
}
