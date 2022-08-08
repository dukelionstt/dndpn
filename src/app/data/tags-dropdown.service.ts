import { Injectable } from '@angular/core';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { ITEM_DROPDOWN } from '../mock-data/item-dropdown-mock';
import { MISC_DROPDOWN } from '../mock-data/misc-dropdown-mock';
import { PERSON_DROPDOWN } from '../mock-data/person-dropdown-mock';
import { PLACE_DROPDOWN } from '../mock-data/place-dropdown-mock';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsDropdownService {

  constructor() { }

  getListOfTags(tagType: string){
    let rawTags;
    switch(tagType){
      case PERSON:
        rawTags = PERSON_DROPDOWN
      break;
      case ITEM:
        rawTags = ITEM_DROPDOWN
      break;
      case PLACE:
        rawTags = PLACE_DROPDOWN
      break;
      case MISC:
        rawTags = MISC_DROPDOWN
      break;
    }

    let dropdown: Array<{label: string; value: string;}> = [];

rawTags?.forEach( tag => {
  dropdown.push({
    label: tag.name,
    value: tag.name
  });
});

    return dropdown;
  }
}
