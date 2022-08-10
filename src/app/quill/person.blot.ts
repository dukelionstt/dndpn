import Quill from "quill"

let Embed = Quill.import("blots/embed");
const PERSON : string = 'person';

export class PersonBlot extends Embed {

  static create(value:string) {
    let node = super.create(value);

    node.setAttribute("class", "person");
    node.innerHTML = value;

    return node;
  }

  static formats(domNode:any) {
    return domNode.getAttribute("class");
  }
}
