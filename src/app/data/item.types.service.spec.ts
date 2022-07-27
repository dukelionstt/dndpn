import { TestBed } from '@angular/core/testing';

import { Item.TypesService } from './item.types.service';

describe('Item.TypesService', () => {
  let service: Item.TypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Item.TypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
