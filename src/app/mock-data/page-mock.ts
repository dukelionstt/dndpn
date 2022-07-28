import { Page } from "../model/page-model";
import { PERSONS } from "../mock-data/person-mock";
import { PLACES } from "./place-mock";
import { ITEMS } from "./item-mock";
import { MISCS } from "./misc-mock";

export const PAGE: Page = {
id: 1,
date: Date.now.toString(),
type: 'dnd',
name: 'Testing Notes page',
person: PERSONS,
place: PLACES,
item: ITEMS,
misc: MISCS
}
