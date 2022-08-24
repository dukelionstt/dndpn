import { MetaData } from "./meta-data-model";

export interface Person {
  id: number,
  name:string,
  date: string,
  notes: string,
  misc: string[],
  metaData: MetaData
}

