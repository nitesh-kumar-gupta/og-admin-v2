import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutologinTokenComponent } from './autologin-token.component';

describe('AutologinTokenComponent', () => {
  let component: AutologinTokenComponent;
  let fixture: ComponentFixture<AutologinTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutologinTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutologinTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
