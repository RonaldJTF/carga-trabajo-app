import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelCompensationsComponent } from './level-compensations.component';

describe('LevelCompensationsComponent', () => {
  let component: LevelCompensationsComponent;
  let fixture: ComponentFixture<LevelCompensationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LevelCompensationsComponent]
    });
    fixture = TestBed.createComponent(LevelCompensationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
