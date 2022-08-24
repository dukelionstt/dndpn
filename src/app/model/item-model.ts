import { MetaData } from "./meta-data-model";

export interface Item {
  id: number,
  name:string,
  type: string[],
  date: string,
  notes: string,
  misc: string[],
  metaData: MetaData
}

