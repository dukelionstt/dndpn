import { Injectable, Output, EventEmitter } from '@angular/core';
import { LoggerService } from '../logger.service';

const POST_FIX_ACTIVE = 'TagActive';
const POST_FIX = 'Tag';

@Injectable({
  providedIn: 'root',
})
export class HiglightEditorTagsService {
  active!: boolean;
  isNewButton!: boolean;
  previousIndex!: number;
  previousButton!: any;
  previousHighlightList!: Map<string, number[]>;
  previousSourceID!: number;
  previousSourceType!: string;
  previousState!: boolean;

  @Output() highLightTag: EventEmitter<any> = new EventEmitter();

  constructor(private log: LoggerService) {}

  sendHighlightTag(ids: number[], type: string, active: boolean, pageId: number) {
    this.highLightTag.emit({ ids: ids, type: type, active: active, pageId: pageId });
  }

  highlightProcess(
    element: any,
    highlightList: Map<string, number[]>,
    type: string,
    index: number
  ) {
    this.log.info(`highlight process :: Started`);
    this.log.debug(
      `highlight tag called, index:${index} & type:${type} passed. This is in tag list component`
    );

    // this.log.debug(type + index);
    // this.log.debug(event);
    // let buttonElementData = JSON.parse(
    //   this.highlightTagService.findButtonElement(
    //     event.path,
    //     this.previousButton,
    //     this.previousIndex,
    //     this.previousState
    //   )
    // );

    // this.log.info(buttonElementData);

    let pathIndex = this.findButtonElement(element.path);

    if (this.isNewButton) {
      this.log.info(`tag button toggle present, switching highlights`);
      this.previousState = !this.previousState;
      this.previousButton[this.previousIndex].classList = this.updateClassList(
        this.previousButton[this.previousIndex].classList,
        this.previousSourceType,
        this.previousState
      );
      this.log.debug('running the previousButton highlight flip');
      this.log.debug(
        `passing following to highlight: map - ${this.displayMap(
          this.previousHighlightList
        )} state - ${this.previousState}`
      );
      this.highlight(this.previousHighlightList, this.previousState);
      this.log.debug('completed the previousButton highlight flip');
      this.isNewButton = false;
      this.log.info(`tag button toggle present, highlights switched`);
    } else {
      this.active = !this.active;
    }

    element.path[pathIndex].classList = this.updateClassList(
      element.path[pathIndex].classList,
      type,
      this.active
    );
    this.highlight(highlightList, this.active);
    // this.highlightTagService.sendHighlightTag([index], type, this.active);
    this.log.info(`new tag button entries highlighted`);

    this.previousButton = element.path;
    this.previousIndex = pathIndex;
    this.previousHighlightList = highlightList;
    this.previousSourceID = index;
    this.previousSourceType = type;
    this.previousState = this.active;

    this.log.debug(
      `previous state catured as: this.previousHighlightList - ${this.displayMap(
        this.previousHighlightList
      )} this.previousIndex - ${this.previousIndex} this.previousSourceID - ${
        this.previousSourceID
      } this.previousSourceType - ${
        this.previousSourceType
      } this.previousState - ${this.previousState}`
    );

    this.log.info(`highlight process :: Finished`);
  }

  private findButtonElement(path: any) {
    this.isNewButton = false;
    this.log.info(`find button element :: Started`);
    let index = 0;
    for (let element of path) {
      if (element.nodeName == 'BUTTON') {
        if (this.previousButton) {
          this.log.debug(
            `The previous element: ${
              this.previousButton[this.previousIndex].id
            }`
          );
          this.log.debug(`new element to be checked: ${element.id}`);
          if (this.previousButton[this.previousIndex].id != element.id) {
            if (this.previousState) {
              this.log.debug(`changing the is new button to true`);
              this.isNewButton = true;
            }
          }
        }
        break;
      } else {
        index++;
      }
    }
    this.log.info(`find button element :: Finished`);
    return index;
  }

  updateClassList(classList: DOMTokenList, type: string, active: boolean) {
    this.log.info(`updateing tag button :: Started`);
    this.log.info(`updating ${type} tag button status to active: ${active}`);
    this.log.debug(`altering class list`);
    this.log.debug(classList);
    let index = 0;

    if (active) {
      try {
        classList.replace(type + POST_FIX, type + POST_FIX_ACTIVE);
        this.log.info(`${type} tag button active`);
        this.log.debug(`class list changed`);
        this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
        );
        this.log.error(error);
      }
    } else {
      try {
        classList.replace(type + POST_FIX_ACTIVE, type + POST_FIX);
        this.log.info(`${type} tag button de-active`);
        this.log.debug(`class list changed`);
        this.log.debug(classList);
      } catch (error) {
        this.log.error(
          `issue in changing activer class for tag button, please review below`
        );
        this.log.error(error);
      }
    }
    this.log.info(`updateing tag button :: Finished`);
    return classList;
  }

  highlight(list: Map<string, number[]>, state: boolean) {
    this.log.info('highlight running');
    this.log.debug(
      `passed in: list -> ${this.displayMap(list)}, state -> ${state}`
    );
    list.forEach((ids, type) => {
      this.log.debug(
        `about to toggle the following: ids -> ${ids.toString()} type -> ${type} state -> ${state}`
      );
      // this.sendHighlightTag(ids, type, state);
    });
  }
  private displayMap(map: Map<any, any>) {
    let mapString = '{ ';
    let currentkey = '';

    map.forEach((val, key) => {
      if (currentkey == '') {
        mapString += `${key}: {[${val}`;
      } else if (currentkey === key) {
        mapString += `,${val}`;
      } else {
        mapString += `]}, ${key}: {[${val}`;
      }
    });

    mapString += `]} }`;
    return mapString;
  }
}
