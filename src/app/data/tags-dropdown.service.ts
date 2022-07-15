import { Injectable } from '@angular/core';
import { PERSON_DROPDOWN } from '../mock-data/person-dropdown-mock';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsDropdownService {

  constructor() { }

  getListOfTags(tagType: string){
    let rawTags;
    switch(tagType){
      case'person':
        rawTags = PERSON_DROPDOWN
      break;
    }

    let dropdown: Array<{label: string; value: string;}> = [];

rawTags?.forEach( tag => {
  dropdown.push({
    label: tag.name,
    value: tag.type
  });
});

    return dropdown;
  }
}
