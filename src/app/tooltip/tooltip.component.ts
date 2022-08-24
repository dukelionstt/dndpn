import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../model/page-model';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class TooltipComponent implements OnInit {

  @Input()
  type!: any

  @Input()
  id!: any

  @Input()
  pages!: Page[]

  constructor() { }

  ngOnInit(): void {
  }

}
