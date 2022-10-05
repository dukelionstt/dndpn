import { Component, Input, OnInit } from '@angular/core';
import { TagsService } from '../data/tags.service';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { TagLocation } from '../model/tag-locations';
import { TagMap } from '../model/tag-map-model';
import { Tag } from '../model/tag-model';
import { Tags } from '../model/tags-model';
import { IconService } from '../service/icon.service';
import { HiglightEditorTagsService } from '../widgets/higlight.editor.tags.service';
import { TagListComponent } from '../widgets/tag.list.component';

@Component({
  selector: 'tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tags!: Tag[];
  tagMap!: TagMap[];
  tagMapHashed!: Map<number, TagLocation[]>;
  pageTagList!: Map<string, Tag[]>;
  icons = new IconService();

  @Input()
  pages!: Page[];

  constructor(
    private tagService: TagsService,
    private log: LoggerService,
    private highlightService: HiglightEditorTagsService
  ) {}

  ngOnInit(): void {
    this.tags = this.tagService.getTags();
    this.pageTagList = this.buildPageTagList();
    this.tagMap = this.tagService.getTagMap();
    this.tagMapHashed = new Map(
      this.tagMap.map((tags) => [tags.id, tags.locations])
    );
  }

  private buildPageTagList() {
    this.log.info(`building tags dictionary :: Starting`);
    let temp = new Map<string, Tag[]>();

    temp.set('Notebook', this.tags);

    for (let page of this.pages) {
      this.log.debug(page);
      let tempList: Tag[] = [];
      if (page.tagReference) {
        //remove once all page refences are fixed
        this.log.debug(`using the following ids for to search tags`);
        this.log.debug(page.tagReference);
        for (let id of page.tagReference) {
          this.log.debug(`searching with id ${id}`);
          let tempTag = this.getTagById(id);
          this.log.debug(`Following entry created`);
          this.log.debug(tempTag);
          if (tempTag) {
            tempList.push(tempTag);
          }
        }
      }
      temp.set(page.name, tempList);
    }
    this.log.debug(`following object will be retured`);
    this.log.debug(temp);
    this.log.info(`building tags dictionary :: finishing`);
    return temp;
  }

  private getTagById(id: number) {
    for (let tag of this.tags) {
      if (tag.id == id) {
        return tag;
      }
    }
    return null;
  }

  selectTags(id: number) {
    this.log.info(`following passed in id ${id}`);
    let list: Map<string, number[]> = new Map<string, number[]>();

    list = this.collectIds(id);

    this.log.debug(list);
    // this.highlightService.
  }

  private collectIds(id: number) {
    let tempMap: Map<string, number[]> = new Map<string, number[]>();
    let key: string = '';
    let tempList: number[] = [];

    let tagLocations = this.tagMapHashed.get(id);

    if (tagLocations) {
      tagLocations.forEach((local) => {
        if (key == '') {
          key = local.type;
          tempList.push(local.index);
        } else {
          if (key != local.type) {
            tempMap.set(key, tempList);
            tempList = [];
            key = local.type;
            tempList.push(local.index);
          } else {
            tempList.push(local.index);
          }
        }
      });

      tempMap.set(key, tempList);
    }

    return tempMap;
  }

  private collectReferenceIds(name: string, id?: number) {
    let tempList: number[] = [];
    if (id) {
      for (let tag of this.pages[id].tags[name as keyof Tags]) {
        tempList.push(tag.metaData.buttonIndex);
      }
    } else {
      for (let page of this.pages) {
        for (let tag of page.tags[name as keyof Tags]) {
          tempList.push(tag.metaData.buttonIndex);
        }
      }
    }

    return tempList;
  }
}
