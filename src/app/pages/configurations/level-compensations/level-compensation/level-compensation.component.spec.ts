import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCompensationComponent } from './level-compensation.component';

describe('LevelCompensationComponent', () => {
  let component: LevelCompensationComponent;
  let fixture: ComponentFixture<LevelCompensationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LevelCompensationComponent]
    });
    fixture = TestBed.createComponent(LevelCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
