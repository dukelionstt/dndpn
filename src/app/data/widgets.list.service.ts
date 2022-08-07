import { Injectable } from '@angular/core';
import { WIDGETS } from '../mock-data/widgets-mock';

@Injectable({
  providedIn: 'root'
})
export class WidgetsListService {

  constructor() { }

  getWidgetsList(){
    return WIDGETS;
  }
}
