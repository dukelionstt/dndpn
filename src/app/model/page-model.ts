import { Person } from "./person-model";

export interface Page{
  id:number,
  name: string,
  type: string,
  date: Date,
  person: Person[]

}
