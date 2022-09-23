import { Component, Input, OnInit } from '@angular/core';
import { TagsService } from '../data/tags.service';
import { LoggerService } from '../logger.service';
import { Page } from '../model/page-model';
import { Tag } from '../model/tag-model';
import { IconService } from '../service/icon.service';
import { TagListComponent } from '../widgets/tag.list.component';

@Component({
  selector: 'tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags!: Tag[];
  pageTagList!: Map<string, Tag[]>

  @Input()
  pages!: Page[];


  constructor(private tagService: TagsService,
              private icons: IconService,
              private log: LoggerService) { }

  ngOnInit(): void {

    this.tags = this.tagService.getTags();
    this.pageTagList = this.buildPageTagList();
  }

  private buildPageTagList(){
    this.log.info(`building tags dictionary :: Starting`)
    let temp = new Map<string, Tag[]>();

    temp.set("Notebook", this.tags);

    for(let page of this.pages){
      this.log.debug(page)
      let tempList: Tag[] = [];
      if(page.tagReference){//remove once all page refences are fixed
        this.log.debug(`using the following ids for to search tags`)
        this.log.debug(page.tagReference)
        for(let id of page.tagReference){
          this.log.debug(`searching with id ${id}`)
          let tempTag = this.getTagById(id)
          this.log.debug(`Following entry created`)
          this.log.debug(tempTag)
          if(tempTag){
            tempList.push(tempTag)
          }

        }
      }
      temp.set(page.name, tempList)
    }
    this.log.debug(`following object will be retured`)
    this.log.debug(temp)
    this.log.info(`building tags dictionary :: finishing`)
    return temp
  }

  private getTagById(id: number){
    for(let tag of this.tags){
      if(tag.id == id){
        return tag;
      }
    }
    return null;
  }



}
