import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '../model/page-model';

@Pipe({ name: 'openPageFilter' })
export class OpenPageFilter implements PipeTransform {
  transform(pages: Page[]) {
    return pages.filter((val) => !val.isOpen);
  }
}
