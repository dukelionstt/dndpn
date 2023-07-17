import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
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

const DEFAULT = 'default';
const ROTATE = 'rotated';

@Component({
  selector: 'tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  animations: [
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-360deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in')),
    ]),
  ],
})
export class TagsComponent implements OnInit, AfterViewInit {
  animationState!: string;

  tags!: Tag[];
  tagMap!: TagMap[];
  tagMapHashed!: Map<number, TagLocation[]>;
  pageTagList!: Map<string, Tag[]>;
  icons = new IconService();
  previousCard!: ElementRef;

  @Input()
  pages!: Page[];

  constructor(
    private tagService: TagsService,
    private log: LoggerService,
    private highlightService: HiglightEditorTagsService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.tags = this.tagService.getTags();
    this.pageTagList = this.buildPageTagList();
    this.tagMap = this.tagService.getTagMap();
    this.tagMapHashed = new Map(
      this.tagMap.map((tags) => [tags.id, tags.locations])
    );
    this.animationState = DEFAULT;
  }

  ngAfterViewInit(): void {
    this.log.debug('running change ');
    this.switchCard(
      this.elementRef.nativeElement.querySelector('#NotebookCard')
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

  selectTags(event: any, id: number) {
    this.log.info(`following passed in id ${id}`);
    let list: Map<string, number[]> = new Map<string, number[]>();

    list = this.collectIds(id);

    this.log.debug(list);

    this.highlightService.highlightProcess(event, list, 'global', id);
    if (this.highlightService.active) {
      this.animationState = ROTATE;
    } else {
      this.animationState = DEFAULT;
    }
  }

  selectCard(cardId: string) {
    let queryString = `#${cardId.replace(/\s/g, '')}`;
    let card = this.elementRef.nativeElement.querySelector(queryString);
    this.log.debug(
      `queryString is set to ${queryString} and the card is set to the following:`
    );
    this.log.debug(card);
    this.switchCard(card);
  }

  private switchCard(element: ElementRef) {
    if (this.previousCard) {
      this.renderer.setAttribute(this.previousCard, 'hidden', 'true');
    }
    this.renderer.removeAttribute(element, 'hidden');
    this.previousCard = element;
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

  // private collectReferenceIds(name: string, id?: number) {
  //   let tempList: number[] = [];
  //   if (id) {
  //     for (let tag of this.pages[id].tags[name as keyof Tags]) {
  //       tempList.push(tag.metaData.buttonIndex);
  //     }
  //   } else {
  //     for (let page of this.pages) {
  //       for (let tag of page.tags[name as keyof Tags]) {
  //         tempList.push(tag.metaData.buttonIndex);
  //       }
  //     }
  //   }

  //   return tempList;
  // }
}
