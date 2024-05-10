import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeardPageComponent } from './heard-page.component';

describe('HeardPageComponent', () => {
  let component: HeardPageComponent;
  let fixture: ComponentFixture<HeardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeardPageComponent]
    });
    fixture = TestBed.createComponent(HeardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
