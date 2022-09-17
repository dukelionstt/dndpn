import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() { }

  getIcon(icon: string, colour?:string){
    let img: string = '';
    if(colour){
      switch(icon){
        case 'person':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/' + colour + '/human-head.png"/>"';
        break;
        case 'place':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/' + colour + '/castle.png"/>"';
        break;
        case 'item':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/' + colour + '/armored-breastplate.png"/>"';
        break;
        case 'misc':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/' + colour + '/magical-scroll.png"/>"';
        break;
      }
    } else {
      switch(icon){
        case 'person':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png"/>"'
        break;
        case 'place':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png"/>';
        break;
        case 'item':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png"/>';
        break;
        case 'misc':
            img = '<img src="https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png"/>';
        break;
      }
    }

    return img;
    
  }

  getSrc(icon: string, colour?:string){
    let src: string = '';
    if(colour){
      switch(icon){
        case 'person':
            src = 'https://img.icons8.com/ios-glyphs/15/' + colour + '/human-head.png';
        break;
        case 'place':
            src = 'https://img.icons8.com/ios-glyphs/15/' + colour + '/castle.png';
        break;
        case 'item':
            src = 'https://img.icons8.com/ios-glyphs/15/' + colour + '/armored-breastplate.png';
        break;
        case 'misc':
            src = 'https://img.icons8.com/ios-glyphs/15/' + colour + '/magical-scroll.png';
        break;
      }
    } else {
      switch(icon){
        case 'person':
            src = 'https://img.icons8.com/ios-glyphs/15/3D91E0/human-head.png'
        break;
        case 'place':
            src = 'https://img.icons8.com/ios-glyphs/15/FE9A76/castle.png';
        break;
        case 'item':
            src = 'https://img.icons8.com/ios-glyphs/15/016936/armored-breastplate.png';
        break;
        case 'misc':
            src = 'https://img.icons8.com/ios-glyphs/15/B413EC/magical-scroll.png';
        break;
      }
    }

    return src;
    
  }
}
