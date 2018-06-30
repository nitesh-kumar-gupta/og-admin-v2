import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationLogDetailsComponent } from './integration-log-details.component';

describe('IntegrationLogDetailsComponent', () => {
  let component: IntegrationLogDetailsComponent;
  let fixture: ComponentFixture<IntegrationLogDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationLogDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
