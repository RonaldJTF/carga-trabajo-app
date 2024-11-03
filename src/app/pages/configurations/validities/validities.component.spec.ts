import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiditiesComponent } from './validities.component';

describe('ValiditiesComponent', () => {
  let component: ValiditiesComponent;
  let fixture: ComponentFixture<ValiditiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValiditiesComponent]
    });
    fixture = TestBed.createComponent(ValiditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
