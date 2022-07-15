import { TestBed } from '@angular/core/testing';

import { TagsDropdownService } from './tags-dropdown.service';

describe('TagsDropdownService', () => {
  let service: TagsDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsDropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
