import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloBarComponent } from './hello-bar.component';

describe('HelloBarComponent', () => {
  let component: HelloBarComponent;
  let fixture: ComponentFixture<HelloBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
