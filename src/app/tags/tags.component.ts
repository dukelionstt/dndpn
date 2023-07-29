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
  tagStrings!: string;

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
    this.log.info(`Starting`, 'ngOnInit', 'TagsComponent');
    this.tags = this.tagService.getTags();
    // this.pageTagList = this.buildPageTagList();
    // this.tagMap = this.tagService.getTagMap();
    // this.tagMapHashed = new Map(
    //   this.tagMap.map((tags) => [tags.id, tags.locations])
    // );
    this.animationState = DEFAULT;
    this.tagStrings = '';
    this.log.info(`finishing`, 'ngOnInit', 'TagsComponent');
  }

  ngAfterViewInit(): void {
    this.log.info(`Starting`, 'ngAfterViewInit', 'TagsComponent');
    this.log.debug('running change ');
    this.switchCard(
      this.elementRef.nativeElement.querySelector('#NotebookCard')
    );
    this.log.info(`finishing`, 'ngAfterViewInit', 'TagsComponent');
  }



  // private buildPageTagList() {
  //   this.log.info(`Starting`, 'buildPageTagList', 'TagsComponent');
  //   let temp = new Map<string, Tag[]>();

  //   temp.set('Notebook', this.tags);

  //   for (let page of this.pages) {
  //     this.log.debug(page);
  //     let tempList: Tag[] = [];
  //     if (page.tagReference) {
  //       //remove once all page refences are fixed
  //       this.log.debug(
  //         `using the following ids for to search tags`,
  //         'buildPageTagList',
  //         'TagsComponent'
  //       );
  //       this.log.debug(page.tagReference);
  //       for (let id of page.tagReference) {
  //         this.log.debug(
  //           `searching with id ${id}`,
  //           'buildPageTagList',
  //           'TagsComponent'
  //         );
  //         let tempTag = this.getTagById(id);
  //         this.log.debug(
  //           `Following entry created`,
  //           'buildPageTagList',
  //           'TagsComponent'
  //         );
  //         this.log.debug(tempTag);
  //         if (tempTag) {
  //           tempList.push(tempTag);
  //         }
  //       }
  //     }
  //     temp.set(page.name, tempList);
  //   }
  //   this.log.debug(
  //     `following object will be retured`,
  //     'buildPageTagList',
  //     'TagsComponent'
  //   );
  //   this.log.debug(temp);
  //   this.log.info(`finishing`, 'buildPageTagList', 'TagsComponent');
  //   return temp;
  // }

  private getTagById(id: number) {
    for (let tag of this.tags) {
      if (tag.id == id) {
        return tag;
      }
    }
    return null;
  }

  selectTags(id: number) {
    // this.pages.forEach((page) => {
    //   if (page.tagReference?.indexOf(id) != -1) {
    //     this.tagStrings += `Found entry in page ${
    //       page.name
    //     } for tag of name ${this.tags.forEach((info) =>
    //       info.id == id ? info.name : ''
    //     )}\n\r`;
    //   }
    // });
  }

  // selectTags(event: any, id: number) {
  //   this.log.info(`Starting`, 'selectTags', 'TagsComponent');
  //   this.log.info(
  //     `following passed in id ${id}`,
  //     'selectTags',
  //     'TagsComponent'
  //   );
  //   let list: Map<string, number[]> = new Map<string, number[]>();

  //   list = this.collectIds(id);

  //   this.log.debug(list);

  //   this.highlightService.highlightProcess(event, list, 'global', id);
  //   if (this.highlightService.active) {
  //     this.animationState = ROTATE;
  //   } else {
  //     this.animationState = DEFAULT;
  //   }
  //   this.log.info(`finishing`, 'selectTags', 'TagsComponent');
  // }

  selectCard(cardId: string) {
    this.log.info(`Starting`, 'selectCard', 'TagsComponent');
    let queryString = `#${cardId.replace(/\s/g, '')}`;
    let card = this.elementRef.nativeElement.querySelector(queryString);
    this.log.debug(
      `queryString is set to ${queryString} and the card is set to the following:`,
      'selectCard',
      'TagsComponent'
    );
    this.log.debug(card);
    this.switchCard(card);
    this.log.info(`finishing`, 'selectCard', 'TagsComponent');
  }

  private switchCard(element: ElementRef) {
    this.log.info(`Starting`, 'switchCard', 'TagsComponent');
    if (this.previousCard) {
      this.renderer.setAttribute(this.previousCard, 'hidden', 'true');
    }
    this.renderer.removeAttribute(element, 'hidden');
    this.previousCard = element;
    this.log.info(`finishing`, 'switchCard', 'TagsComponent');
  }

  // private collectIds(id: number) {
  //   this.log.info(`Starting`, 'collectIds', 'TagsComponent');
  //   let tempMap: Map<string, number[]> = new Map<string, number[]>();
  //   let key: string = '';
  //   let tempList: number[] = [];

  //   let tagLocations = this.tagMapHashed.get(id);
  //   this.log.debug(
  //     `showing the tag map hashed object next line`,
  //     'collectIds',
  //     'TagsComponent'
  //   );
  //   this.log.debug(this.tagMapHashed);
  //   if (tagLocations) {
  //     tagLocations.forEach((local) => {
  //       if (key == '') {
  //         key = local.type;
  //         tempList.push(local.index);
  //       } else {
  //         if (key != local.type) {
  //           tempMap.set(key, tempList);
  //           tempList = [];
  //           key = local.type;
  //           tempList.push(local.index);
  //         } else {
  //           tempList.push(local.index);
  //         }
  //       }
  //     });

  //     tempMap.set(key, tempList);
  //   }
  //   this.log.info(`finishing`, 'collectIds', 'TagsComponent');
  //   return tempMap;
  // }

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
