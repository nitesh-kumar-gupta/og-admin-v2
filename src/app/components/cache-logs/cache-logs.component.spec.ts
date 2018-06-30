import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheLogsComponent } from './cache-logs.component';

describe('CacheLogsComponent', () => {
  let component: CacheLogsComponent;
  let fixture: ComponentFixture<CacheLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
