import Quill from "quill"

let Embed = Quill.import("blots/embed");
const PERSON : string = 'person';

export class PersonBlot extends Embed {
    
  static create(value:string) {
    let node = super.create(value);
    let popupContent = "Click to view data and edit";

    let values = value.split('|');

    let outerHtml = '<button class="'+ PERSON + '" (click)="tempAction()" ></button>'
    // node.setAttribute("class", "ui small teal basic label");
    node.setAttribute("class", "person");
    // node.setAttribute("onclick", "tempAction()");
    // node.setAttribute("data-tooltip", popupContent);
    // node.setAttribute("data-position", "bottom left");
    node.setAttribute("id", values[1]);
    node.innerHTML = values[0];

    return node;
  }

  static formats(domNode:any) {
    return domNode.getAttribute("class");
  }
}