import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonListViewComponent } from './common-list-view.component';

describe('CommonListViewComponent', () => {
  let component: CommonListViewComponent;
  let fixture: ComponentFixture<CommonListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
