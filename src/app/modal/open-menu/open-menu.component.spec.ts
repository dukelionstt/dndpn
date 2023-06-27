import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenMenuComponent } from './open-menu.component';

describe('OpenMenuComponent', () => {
  let component: OpenMenuComponent;
  let fixture: ComponentFixture<OpenMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
