import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHelloBarComponent } from './edit-hello-bar.component';

describe('EditHelloBarComponent', () => {
  let component: EditHelloBarComponent;
  let fixture: ComponentFixture<EditHelloBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHelloBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHelloBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
