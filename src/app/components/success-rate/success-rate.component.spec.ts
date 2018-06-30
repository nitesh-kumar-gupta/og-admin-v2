import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessRateComponent } from './success-rate.component';

describe('SuccessRateComponent', () => {
  let component: SuccessRateComponent;
  let fixture: ComponentFixture<SuccessRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
