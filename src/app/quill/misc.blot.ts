import Quill from 'quill';
import { MISC } from '../constants';

let Embed = Quill.import('blots/embed');

export class MiscBlot extends Embed {
  static create(value: string) {
    let node = super.create(value);

    node.setAttribute('class', MISC + ' bottom reference');
    node.innerHTML = value;

    return node;
  }

  static formats(domNode: any) {
    return domNode.getAttribute('class');
  }
}
