import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPremadesComponent } from './company-premades.component';

describe('CompanyPremadesComponent', () => {
  let component: CompanyPremadesComponent;
  let fixture: ComponentFixture<CompanyPremadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPremadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPremadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
