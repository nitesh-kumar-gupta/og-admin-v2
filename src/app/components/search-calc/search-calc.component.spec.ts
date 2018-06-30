import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCalcComponent } from './search-calc.component';

describe('SearchCalcComponent', () => {
  let component: SearchCalcComponent;
  let fixture: ComponentFixture<SearchCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
