import { TestBed } from '@angular/core/testing';

import { Widgets.ListService } from './widgets.list.service';

describe('Widgets.ListService', () => {
  let service: Widgets.ListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Widgets.ListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
