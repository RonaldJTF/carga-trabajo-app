import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidityComponent } from './validity.component';

describe('ValidityComponent', () => {
  let component: ValidityComponent;
  let fixture: ComponentFixture<ValidityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidityComponent]
    });
    fixture = TestBed.createComponent(ValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
