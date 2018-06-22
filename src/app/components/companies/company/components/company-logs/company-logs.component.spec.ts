import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLogsComponent } from './company-logs.component';

describe('CompanyLogsComponent', () => {
  let component: CompanyLogsComponent;
  let fixture: ComponentFixture<CompanyLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
