import { Injectable, Output, EventEmitter } from '@angular/core';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { Person } from '../model/person-model';
import { Place } from '../model/place-model';
import { Item } from '../model/item-model';
import { Misc } from '../model/misc-model';
import { Tags } from '../model/tags-model';
import { TAG_LIST } from '../mock-data/tag-mock';
import { HttpClient } from '@angular/common/http';
import { FileService } from './file.service';
import { TAG_MAP } from '../mock-data/tag-map.mock';
@Injectable({
  providedIn: 'root',
})
export class TagsService {

  @Output() triggerExtractEvent: EventEmitter<any> = new EventEmitter(); 
  @Output() getExtractEvent: EventEmitter<any> = new EventEmitter();  

  constructor(private http: HttpClient, private file: FileService) {}

  triggerExtract(range: string, name: string, tagType: string){
    this.triggerExtractEvent.emit({range: range,name: name,tagType: tagType});
  }

  getTags() {
    // return this.file.getFile("E:\\backup\\dndpn\\src\\app\\mock-data\\tag-mock.json")
    return TAG_LIST;
  }

  getTagMap() {
    // return this.file.getFile();
    return TAG_MAP;
  }

  getListFromTags(listType: string, tags: Tags) {
    let list: any;

    switch (listType) {
      case PERSON:
        list = tags.person;
        break;
      case PLACE:
        list = tags.place;
        break;
      case ITEM:
        list = tags.item;
        break;
      case MISC:
        list = tags.misc;
        break;
    }

    return list;
  }

  convertListToTags(listType: string, list: any, tags: Tags) {
    switch (listType) {
      case PERSON:
        tags.person = list;
        break;
      case PLACE:
        tags.place = list;
        break;
      case ITEM:
        tags.item = list;
        break;
      case MISC:
        tags.misc = list;
        break;
    }

    return tags;
  }

  convertDatatoTagListEntry(objectType: string, id: number, dataObject: any) {
    let tag: any;

    switch (objectType) {
      case PERSON:
        let person: Person = {
          id: id,
          name: dataObject.name!,
          date: dataObject.date,
          misc: dataObject.misc,
          notes: dataObject.notes!,
          metaData: {
            range: dataObject.range,
            length: dataObject.name.length,
            buttonIndex: dataObject.buttonIndex,
          },
        };
        tag = person;
        break;
      case PLACE:
        let place: Place = {
          id: id,
          name: dataObject.name!,
          location: dataObject.location!,
          area: dataObject.area!,
          date: dataObject.date,
          misc: dataObject.misc,
          notes: dataObject.notes!,
          metaData: {
            range: dataObject.range,
            length: dataObject.name.length,
            buttonIndex: dataObject.buttonIndex,
          },
        };
        tag = place;
        break;
      case ITEM:
        let item: Item = {
          id: id,
          name: dataObject.name!,
          type: dataObject.itemtype,
          date: dataObject.date,
          misc: dataObject.misc,
          notes: dataObject.notes!,
          metaData: {
            range: dataObject.range,
            length: dataObject.name.length,
            buttonIndex: dataObject.buttonIndex,
          },
        };
        tag = item;
        break;
      case MISC:
        let misc: Misc = {
          id: id,
          name: dataObject.name!,
          date: dataObject.date,
          misc: dataObject.misc,
          notes: dataObject.notes!,
          metaData: {
            range: dataObject.range,
            length: dataObject.name.length,
            buttonIndex: dataObject.buttonIndex,
          },
        };
        tag = misc;
        break;
      default:
        break;
    }

    return tag;
  }
}
