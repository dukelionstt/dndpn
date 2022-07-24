import { Injectable } from '@angular/core';
import { NOTEBOOK } from '../mock-data/notebook-mock';

@Injectable({
  providedIn: 'root'
})
export class NotebookService {

  getNoteBook(){
    return NOTEBOOK
  }

  constructor() { }
}
