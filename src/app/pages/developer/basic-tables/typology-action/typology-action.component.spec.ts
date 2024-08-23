import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypologyActionComponent } from './typology-action.component';

describe('TypologyActionComponent', () => {
  let component: TypologyActionComponent;
  let fixture: ComponentFixture<TypologyActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypologyActionComponent]
    });
    fixture = TestBed.createComponent(TypologyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
