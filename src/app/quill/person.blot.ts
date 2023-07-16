import Quill from 'quill';
import { PERSON } from '../constants';

let Embed = Quill.import('blots/embed');

export class PersonBlot extends Embed {
  static create(value: string) {
    let node = super.create(value);

    node.setAttribute('class', PERSON + ' bottom reference');
    node.innerHTML = value;

    return node;
  }

  static formats(domNode: any) {
    return domNode.getAttribute('class');
  }
}
