import Quill from "quill"
import { PLACE } from "../constants";

let Embed = Quill.import("blots/embed");

export class PlaceBlot extends Embed {

  static create(value:string) {
    let node = super.create(value);

    node.setAttribute("class", PLACE + " bottom");
    node.innerHTML = value;

    return node;
  }

  static formats(domNode:any) {
    return domNode.getAttribute("class");
  }
}
