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
  [PERSON, PERSONS],
  [PLACE, PLACES],
  [ITEM, ITEMS],
  [MISC, MISCS]
])
}
