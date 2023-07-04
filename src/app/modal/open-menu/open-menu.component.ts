import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-open-menu',
  templateUrl: './open-menu.component.html',
  styleUrls: ['./open-menu.component.css']
})
export class OpenMenuComponent implements OnInit {

  @Input()
  newPageEntry?: any;

  @Input()
  pageNameList?: Map<string, string>;

  @Input()
  isAllPagesOpen?: boolean; 

  dateToday = new Date().toLocaleDateString();

  constructor() { }

  ngOnInit(): void {
  }

}
