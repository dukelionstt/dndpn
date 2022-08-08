import { Injectable } from '@angular/core';
import { ITEMTYPES } from '../mock-data/item-types-mock';

@Injectable({
  providedIn: 'root'
})
export class ItemTypesService {

  constructor() { }

  getListofItemTypes(){
    let dropdown: Array<{label: string; value: string;}> = [];

    ITEMTYPES.forEach(item => {
      dropdown.push({
        label: item.name,
        value: item.name
      })
    });

    return dropdown;
  }

}
