import { Component, Input, OnInit } from '@angular/core';
import { TagsService } from '../data/tags.service';
import { Page } from '../model/page-model';
import { Tag } from '../model/tag-model';
import { TagListComponent } from '../widgets/tag.list.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags!: Tag[];
  pageTagList!: Map<string, Tag[]>

  @Input()
  pages!: Page[];


  constructor(private tagService: TagsService) { }

  ngOnInit(): void {

    this.tags = this.tagService.getTags();
    this.pageTagList = buildPageTagList();
  }

  private buildPageTagList(){
    let temp = new Map<string, Tag[]>();

    temp.set("Notebook", this.tags);

    for(let page of this.pages){
      let tempList: Tag[] = [];
      if(page.tagReference){//remove once all page refences are fixed
        for(let id of page.tagReference){
          let tempTag = this.getTagById(id)
          if(tempTag){
            tempList.push(tempTag)
          }

        }
      }
      temp.set(page.name, tempList)
    }
  }

  private getTagById(id: number){
    for(let tag of this.tags){
      if(tag.id == id){
        return tag;
      }
    }
  }



}
