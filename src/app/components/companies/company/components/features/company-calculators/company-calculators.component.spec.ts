import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCalculatorsComponent } from './company-calculators.component';

describe('CompanyCalculatorsComponent', () => {
  let component: CompanyCalculatorsComponent;
  let fixture: ComponentFixture<CompanyCalculatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCalculatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCalculatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
