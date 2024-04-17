import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToIfNotFoundComponent } from './go-to-if-not-found.component';

describe('GoToIfNotFoundComponent', () => {
  let component: GoToIfNotFoundComponent;
  let fixture: ComponentFixture<GoToIfNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoToIfNotFoundComponent]
    });
    fixture = TestBed.createComponent(GoToIfNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
