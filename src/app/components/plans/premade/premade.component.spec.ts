import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremadeComponent } from './premade.component';

describe('PremadeComponent', () => {
  let component: PremadeComponent;
  let fixture: ComponentFixture<PremadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
