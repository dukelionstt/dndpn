import Quill from 'quill';
import { ITEM } from '../constants';

let Embed = Quill.import('blots/embed');

export class ItemBlot extends Embed {
  static create(value: string) {
    let node = super.create(value);

    node.setAttribute('class', ITEM + ' bottom reference');
    node.innerHTML = value;

    return node;
  }

  static formats(domNode: any) {
    return domNode.getAttribute('class');
  }
}
