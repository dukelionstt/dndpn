import { Place } from "../model/place-model";
import { METADATA } from "./meta-data-mock";

export const PLACES: Place[] = [
  {
    date: '',
    id: 0,
    name: 'local',
    notes: 'more jazz but it looks good',
    misc: ["local",
      "over there",
      "near here", "Place"],
    area: 'over there',
    location: 'near here',
    metaData: {
      range: 74,
      length: 5,
      buttonIndex: 0
    }
  },
  {
    date: '',
    id: 1,
    name: 'more Stuff',
    notes: 'more jazz but it looks good',
    misc: ["place",
      "more Stuff",
      "street",
      "home"
    ],
    area: 'street',
    location: 'home',
    metaData: {
      range: 110,
      length: 10,
      buttonIndex: 1
    }
  }
]
