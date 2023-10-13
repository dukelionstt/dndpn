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
import { Location } from '../model/location.model';
import { flush } from '@angular/core/testing';
import Quill from 'quill';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { REFERENCE } from '../constants';

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
  quill!: Quill;
  icons = new IconService();
  previousCard!: ElementRef;
  tagStrings!: string;
  extractResults!: string[];
  isExtractViewLoading!: boolean;
  isResults!: boolean;
  expectRows!: number;

  htmlDecoder = new HttpUrlEncodingCodec();
  htmlEncoder = new HttpUrlEncodingCodec();

  @Input()
  pages!: Page[];

  constructor(
    private tagService: TagsService,
    private log: LoggerService,
    private highlightService: HiglightEditorTagsService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
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
    this.extractResults = [];
    this.isExtractViewLoading = false;
    this.isResults = false;
    this.tagService.getExtractEvent.subscribe((value) =>
      this.extractResults.push(value),
    );
    this.log.info(`finishing`, 'ngOnInit', 'TagsComponent');
  }

  ngAfterViewInit(): void {
    this.log.info(`Starting`, 'ngAfterViewInit', 'TagsComponent');
    this.log.debug('running change ');
    this.switchCard(
      this.elementRef.nativeElement.querySelector('#NotebookCard'),
    );
    this.expectRows = 0;
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

  selectTags(tagType: string, name: string, tagLocations: Location[]) {
    this.isExtractViewLoading = true;
    this.expectRows = 0;
    this.extractResults = [];

    const sleep = (sec: number) =>
      new Promise((r) => setTimeout(r, sec * 1000));

    let wordPages = [
      ...new Set(tagLocations.map((tagLocation) => tagLocation.pageId)),
    ];

    /*
      thought: global search only:
        select tag
        if this page
          emit
        else 
          get from storage

        display options
    */

    if (tagType == REFERENCE) {
      let tagWords = this.tags
        .filter((tag) => tag.type == tagType)
        .map((tag) => tag.name);
      if (wordPages.length > 1) {
        wordPages.forEach((wordPage) => {
          tagWords.forEach((word) =>
            this.tagService.triggerExtract(word, wordPage),
          );
        });
        this.expectRows = wordPages.length * tagWords.length;
      } else {
        tagWords.forEach((word) =>
          this.tagService.triggerExtract(word, wordPages[0]),
        );
        this.expectRows = tagWords.length;
      }
    } else {
      if (wordPages.length > 1) {
        wordPages.forEach((wordPage) =>
          this.tagService.triggerExtract(name, wordPage),
        );
        this.expectRows = wordPages.length;
      } else {
        this.tagService.triggerExtract(name, wordPages[0]);
        this.expectRows = 1;
      }
    }

    let expectRestultsValid = false;
    let previousResultsCount = 0;
    for (let i = 0; i < 4; i++) {
      expectRestultsValid = this.extractResults.length == this.expectRows;
      if (expectRestultsValid) {
        break;
      } else {
        if (previousResultsCount == 0) {
          previousResultsCount = this.extractResults.length;
        } else {
          if (previousResultsCount < this.extractResults.length) {
            previousResultsCount = this.extractResults.length;
            i = 0;
          }
        }
      }
      sleep(5);
    }

    if (!expectRestultsValid) {
      if (this.extractResults.length > 0) {
        this.extractResults.push(
          'Some results did not show, please try again.',
        );
      } else {
        this.extractResults.push('Search Failed, please try again.');
      }
    }

    this.isResults = true;
    this.isExtractViewLoading = false;

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

  getTagEntryExtract(
    id: number,
    name: string,
    tagType: string,
    pageId: number,
  ) {
    this.log.info('Starting', 'getTagEntryString', 'QuillToolbarComponent');
    let range =
      this.pages[pageId - 1].tags[tagType as keyof Tags][id].metaData.range;
    this.log.debug(
      `the params are id, name, tagType :: ${id}, ${name}, ${tagType}`,
      'getTagEntryExtract',
      'QuillToolbarComponent',
    );
    this.log.debug(
      `range is number :: ${range}`,
      'getTagEntryExtract',
      'QuillToolbarComponent',
    );

    this.log.debug(
      `next lind is tag ranges ::`,
      'getTagEntryExtract',
      'QuillToolbarComponent',
    );
    this.log.debug(this.pages[pageId - 1].tagRanges);
    this.log.debug(
      ` next index  values that are equal :: ${
        this.pages[pageId - 1].tagRanges.indexOf(range) + 1
      }, ${this.pages[pageId - 1].tagRanges.length}`,
      'getTagEntryString',
      'QuillToolbarComponent',
    );
    this.log.debug(
      `previous index valuse that are greater than the other :: ${this.pages[
        pageId - 1
      ].tagRanges.indexOf(range)}, ${0}`,
      'getTagEntryString',
      'QuillToolbarComponent',
    );

    this.quill = this.getQuillinstance(pageId);

    let indexNextTag: number =
      this.pages[pageId - 1].tagRanges.indexOf(range) + 1 ==
      this.pages[pageId - 1].tagRanges.length
        ? -1
        : this.pages[pageId - 1].tagRanges[
            this.pages[pageId - 1].tagRanges.indexOf(range) + 1
          ];
    let indexPreviousTag: number =
      this.pages[pageId - 1].tagRanges.indexOf(range) > 0
        ? this.pages[pageId - 1].tagRanges[
            this.pages[pageId - 1].tagRanges.indexOf(range) - 1
          ]
        : -1;
    let extract: string = '';
    this.log.debug(
      `previous index and next index :: ${indexPreviousTag}, ${indexNextTag}`,
      'getTagEntryString',
      'QuillToolbarComponent',
    );
    extract = this.formatExtract(
      this.getTextFromEditor(
        indexPreviousTag != -1 ? indexPreviousTag : 0,
        indexNextTag != -1
          ? indexNextTag
          : this.quill.getLength() > 150
          ? this.findFinishIndex(range)
          : this.quill.getLength(),
      ),
      name,
      indexPreviousTag != -1 ? range - indexPreviousTag : range,
      tagType,
    );
    this.log.debug(
      `extract :: ${extract}`,
      'getTagEntryString',
      'QuillToolbarComponent',
    );
    this.log.info('finishing', 'getTagEntryString', 'QuillToolbarComponent');
    return extract;
  }

  private findFinishIndex(range: number): number {
    this.log.info('Starting', 'findFinishIndex', 'QuillToolbarComponent');
    let tempString: string = '';
    this.quill
      .getText(range, 150)
      .split(/\s/)
      .forEach((value, index) => {
        if (index < 10) {
          tempString += value + ' ';
        } else {
          return;
        }
      });
    this.log.info('Finishing', 'findFinishIndex', 'QuillToolbarComponent');
    return tempString.trimEnd.length;
  }

  private getQuillinstance(pageId: number) {
    let tempQuill = new Quill('#editor');
    tempQuill.root.innerHTML = this.htmlDecoder.decodeValue(
      this.pages[pageId - 1].page,
    );
    return tempQuill;
  }

  private getTextFromEditor(startIndex: number, finishIndex: number): string {
    this.log.info('Starting', 'getTextFromEditor', 'QuillToolbarComponent');
    this.log.debug(
      `The passed in params are startIndex=${startIndex} and finishIndex=${finishIndex}`,
      'getTextFromEditor',
      'QuillToolbarComponent',
    );
    this.log.info('Finishing', 'getTextFromEditor', 'QuillToolbarComponent');
    return this.quill.getText(startIndex, finishIndex - startIndex);
  }

  private formatExtract(
    rawExtract: string,
    name: string,
    range: number,
    nameType: string,
  ): string {
    this.log.info('Starting', 'formatExtract', 'QuillToolbarComponent');
    this.log.debug(
      `The passed in params are range :: ${range}`,
      'formatExtract',
      'QuillToolbarComponent',
    );
    let beforeName: string = rawExtract.substring(0, range - 1).trim();
    let afterName: string = rawExtract.substring(range - 1).trim();
    this.log.info('Finishing', 'formatExtract', 'QuillToolbarComponent');

    return beforeName + this.wrapName(name, nameType) + afterName;
  }

  private wrapName(name: string, nameType: string): string {
    this.log.info('Starting', 'wrapName', 'QuillToolbarComponent');

    this.log.info('Finishing', 'wrapName', 'QuillToolbarComponent');
    return ` <span class="${nameType} highlight ${nameType}Glow">${name}</span> `;
  }

  selectCard(cardId: string) {
    this.log.info(`Starting`, 'selectCard', 'TagsComponent');
    let queryString = `#${cardId.replace(/\s/g, '')}`;
    let card = this.elementRef.nativeElement.querySelector(queryString);
    this.log.debug(
      `queryString is set to ${queryString} and the card is set to the following:`,
      'selectCard',
      'TagsComponent',
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
