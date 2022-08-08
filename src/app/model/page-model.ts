import { Item } from "./item-model";
import { Misc } from "./misc-model";
import { Person } from "./person-model";
import { Place } from "./place-model";

export interface Page{
  id:number,
  name: string,
  type: string,
  date: string,
  person: Person[],
  place: Place[],
  item: Item[],
  misc: Misc[]

}
