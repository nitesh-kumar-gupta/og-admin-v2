import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionChecklistComponent } from './promotion-checklist.component';

describe('PromotionChecklistComponent', () => {
  let component: PromotionChecklistComponent;
  let fixture: ComponentFixture<PromotionChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
