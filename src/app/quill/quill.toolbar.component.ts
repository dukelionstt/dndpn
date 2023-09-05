import { HttpUrlEncodingCodec } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  OnChanges,
  SimpleChange,
  HostListener,
} from '@angular/core';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { TagEntry } from '../model/tag-entry-model';
import { Tag } from '../model/tag-model';
import { Tags } from '../model/tags-model';
import { IconService } from '../service/icon.service';
import { MenuService } from '../service/menu.service';
import { HiglightEditorTagsService } from '../widgets/higlight.editor.tags.service';
import { Delta, Quill } from 'quill';
import { TagsService } from '../data/tags.service';
import { Word } from '../model/word.model';

const INSERT: string = 'insert';
const DELTE: string = 'delete';

@Component({
  selector: 'toolbar',
  templateUrl: './quill.toolbar.component.html',
})
export class QuillToolbarComponent implements OnInit {
  @Input()
  pages!: Page[];

  @Input()
  passingPageId!: string;

  @Input()
  tagEntry!: TagEntry;

  @Input()
  quill!: Quill;

  @Input()
  sending!: boolean;

  @Input()
  highlightConfig!: { send: boolean; map: Map<boolean, Map<string, number[]>> };

  @Output() newQuillEditor = new EventEmitter<any>();

  // @HostListener('document:command', ['$event'])
  // handleCommand(event: any){
  //   this.log.info(`Angular has receieved event`)
  //   this.log.info(event)
  // }

  range: any;
  text: string = '';

  sideBarTitle!: string;
  textPresent!: boolean;
  content!: any;
  listenerPresent!: boolean;
  updateIndicator!: boolean;
  changeIndicator!: boolean;
  loadingContent!: boolean;
  newWord!: boolean;
  updateType!: string;
  toolType!: string;
  toolId!: number;
  pageId!: number;
  lastCursorPosition!: number;
  maxExtractLength!: number;
  wordMap!: Word[];

  personTag: string = PERSON;
  placeTag: string = PLACE;
  itemTag: string = ITEM;
  miscTag: string = MISC;

  visible = false;

  icons = new IconService();
  buttonEvents = new Map();

  htmlDecoder = new HttpUrlEncodingCodec();
  htmlEncoder = new HttpUrlEncodingCodec();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private log: LoggerService,
    private highlightTagService: HiglightEditorTagsService,
    private menuService: MenuService,
    private tagService: TagsService
  ) {}

  ngOnInit(): void {
    this.log.info(
      `initilising variables for puill tool bar:: Started`,
      this.ngOnInit.name,
      QuillToolbarComponent.name
    );

    this.buttonEvents.set(PERSON, 0);
    this.buttonEvents.set(PLACE, 0);
    this.buttonEvents.set(ITEM, 0);
    this.buttonEvents.set(MISC, 0);

    this.maxExtractLength = 150;

    this.tagEntry = this.setupOrClearTagEntry();

    this.listenerPresent = false;
    this.updateIndicator = false;
    this.changeIndicator = false;
    this.loadingContent = false;
    this.newWord = false;

    this.pageId = parseInt(this.passingPageId);
    console.debug(this.pageId);

    this.highlightTagService.highLightTag.subscribe((tags) => {
      if (tags.pageId + 1 == this.pageId) {
        this.highlightTag(tags.ids, tags.type, tags.active);
      }
    });

    this.tagService.triggerExtractEvent.subscribe((extractData) =>
      extractData.pageId == this.pageId
        ? this.getTagEntryExtract(
            extractData.id,
            extractData.name,
            extractData.tagType,
            extractData.pageId
          )
        : this.log.debug(
            'extract not for this page',
            'ngOnInit',
            'QuillToolbarComponent'
          )
    );
    // this.menuService.getPasteQuill.subscribe(clipbaord => this.pasteClipboard(clipbaord))

    this.log.info(`initilising variables for puill tool bar:: finished`);
  }

  private setupOrClearTagEntry() {
    return {
      id: 0,
      name: '',
      previousName: '',
      date: '',
      misc: [],
      notes: '',
      location: '',
      previousLocation: '',
      area: '',
      previousArea: '',
      itemtype: [],
      previousItemtype: [],
      range: 0,
      buttonIndex: 0,
      lenght: 0,
    };
  }

  editorCreated(editor: any) {
    this.log.info(`starting`, 'editorCreated', 'QuillToolbarComponent');

    this.quill = editor;
    this.newQuillEditor.emit(this.quill);
    this.log.info(`new editor announced and shared`);
    let editorJustFilled = false;

    this.log.info(`Setting content for the page:: Started`);
    this.loadingContent = true;
    try {
      if (this.pages[this.pageId - 1].page.length > 0) {
        this.loadPageContent();
        this.wordMap = this.pages[this.pageId - 1].wordMap;
      } else {
        this.log.info(`new page`, 'editorCreated', 'QuillToolbarComponent');
        this.wordMap = [];
      }
      editorJustFilled = true;
    } catch (error) {
      this.log.error(`issue loading content`);
      this.log.error(`${error}`);
    } finally {
      this.loadingContent = false;
    }

    this.log.debug(
      `before setting on change editor just filled is ${editorJustFilled}`,
      'editorCreated',
      'QuillToolbarComponent'
    );
    this.quill.on(
      'text-change',
      (delta: Delta, oldDelta: Delta, source: string) => {
        this.log.info(
          `text change from ${source}`,
          'editorCreated',
          'QuillToolbarComponent'
        );
        this.log.debug(
          `next two lines are delta, oldDelta`,
          'editorCreated',
          'QuillToolbarComponent'
        );
        this.log.debug(delta);

        this.log.info(
          `before checking flag it is ${editorJustFilled}`,
          'editorCreated',
          'QuillToolbarComponent'
        );
        if (editorJustFilled) {
          editorJustFilled = false;
        } else {
          if (delta.ops) {
            if (delta.ops[1].insert && delta.ops[0].retain) {
              this.log.debug(
                `inserting to map`,
                'editorCreated',
                'QuillToolbarComponent'
              );
              this.updateWordMap(delta.ops[1].insert, delta.ops[0].retain, INSERT)
            } else if (delta.ops[1].delete && delta.ops[0].retain) {
              this.log.debug(
                `deleting from map`,
                'editorCreated',
                'QuillToolbarComponent'
              );
            }
          }
          if (delta != oldDelta) {
            this.log.debug(
              `difference in detected, marking as not update`,
              'editorCreated',
              'QuillToolbarComponent'
            );
            this.pages[this.pageId - 1].saveUpToDate = false;
          } else {
            this.log.debug(
              `no difference update`,
              'editorCreated',
              'QuillToolbarComponent'
            );
            this.pages[this.pageId - 1].saveUpToDate = true;
          }
        }
      }
    );

    this.quill.focus();
    this.log.debug(
      `focus brought to the editor`,
      'editorCreated',
      'QuillToolbarComponent'
    );
    // this.getTagEntryExtract('0', PERSON);
    // this.log.debug(
    //   `just about to change editor fill flag to false`,
    //   'editorCreated',
    //   'QuillToolbarComponent'
    // );
    // editorJustFilled = false;
    // this.log.debug(`flag now changed`, 'editorCreated', 'QuillToolbarComponent');
    this.log.info(`finish`, 'editorCreated', 'QuillToolbarComponent');
  }

  private updateWordMap(input: string, index: number, insertDelete: string) {
    switch (insertDelete) {
      case INSERT:
        this.insertWordMap(input, index);
        break;
      case DELTE:
        this.deleteWordMap(parseInt(input), index);
        break;

      default:
        break;
    }
    // if (!delta.ops[1].insert.matches(/\s/)) {
    //   if (this.newWord) {
    //     this.wordMap.push({
    //       word: delta.ops[1].insert,
    //       metaData: {
    //         index: delta.ops[0].retain,
    //         length: delta.ops[1].insert.lenght,
    //         linked: -1,
    //         type: 'word',
    //       },
    //     });
    //   } else {
    //     this.wordMap[this.wordMap.length - 1].word += delta.ops[1].insert;
    //   }
    // } else {
    // }
  }

  showMap(){ //testing only
    this.log.debug(this.wordMap)
  }

  verifyWord(index: string, range: string){
    this.log.debug(`the word is '${this.quill.getText(parseInt(index), parseInt(range))}'`)
  }

  private insertWordMap(input: string, index: number) {
    this.log.info(`finish`, 'insertWordMap', 'QuillToolbarComponent');
    /**
     * main flow checks this checks if this is appened to the end or alteration in the middle.
     * This is splint two flows:
     */
    this.log.debug(`main if ${index} >= ${this.wordMap[this.wordMap.length-1].metaData.index+(this.wordMap[this.wordMap.length-1].metaData.length != 0? this.wordMap[this.wordMap.length-1].metaData.length-1 : this.wordMap[this.wordMap.length-1].metaData.length)} :: ${index >= this.wordMap[this.wordMap.length-1].metaData.index+(this.wordMap[this.wordMap.length-1].metaData.length != 0? this.wordMap[this.wordMap.length-1].metaData.length-1 : this.wordMap[this.wordMap.length-1].metaData.length)}`, 'insertWordMap', 'QuillToolbarComponent');
    if(index >= this.wordMap[this.wordMap.length-1].metaData.index+(this.wordMap[this.wordMap.length-1].metaData.length != 0? this.wordMap[this.wordMap.length-1].metaData.type != 'tag'? this.wordMap[this.wordMap.length-1].metaData.length-1 : 0 : this.wordMap[this.wordMap.length-1].metaData.length)){
      this.log.debug(`running at the end logic`, 'insertWordMap', 'QuillToolbarComponent');
      /**
       * the flow checks the new index is higher or equal to the current index
       * this flow follow the below scenarios:
       */
        
      if (input.match(/(?<!\w+)\s(?!\w+)/)) {
        /**
         * flow 1 input is just a single space ' ' and not a space(s) in words. 
         * This flow triggers the start of a new word entry into the map
         */
        this.wordMap.push({
          word: '',
          metaData: {
            index: index+1,
            length: 0,
            linked: -1,
            type: 'word'
          }
        })

      } else if (input.length == 1) {
        /**
         * flow 2 is if the input is a single character that is not a space.
         * This flow updates the last entry in the map.
         */
        let tempWord = this.wordMap[this.wordMap.length-1]
        tempWord.word += input
        tempWord.metaData.length++
        this.wordMap[this.wordMap.length-1] = tempWord
      } else {
        /**
         * flow 3 is when the input is not a single character of any kind.
         * This flow seperates into several inner flows
         */
        if(input.match(/\s/)){
          /**
           * Inner flow is for input that has a space(s) in it 'some word'
           * This flow will split this into array of words and update map based on below
           */
          let words = input.split(/\s/)
          words.forEach((newWord, i) => {
            if(i == 0 && this.wordMap[this.wordMap.length-1].metaData.length == 0){
              /**
               * sub flow checks that this is the first word in the array and that there is an entry waiting
               * to updated from a previous run ie ' ' run.
               * This flow will update the last entry in the map.
               */
                let tempWord = this.wordMap[this.wordMap.length-1]
                tempWord.word = newWord
                tempWord.metaData.length = newWord.length 
                this.wordMap[this.wordMap.length-1] = tempWord  
              } else if(i == 0 && this.wordMap[this.wordMap.length-1].metaData.length > 0){
                /**
                 * sub flow checks it is the first word in the array and there isnt an entry ready for it.
                 * This flow adds a new entry onto the end of the map
                 */
                this.wordMap.push({
                  word: newWord,
                  metaData: {
                    index: index,
                    length: newWord.length,
                    linked: -1,
                    type: 'word'
                  }
                })
              } else {
                /**
                 * sub flow for any other word after the first entry in arry.
                 * This flow adds a new word to the end of the map
                 */
                this.wordMap.push({
                  word: newWord,
                  metaData: {
                    index: this.wordMap[this.wordMap.length-1].metaData.index + this.wordMap[this.wordMap.length-1].metaData.length + 1,
                    length: newWord.length,
                    linked: -1,
                    type: 'word'
                  }
                });
              }
          });
        } else {
          /**
           * Inner flow 2 is for input that has no spaces.
           * This fwo is split into two sub flows
           */
          if(this.wordMap[this.wordMap.length-1].metaData.length == 0){
            /**
             * sub flow checks that there is an entry waiting
             * to updated from a previous run ie ' ' run.
             * This flow will update the last entry in the map.
             */
              let tempWord = this.wordMap[this.wordMap.length-1]
              tempWord.word = input
              tempWord.metaData.length = input.length 
              this.wordMap[this.wordMap.length-1] = tempWord  
          } else if(this.wordMap[this.wordMap.length-1].metaData.length > 0){
            /**
             * sub flow checks if there isnt an entry ready for it.
             * This flow adds a new entry onto the end of the map
             */
            this.wordMap.push({
              word: input,
              metaData: {
                index: index,
                length: input.length,
                linked: -1,
                type: 'word'
              }
            });
          } 
        }
      }
    } else{
      /**
       * the flow is for indexs that are not larger or equal to the last index recorded
       */
      let offset = 0;
      if (input.match(/(?<!\w+)\s(?!\w+)/)){
        this.log.debug(`runing single space before end`, 'insertWordMap', 'QuillToolbarComponent');
        /**
         * flow A if the input is a space by its self
         * this flow finds the entry matching the index range and splits those words
         */
        let entry = -1;
        this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
          if(index >= i.index && index <= i.index+i.length-1){
            entry = k
          }
        });
        //TODO: review adding a space to last word in the list
        this.log.debug(` text at this point is a ${this.quill.getText(this.wordMap[entry].metaData.index, 1)} and is this a space :: ${this.quill.getText(this.wordMap[entry].metaData.index, 1).match(/(?<!\w+)\s(?!\w+)/)? 'true' : 'false'}`, 'insertWordMap', 'QuillToolbarComponent');
        if(!this.quill.getText(this.wordMap[entry].metaData.index, 1).match(/(?<!\w+)\s(?!\w+)/)){
          this.log.debug(`entry is not -1 it is :: ${entry}`, 'insertWordMap', 'QuillToolbarComponent');
          let tempArrayA = this.wordMap.slice(0,entry);
          let tempArrayB = this.wordMap.slice(entry+1);

          this.log.debug(`next lines are array a and b`, 'insertWordMap', 'QuillToolbarComponent');
          this.log.debug(tempArrayA);
          this.log.debug(tempArrayB);

          let tempWordA = this.wordMap[entry].word.substring(0, index-this.wordMap[entry].metaData.index);
          let tempWordB = this.wordMap[entry].word.substring(index-this.wordMap[entry].metaData.index);

          this.log.debug(`two word extracted are :: ${tempWordA}, ${tempWordB}`, 'insertWordMap', 'QuillToolbarComponent');

          tempArrayA[tempArrayA.length-1].word = tempWordA;
          tempArrayA[tempArrayA.length-1].metaData.length = tempWordA.length;

          tempArrayA.push({
            word: tempWordB,
            metaData: {
              index: tempArrayA[tempArrayA.length-1].metaData.index+1,
              length: tempWordB.length,
              linked: -1,
              type: 'word'
            }
          });

          for (let i = 0; i < tempArrayB.length; i++) {
            tempArrayB[i].metaData.index += 1 ;  
          }
          
          this.wordMap = tempArrayA.concat(tempArrayB) 
        } else {
          this.log.debug(`this is a space flow`, 'insertWordMap', 'QuillToolbarComponent');
          // this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
          //   if(index-1 >= i.index && index-1 <= i.index+i.length-1){
          //     entry = k
          //   }
          // });
          this.log.debug(`entry will be :: ${entry}`, 'insertWordMap', 'QuillToolbarComponent');

          this.log.debug(`entry ${entry} == ${this.wordMap.length-1} :: ${entry == this.wordMap.length-1? 'true' : 'false'}`, 'insertWordMap', 'QuillToolbarComponent');

          // entry = entry == this.wordMap.length-1? entry-1 : entry;
          let tempArrayA = this.wordMap.slice(0,entry == this.wordMap.length-1? this.wordMap.length-1 : entry);
          let tempArrayB = this.wordMap.slice((entry == this.wordMap.length-1? entry-1 : entry)+1);

          this.log.debug(`next lines are array a and b`, 'insertWordMap', 'QuillToolbarComponent');
          this.log.debug(tempArrayA);
          this.log.debug(tempArrayB);

          tempArrayA.push({
            word: '',
            metaData: {
              index: index,
              length: 0,
              linked: -1,
              type: 'word'
            }
          })

          for (let i = 0; i < tempArrayB.length; i++) {
            tempArrayB[i].metaData.index += 1 ;  
          }
          
          this.wordMap = tempArrayA.concat(tempArrayB) 
        }

      } else if(input.length == 1){
        this.log.debug(`adding a letter to a word flow`, 'insertWordMap', 'QuillToolbarComponent');
        /**
         * flow B is if the length of input is 1
         * This flow will update an existing entry with input and adjust the ranges 
         */

        let entry = -1;
        this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
          if(index >= i.index && index <= i.index+i.length-1){
            entry = k
          }
        });

        this.log.debug(`word made out of these three sections :: ${this.wordMap[entry].word.substring(0,index-this.wordMap[entry].metaData.index)}, ${input},${this.wordMap[entry].word.substring(index-this.wordMap[entry].metaData.index)}`, 'insertWordMap', 'QuillToolbarComponent');
        
        this.wordMap[entry].word = this.wordMap[entry].word.substring(0,index-this.wordMap[entry].metaData.index) + input + this.wordMap[entry].word.substring(index-this.wordMap[entry].metaData.index)
        this.wordMap[entry].metaData.length += 1;

        for (let i = entry; i < this.wordMap.length-1; i++) {
          this.wordMap[i].metaData.index += 1 ;  
        }

      } else {
        this.log.debug(`entry mid doc is longer than 1`, 'insertWordMap', 'QuillToolbarComponent');
        /**
         * flow C if the input is longer that 1
         * This flow has a few inner flows:
         */
        if(input.match(/\s/)){
          this.log.debug(`input contains spaces`, 'insertWordMap', 'QuillToolbarComponent');
          /** 
           * inner flow for input containing space(s)
           * This flow will add the words to the array
          */
          let entry = -1;
          this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
            if(index >= i.index && index <= i.index+(i.length != 0? i.length-1:i.length)){
              entry = k
            }
          });

          let words = input.split(/\s/);
          

          let tempArrayA: Word[] = []
          let tempArrayB: Word[] = []
          this.log.debug(`entry will be ${entry}`, 'insertWordMap', 'QuillToolbarComponent');
          if(this.quill.getText(this.wordMap[entry].metaData.index, 1).match(/(?<!\w+)\s(?!\w+)/)){
            this.log.debug(`the returned text is a single space`, 'insertWordMap', 'QuillToolbarComponent');
            /**
             * subFlow if the index is inbetween current stuff
             */
            tempArrayA = this.wordMap.slice(0,entry);
            tempArrayB = this.wordMap.slice(entry+1);

            words.forEach((word, i) => {
                if(i == 0){
                  tempArrayA[tempArrayA.length-1].word = word
                  tempArrayA[tempArrayA.length-1].metaData.length = word.length
                  offset += word.length+1

                } else {
                  tempArrayA.push({
                    word: word,
                    metaData: {
                      index: tempArrayA[tempArrayA.length-1].metaData.index + tempArrayA[tempArrayA.length-1].word.length + 1,
                      length: word.length,
                      linked: -1,
                      type: 'word'
                    } 
                  });
                  offset += word.length+1;
                }
            });
            
          } else {
            this.log.debug(`the returned text is not a single space`, 'insertWordMap', 'QuillToolbarComponent');
            let tempWordA = this.wordMap[entry].word.substring(0, index-this.wordMap[entry].metaData.index);
            let tempWordB = this.wordMap[entry].word.substring(index-this.wordMap[entry].metaData.index);

            this.log.debug(`entry and wordMap less 1 are :: ${entry}, ${this.wordMap.length-1}`, 'insertWordMap', 'QuillToolbarComponent');
            if(entry == this.wordMap.length-1){
              this.log.debug(`entry is similar to length of the word map less 1`, 'insertWordMap', 'QuillToolbarComponent');
              words.forEach((word, i) => {
                if(i == 0){
                  this.wordMap[this.wordMap.length-1].word = tempWordA + word
                  this.wordMap[this.wordMap.length-1].metaData.length = (tempWordA + word).length
                  offset += (tempWordA + word).length
                } else if(i != words.length-1){
                  this.wordMap.push({
                    word: word,
                    metaData: {
                      index: this.wordMap[this.wordMap.length-1].metaData.index + this.wordMap[this.wordMap.length-1].metaData.length + 1,
                      length: word.length,
                      linked: -1,
                      type: 'word'
                    } 
                  });
                  offset += word.length + 1
                } else {
                  this.wordMap.push({
                    word: word + tempWordB,
                    metaData: {
                      index: this.wordMap[this.wordMap.length-1].metaData.index + this.wordMap[this.wordMap.length-1].metaData.length + 1,
                      length: (word + tempWordB).length,
                      linked: -1,
                      type: 'word'
                    } 
                  });
                }
                offset += word.length + 1
              });
              this.log.debug(`Offset will be :: ${offset}`, 'insertWordMap', 'QuillToolbarComponent');
            } else {
              this.log.debug(`not the end of the work map`, 'insertWordMap', 'QuillToolbarComponent');
              tempArrayA = this.wordMap.slice(0,entry+1);
              tempArrayB = this.wordMap.slice(entry+1);
  
              this.log.debug(`next lines are array a and b`, 'insertWordMap', 'QuillToolbarComponent');
              this.log.debug(tempArrayA);
              this.log.debug(tempArrayB);
  
              this.log.debug(`next is part 1 & 2 of the word :: ${tempWordA},${tempWordB}`, 'insertWordMap', 'QuillToolbarComponent');

              words.forEach((word, i) => {
                if(i == 0){
                  tempArrayA[tempArrayA.length-1].word = tempWordA + word
                  tempArrayA[tempArrayA.length-1].metaData.length = (tempWordA + word).length
                } else if(i != words.length-1){
                  tempArrayA.push({
                    word: word,
                    metaData: {
                      index: tempArrayA[tempArrayA.length-1].metaData.index + tempArrayA[tempArrayA.length-1].metaData.length + 1,
                      length: word.length,
                      linked: -1,
                      type: 'word'
                    } 
                  });
                } else {
                  tempArrayA.push({
                    word: word + tempWordB,
                    metaData: {
                      index: tempArrayA[tempArrayA.length-1].metaData.index + tempArrayA[tempArrayA.length-1].metaData.length + 1,
                      length: (word + tempWordB).length,
                      linked: -1,
                      type: 'word'
                    } 
                  });
                }
              });

              this.log.debug(`update off set remaining section`, 'insertWordMap', 'QuillToolbarComponent');
              tempArrayB.forEach((word, i) => {
                if(i === 0){
                  tempArrayB[i].metaData.index = tempArrayA[tempArrayA.length-1].metaData.index + tempArrayA[tempArrayA.length-1].metaData.length + 1;
                } else {
                  tempArrayB[i].metaData.index = tempArrayB[i-1].metaData.index + tempArrayB[i-1].metaData.length + 1;
                }

              });
  
            }

            // }
          }
          this.log.debug(`updating wordMap`, 'insertWordMap', 'QuillToolbarComponent');
          this.wordMap = tempArrayA.concat(tempArrayB);
            
          // for (let i = entry; i < this.wordMap.length-1; i++) {
          //   this.wordMap[i].metaData.index += offset;  
          // }
          
        } else {
          this.log.debug(`input is a single word`, 'insertWordMap', 'QuillToolbarComponent');
          let entry = -1;
          this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
            if(index >= i.index && index <= i.index+(i.length == 0? i.length : i.length-1)){
              entry = k
            }
          });

          // let tempArrayA = this.wordMap.slice(0,entry);
          // let tempArrayB = this.wordMap.slice(entry+1);
          this.log.debug(`entry will be ${entry}`, 'insertWordMap', 'QuillToolbarComponent');
          if(this.wordMap[entry].metaData.length == 0 ){
            this.log.debug(`single word is adding to an empty space`, 'insertWordMap', 'QuillToolbarComponent');

            // this.wordMap.map(wordEntry => wordEntry.metaData).forEach((i,k) => {
            //   if(index-1 >= i.index && index-1 <= i.index+i.length-1){
            //     entry = k
            //   }
            // });
            this.wordMap[entry].word = input;
            this.wordMap[entry].metaData.length = input.length;

            // tempArrayA.push({
            //   word: input,
            //   metaData: {
            //     index: tempArrayA[tempArrayA.length-1].metaData.index + tempArrayA[tempArrayA.length-1].metaData.length + 1,
            //     length: input.length,
            //     linked: -1,
            //     type: 'word'
            //   }
            // })
          } else {
            this.log.debug(`single word is adding to an existing word`, 'insertWordMap', 'QuillToolbarComponent');
            this.wordMap[entry].word += input;
            this.wordMap[entry].metaData.length += input.length;
            // let tempWordA = this.wordMap[entry].word.substring(0, index-this.wordMap[entry].metaData.index);
            // let tempWordB = this.wordMap[entry].word.substring(index-this.wordMap[entry].metaData.index);

            // this.log.debug(`three parts making the word are :: ${tempWordA}, ${input}, ${tempWordB}`, 'insertWordMap', 'QuillToolbarComponent');

            // tempArrayA[tempArrayA.length-1].word = tempWordA + input + tempWordB
          }
          for (let i = entry; i < this.wordMap.length-1; i++) {
            this.wordMap[i].metaData.index += input.length ;  
          }

          // this.wordMap = tempArrayA.concat(tempArrayB);
        }
      }
    }
    
  }

  private deleteWordMap(wordLength: number, index: number) {}

  private loadPageContent() {
    this.log.info('starting', 'loadPageContent', 'QuillToolbarComponent');
    this.log.info(
      `setting text content :: Started`,
      'loadPageContent',
      'QuillToolbarComponent'
    );
    // this.quill.setContents(this.pages[0].page)
    this.quill.root.innerHTML = this.htmlDecoder.decodeValue(
      this.pages[this.pageId - 1].page
    );
    this.log.info(
      `setting text content :: Finished`,
      'loadPageContent',
      'QuillToolbarComponent'
    );

    this.log.info(
      `Applying event handlers to taged words :: Started`,
      'loadPageContent',
      'QuillToolbarComponent'
    );
    for (let [key, value] of Object.entries(this.pages[this.pageId - 1].tags)) {
      this.log.info(
        `Working through ${key} set:: Started`,
        'loadPageContent',
        'QuillToolbarComponent'
      );
      this.updateButtons(value, key);
      this.log.info(
        `Working through ${key} set:: Finished`,
        'loadPageContent',
        'QuillToolbarComponent'
      );
    }
    this.log.info(
      `Applying event handlers to taged words :: Finished`,
      'loadPageContent',
      'QuillToolbarComponent'
    );

    this.log.info('finishing', 'loadPageContent', 'QuillToolbarComponent');
  }

  private updateButtons(tagSet: any, tagtype: string) {
    this.log.info(`starting`, 'updateButtons', 'QuillToolbarComponent');

    for (let tag of tagSet) {
      this.log.debug(
        `Attacking click of ${tag.name}`,
        'updateButtons',
        'QuillToolbarComponent'
      );
      this.attachClickEvent(tagtype, tag.metaData.buttonIndex);
    }

    this.buttonEvents.set(tagtype, tagSet.length);
    this.log.info(
      `buttonevent tracker updated for ${tagtype} to ${tagSet.length}`,
      'updateButtons',
      'QuillToolbarComponent'
    );

    this.log.info(`finish`, 'updateButtons', 'QuillToolbarComponent');
  }

  changeOccured() {
    this.log.info(`starting`, 'changeOccured', 'QuillToolbarComponent');
    let currentContent = this.htmlEncoder.encodeValue(
      this.quill.root.innerHTML
    );
    if (currentContent != this.pages[this.pageId].page) {
      this.log.debug(
        `there is a difference since last save`,
        'changeOccured',
        'QuillToolbarComponent'
      );
      this.pages[this.pageId].saveUpToDate = false;
    } else {
      this.log.debug(
        `no change since last save`,
        'changeOccured',
        'QuillToolbarComponent'
      );
      this.pages[this.pageId].saveUpToDate = true;
    }
    this.log.info(`finish`, 'changeOccured', 'QuillToolbarComponent');
  }

  //values passed in by the opening button.
  onNewTagSave(event: any[]) {
    this.log.info(`Started`, 'onNewTagSave', 'QuillToolbarComponent');
    let id = event[0];
    this.changeIndicator = event[1];

    this.log.debug(
      `followinnng have been set, id = ${id} and change indicator = ${this.changeIndicator}`,
      'onNewTagSave',
      'QuillToolbarComponent'
    );

    if (this.updateIndicator) {
      this.log.debug(
        `update indicator present`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      if (this.changeIndicator) {
        this.log.debug(
          `Change indicator present`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );

        let range =
          this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
            .metaData.range;
        let length =
          this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
            .name.length;

        this.log.debug(
          `Setting the following: range = ${range} and length = ${length}`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );

        this.quill.removeFormat(range, length);
        this.log.debug(
          `previous word removed`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          range,
          this.updateType,
          this.forValue(
            this.pages[this.pageId - 1].tags[this.updateType as keyof Tags][id]
              .name,
            this.updateType,
            id
          )
        );

        this.attachClickEvent(this.sideBarTitle, id);
        this.changeIndicator = false;
      }
      this.updateIndicator = false;
    } else {
      this.log.debug(
        `update indicator absent`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      if (this.textPresent) {
        this.log.debug(
          `text present true`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.quill.deleteText(this.range.index, this.text.length);
        this.log.debug(
          `Removed the previous word`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          this.range.index,
          this.sideBarTitle,
          this.forValue(this.text, this.sideBarTitle, id)
        );

        this.textPresent = false;
      } else {
        this.log.debug(
          `text present false`,
          'onNewTagSave',
          'QuillToolbarComponent'
        );
        this.updateTextInPage(
          this.range.index,
          this.sideBarTitle,
          this.forValue(
            this.pages[this.pageId - 1].tags[this.sideBarTitle as keyof Tags][
              id
            ].name,

            this.sideBarTitle,
            id
          )
        );

        this.textPresent = false;
      }
      this.log.debug(
        `adding the button listener`,
        'onNewTagSave',
        'QuillToolbarComponent'
      );
      this.attachClickEvent(this.sideBarTitle, id);
    }

    this.close();
    this.log.info(`Finished`, 'onNewTagSave', 'QuillToolbarComponent');
  }

  private forValue(text: string, icontype: string, id: number) {
    this.log.info(`starting`, 'forValue', 'QuillToolbarComponent');
    this.log.debug(
      `setting ${this.icons.getIcon(icontype) + text}`,
      'forValue',
      'QuillToolbarComponent'
    );
    this.log.info(`Finished`, 'forValue', 'QuillToolbarComponent');
    return this.icons.getIcon(icontype) + text + this.setTooltip(icontype, id);
  }

  private setTooltip(type: string, id: number) {
    let tooltip = '';

    switch (type) {
      case PERSON:
        tooltip =
          '<div class="tooltip"><table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.person[id].notes +
          '</td><table></div>';
        break;
      case PLACE:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Location:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].location +
          '</td></tr>' +
          '<tr><td><strong>Area:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].area +
          '</td></tr>' +
          '<tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.place[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      case ITEM:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Type:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.item[id].type +
          '</td>' +
          '<tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.item[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      case MISC:
        tooltip =
          '<div class="tooltip">' +
          '<table class="tooltipTable"><tr><td><strong>Notes:</strong></td><td>' +
          this.pages[this.pageId - 1].tags.misc[id].notes +
          '</td></tr></table>' +
          '</div>';
        break;
      default:
        break;
    }

    return tooltip;
  }

  private updateTextInPage(index: number, type: string, text: string) {
    this.log.info(`Starting`, 'updateTextInPage', 'QuillToolbarComponent');
    this.log.debug(
      `padded in, index = ${index}, type = ${type} and text = ${text}`
    );

    this.quill.insertEmbed(index, type, text);
    this.quill.setSelection(index + text.length, index + text.length);
    this.log.info(`Finnished`, 'updateTextInPage', 'QuillToolbarComponent');
  }

  private attachClickEvent(buttonClass: string, id: number) {
    this.log.info(`Starting`, 'attachClickEvent', 'QuillToolbarComponent');
    // maintains the number of entries on the page for each tag type, which allows the correct
    //button to get its event handler
    let count = this.buttonEvents.get(buttonClass);
    let queryString = '.' + buttonClass;

    this.log.debug(
      `this run is using: ButtonClass = ${buttonClass}, count = ${count} and querystring = ${queryString}`,
      'attachClickEvent',
      'QuillToolbarComponent'
    );

    //finds the button all the buttons on the page that matches the class passed in eg person
    //and there is also two systems to find out which button this is, first is a running count map for all
    //new button added to the page. The
    let button: any;
    if (this.changeIndicator || this.loadingContent) {
      this.log.debug(
        `Running a change : ${this.changeIndicator} or loading : ${this.loadingContent}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      this.log.debug(
        `Updating button that matches index number: ${
          this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][id]
            .metaData.buttonIndex
        }`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      button =
        this.elementRef.nativeElement.querySelectorAll(queryString)[
          this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][id]
            .metaData.buttonIndex
        ];
    } else {
      this.log.debug(
        `Running a new button`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
      button =
        this.elementRef.nativeElement.querySelectorAll(queryString)[count];
    }
    //adds the event to the button
    this.renderer.listen(button, 'click', (event) =>
      this.tagViewAndUpdate(event, id, buttonClass)
    );
    this.renderer.listen(button, 'hover', (event) =>
      this.toolTipIdAndTypeSet(event, id, buttonClass)
    );
    this.log.debug(
      `click applied to button wth id = ${id}`,
      'attachClickEvent',
      'QuillToolbarComponent'
    );

    if (!this.changeIndicator && !this.loadingContent) {
      //recording the number of the button in order of buttons for that type so that if the text
      //is channge we can assign the correct button
      this.pages[this.pageId - 1].tags[buttonClass as keyof Tags][
        id
      ].metaData.buttonIndex = count;

      this.log.debug(
        `Button id is updated in page to ${count}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );

      //increment the button so we can find the new one on the next call
      count++;

      //store the increment
      this.buttonEvents.set(buttonClass, count);
      let tempMap: Map<string, ElementRef> = new Map();

      this.log.debug(
        `button set ${buttonClass} has been updated to ${count}`,
        'attachClickEvent',
        'QuillToolbarComponent'
      );
    }
    this.log.info(`Finish`, 'attachClickEvent', 'QuillToolbarComponent');
  }

  open() {
    this.visible = true;
  }

  close() {
    this.log.info(`starting`, 'close', 'QuillToolbarComponent');
    this.visible = false;
    this.changeIndicator = false;
    this.updateIndicator = false;
    this.tagEntry = this.setupOrClearTagEntry();
    this.log.debug(
      `change indicator = ${this.changeIndicator}`,
      'close',
      'QuillToolbarComponent'
    );
    this.log.debug(
      `update indicator = ${this.updateIndicator}`,
      'close',
      'QuillToolbarComponent'
    );
    this.log.info(`finishing`, 'close', 'QuillToolbarComponent');
  }

  toolTipIdAndTypeSet(event: any, id: number, type: string) {
    this.toolId = id;
    this.toolType = type;
  }

  tagViewAndUpdate(event: any, id: number, type: string) {
    this.log.info(`starting`, 'tagViewAndUpdate', 'QuillToolbarComponent');
    let tagData = this.pages[0].tags[type as keyof Tags][id];
    this.log.debug(tagData);
    this.displayDataSidebar(tagData, type);

    this.sideBarTitle = type;
    this.updateIndicator = true;
    this.updateType = type;
    this.log.debug(
      `opening the side menu`,
      'tagViewAndUpdate',
      'QuillToolbarComponent'
    );
    this.open();
    this.log.info(`finishing`, 'tagViewAndUpdate', 'QuillToolbarComponent');
  }

  private displayDataSidebar(tagData: any, type: string) {
    switch (type) {
      case PERSON:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case PLACE:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.location = tagData.location;
        this.tagEntry.previousLocation = tagData.location;
        this.tagEntry.area = tagData.area;
        this.tagEntry.previousArea = tagData.area;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case ITEM:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.itemtype = tagData.type;
        this.tagEntry.previousItemtype = tagData.type;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      case MISC:
        this.tagEntry.id = tagData.id;
        this.tagEntry.name = tagData.name;
        this.tagEntry.previousName = tagData.name;
        this.tagEntry.date = tagData.date;
        this.tagEntry.misc = tagData.misc;
        this.tagEntry.notes = tagData.notes;
        this.tagEntry.range = tagData.metaData.range;
        this.tagEntry.buttonIndex = tagData.metaData.buttonIndex;
        break;
      default:
        break;
    }
  }

  tagMenu(tagType: string) {
    this.sideBarTitle = tagType;
    this.range = this.quill.getSelection();

    if (this.range.length == 0 || this.range == null) {
      this.tagEntry.name = '';
      this.tagEntry.misc = [this.sideBarTitle];

      this.textPresent = false;
    } else {
      this.tagEntry.name = this.text = this.quill.getText(
        this.range.index,
        this.range.length
      );
      this.tagEntry.misc = [this.sideBarTitle, this.text];

      this.textPresent = true;
    }
    this.tagEntry.range = this.range.index;

    this.open();
  }

  getTagEntryExtract(
    id: number,
    name: string,
    tagType: string,
    pageId: number
  ) {
    this.log.info('Starting', 'getTagEntryString', 'QuillToolbarComponent');
    let range =
      this.pages[pageId - 1].tags[tagType as keyof Tags][id].metaData.range;
    this.log.debug(
      `the params are id, name, tagType :: ${id}, ${name}, ${tagType}`,
      'getTagEntryExtract',
      'QuillToolbarComponent'
    );
    this.log.debug(
      `range is number :: ${range}`,
      'getTagEntryExtract',
      'QuillToolbarComponent'
    );

    this.log.debug(
      `next lind is tag ranges ::`,
      'getTagEntryExtract',
      'QuillToolbarComponent'
    );
    this.log.debug(this.pages[pageId - 1].tagRanges);
    this.log.debug(
      ` next index  values that are equal :: ${
        this.pages[pageId - 1].tagRanges.indexOf(range) + 1
      }, ${this.pages[pageId - 1].tagRanges.length}`,
      'getTagEntryString',
      'QuillToolbarComponent'
    );
    this.log.debug(
      `previous index valuse that are greater than the other :: ${this.pages[
        pageId - 1
      ].tagRanges.indexOf(range)}, ${0}`,
      'getTagEntryString',
      'QuillToolbarComponent'
    );

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
      'QuillToolbarComponent'
    );
    extract = this.formatExtract(
      this.getTextFromEditor(
        indexPreviousTag != -1 ? indexPreviousTag : 0,
        indexNextTag != -1
          ? indexNextTag
          : this.quill.getLength() > 150
          ? this.findFinishIndex(range)
          : this.quill.getLength()
      ),
      name,
      indexPreviousTag != -1 ? range - indexPreviousTag : range,
      tagType
    );
    this.log.debug(
      `extract :: ${extract}`,
      'getTagEntryString',
      'QuillToolbarComponent'
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

  private getTextFromEditor(startIndex: number, finishIndex: number): string {
    this.log.info('Starting', 'getTextFromEditor', 'QuillToolbarComponent');
    this.log.debug(
      `The passed in params are startIndex=${startIndex} and finishIndex=${finishIndex}`,
      'getTextFromEditor',
      'QuillToolbarComponent'
    );
    this.log.info('Finishing', 'getTextFromEditor', 'QuillToolbarComponent');
    return this.quill.getText(startIndex, finishIndex - startIndex);
  }

  private formatExtract(
    rawExtract: string,
    name: string,
    range: number,
    nameType: string
  ): string {
    this.log.info('Starting', 'formatExtract', 'QuillToolbarComponent');
    this.log.debug(
      `The passed in params are range :: ${range}`,
      'formatExtract',
      'QuillToolbarComponent'
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

  highlightTag(ids: number[], type: string, active: boolean) {
    this.log.info('Starting', 'highlightTag', 'QuillToolbarComponent');
    this.log.debug(`iterating array`, 'highlightTag', 'QuillToolbarComponent');

    for (let id of ids) {
      this.log.debug(
        `first button wit id ${id} and type ${type} and this will be an active=${active} highlight`,
        'highlightTag',
        'QuillToolbarComponent'
      );
      this.applyHighlight(id, type, active);
    }
    this.log.info('Finishing', 'highlightTag', 'QuillToolbarComponent');
  }

  private applyHighlight(id: number, type: string, active: boolean) {
    this.log.info('Starting', 'applyHighlight', 'QuillToolbarComponent');
    let button = this.elementRef.nativeElement.querySelectorAll('.' + type)[id];
    this.log.debug(
      `button found ${button}`,
      'applyHighlight',
      'QuillToolbarComponent'
    );
    if (active) {
      this.log.debug(`highlighting`, 'applyHighlight', 'QuillToolbarComponent');
      this.renderer.removeClass(button, 'reference');
      this.renderer.addClass(button, 'highlight');
      this.renderer.addClass(button, type + 'Glow');
    } else {
      this.log.debug(`reverting`, 'applyHighlight', 'QuillToolbarComponent');
      this.renderer.removeClass(button, 'highlight');
      this.renderer.removeClass(button, type + 'Glow');
      this.renderer.addClass(button, 'reference');
    }
    this.log.info('Finishing', 'applyHighlight', 'QuillToolbarComponent');
  }
}
