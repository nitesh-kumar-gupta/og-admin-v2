import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoGoalsComponent } from './promo-goals.component';

describe('PromoGoalsComponent', () => {
  let component: PromoGoalsComponent;
  let fixture: ComponentFixture<PromoGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
