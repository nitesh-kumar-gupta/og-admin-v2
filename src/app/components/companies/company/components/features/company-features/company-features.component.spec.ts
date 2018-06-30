import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFeaturesComponent } from './company-features.component';

describe('CompanyFeaturesComponent', () => {
  let component: CompanyFeaturesComponent;
  let fixture: ComponentFixture<CompanyFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
