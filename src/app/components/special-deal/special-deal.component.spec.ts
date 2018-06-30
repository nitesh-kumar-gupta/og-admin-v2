import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialDealComponent } from './special-deal.component';

describe('SpecialDealComponent', () => {
  let component: SpecialDealComponent;
  let fixture: ComponentFixture<SpecialDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
