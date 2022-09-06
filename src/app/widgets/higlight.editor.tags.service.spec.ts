import { TestBed } from '@angular/core/testing';

import { Higlight.Editor.TagsService } from './higlight.editor.tags.service';

describe('Higlight.Editor.TagsService', () => {
  let service: Higlight.Editor.TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Higlight.Editor.TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
