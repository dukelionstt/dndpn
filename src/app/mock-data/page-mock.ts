import { Page } from "../model/page-model";
import { PERSONS } from "../mock-data/person-mock";
import { PLACES } from "./place-mock";
import { ITEMS } from "./item-mock";
import { MISCS } from "./misc-mock";
import { ITEM, MISC, PERSON, PLACE } from "../constants";

export const PAGE: Page = {
id: 1,
date: Date.now.toString(),
type: 'dnd',
name: 'Testing Notes page',
tags: new Map<string, any>([
  [PERSON, PERSONS]
  // [PLACE, PLACES],
  // [ITEM, ITEMS],
  // [MISC, MISCS]
]),
page: '<p>This is some <button class="person bottom"><img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png">Dave<div class="tooltip"><p>Notes: testing</p></div></button> content for future <button class="person bottom"><img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png">Cat<div class="tooltip"><p>Notes: testing Cat</p></div></button>etc.</p>'
// page: '<p>This is some <button class="person"><span contenteditable="false"><img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png">Dave<div class="tooltip"><p>Notes: testing</p></div></span></button> content for future <button class="person"><span contenteditable="false"><img src="https://img.icons8.com/ios-glyphs/15/008080/human-head.png">Cat<div class="tooltip"><p>Notes: testing Cat</p></div></span></button>etc.</p>'
// { "ops": [
//   { "insert": "This is some " },
//   {
//       "attributes": { "0": "p", "1": "e", "2": "r", "3": "s", "4": "o", "5": "n" },
//       "insert": { "person": 'Dave' }
//   },
//   { "insert": " content for future " },{"attributes": { "0": "p", "1": "e", "2": "r", "3": "s", "4": "o", "5": "n" },"insert": { "person": 'Cat' }
//   },{ "insert": "etc.\n" } ] }
}
