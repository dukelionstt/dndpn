import { Page } from "../model/page-model";
import { PERSONS } from "../mock-data/person-mock";

export const PAGE: Page = {
id: 1,
date: Date.now.toString(),
type: 'dnd',
name: 'Testing Notes page',
person: PERSONS

}
