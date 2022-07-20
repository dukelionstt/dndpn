import { TestBed } from '@angular/core/testing';

import { NotebookService } from './notebook.service';

describe('NotebooService', () => {
  let service: NotebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
