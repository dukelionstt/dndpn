import { Page } from '../model/page-model';
import { TAG_MAP } from './tag-map.mock';

import { PERSONS } from '../mock-data/person-mock';
import { PLACES } from './place-mock';
import { ITEMS } from './item-mock';
import { MISCS } from './misc-mock';
import { ITEM, MISC, PERSON, PLACE } from '../constants';
import { TAGS } from './TAGS';

export const PAGE: Page = {
  id: 1,
  date: Date.now.toString(),
  name: 'Testing Notes page',
  tags: TAGS, // references
  page: '%3Cp%3EThis%20is%20some%20%3Cbutton%20class=%22person%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png%22%3EDave%3Cdiv%20class=%22tooltip%22%3E%3Cp%3ENotes:%20testing%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3E%20content%20for%20future%20%3Cbutton%20class=%22person%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png%22%3ECat%3Cdiv%20class=%22tooltip%22%3E%3Cp%3ENotes:%20testing%20Cat%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3Eetc.%20Just%20going%20to%20ad%20a%20few%20%3Cbutton%20class=%22person%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png%22%3Ebits%3Cdiv%20class=%22tooltip%22%3E%3Cp%3ENotes:more%20to%20look%20at.%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3E%20%3Cbutton%20class=%22misc%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/952B60/magical-scroll.png%22%3Egeneric%3Cdiv%20class=%22tooltip%22%3E%3Cp%3ENotes:%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3E%20adding%20%3Cbutton%20class=%22place%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/F1B620/castle.png%22%3Elocal%3Cdiv%20class=%22tooltip%22%3E%3Cp%3ELocation:over%20there%3C/p%3E%3Cp%3EArea:near%20here%3C/p%3E%3Cp%3ENotes:more%20jazz%20but%20it%20looks%20good%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3Enext%20up%20was%20have%20the%20%3Cbutton%20class=%22item%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png%22%3Estuff%3Cdiv%20class=%22tooltip%22%3E%3Cp%3EType:Wondrous%3C/p%3E%3Cp%3ENotes:%3C/p%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/span%3E%EF%BB%BF%3C/button%3E%3C/p%3E%3Cp%3E%3Cbr%3E%3C/p%3E%3Cp%3Ehere%20we%20go%20%3Cbutton%20class=%22place%20bottom%20reference%22%3E%EF%BB%BF%3Cspan%20contenteditable=%22false%22%3E%3Cimg%20src=%22https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png%22%3Emore%20Stuff%3Cdiv%20class=%22tooltip%22%3E%3Ctable%20class=%22tooltipTable%22%3E%3Ctbody%3E%3Ctr%3E%3Ctd%3E%3Cstrong%3ELocation:%3C/strong%3E%3C/td%3E%3Ctd%3Ehome%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cstrong%3EArea:%3C/strong%3E%3C/td%3E%3Ctd%3Estreet%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cstrong%3ENotes:%3C/strong%3E%3C/td%3E%3Ctd%3Echeers%3C/td%3E%3C/tr%3E%3C/tbody%3E%3C/table%3E%3C/div%3E%3C/span%3E%EF%BB%BF%3C/button%3E%3C/p%3E',
  tagRanges: [
    13,34,63,65,74,96,110
  ],
  tagMap: TAG_MAP,
  isOpen: true,
  lastSaved: Date.toString(),
  saveUpToDate: true,
};
