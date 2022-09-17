import { Person } from "../model/person-model";
import { METADATA } from "./meta-data-mock";

export const PERSONS: Person[] = [
  {date: '',
    id: 0,
    name: 'Dave',
    notes: '',
    misc: [ "Dave", "Person"],
    metaData: {
      buttonIndex: 0,
      length: 4,
      range: 13
    }
  },
  {date: '',
    id: 1,
    name: 'Cat',
    notes: '',
    misc: ["Cat", "Person"],
    metaData: {
      buttonIndex: 1,
      length: 3,
      range: 34
    }
  },
  {date: '',
    id: 2,
    name: 'bits',
    notes: '',
    misc: ["bits", "Person", "testing"],
    metaData: {
      buttonIndex: 2,
      length: 4,
      range: 63
    }
  }
]
