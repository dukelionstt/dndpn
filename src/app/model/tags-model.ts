import { Item } from "./item-model";
import { Misc } from "./misc-model";
import { Person } from "./person-model";
import { Place } from "./place-model";

export interface Tags{
  person?: Person[],
  place?: Place[],
  item?: Item[],
  misc?: Misc[]
}
