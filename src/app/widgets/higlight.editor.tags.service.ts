import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HiglightEditorTagsService {


  @Output() highLightTag: EventEmitter<any> = new EventEmitter();

  constructor() { }

  sendHighlightTag(ids:number[], type: string, active: boolean){
    this.highLightTag.emit({ids: ids, type:type, active: active})
  }

}
