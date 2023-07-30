import { Tag } from '../model/tag-model';

export const TAG_LIST: Tag[] = [
  {
    id: 1,
    name: 'person',
    type: 'reference',
    locations: [
      { pageId: 1, referenceId: 0 },
      { pageId: 1, referenceId: 1 },
      { pageId: 1, referenceId: 2 },
    ]
  },
  {
    id: 2,
    name: 'place',
    type: 'reference',
    locations: [
      { pageId: 1, referenceId: 0 },
      { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 3,
    name: 'item',
    type: 'reference',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 4,
    name: 'misc',
    type: 'reference',
    locations: [
      { pageId: 1, referenceId: 0 },
      { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 5,
    name: 'Dave',
    type: 'person',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 6,
    name: 'Cat',
    type: 'person',
    locations: [
            { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 7,
    name: 'bits',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 2 },
    ]
  },
  {
    id: 8,
    name: 'testing',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 2 },
    ]
  },
  {
    id: 9,
    name: 'not in page',
    type: 'tag',
    locations: [
      
    ]
  },
  {
    id: 10,
    name: 'local',
    type: 'place',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 11,
    name: 'over there',
    type: 'tag',
    locations: [
            { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 12,
    name: 'near here',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 13,
    name: 'more Stuff',
    type: 'place',
    locations: [
      { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 14,
    name: 'street',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 15,
    name: 'home',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 1 },
    ]
  },
  {
    id: 16,
    name: 'stuff',
    type: 'item',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 17,
    name: 'shite',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 18,
    name: 'Wonderous',
    type: 'tag',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
  {
    id: 19,
    name: 'generic',
    type: 'misc',
    locations: [
      { pageId: 1, referenceId: 0 },
    ]
  },
];
