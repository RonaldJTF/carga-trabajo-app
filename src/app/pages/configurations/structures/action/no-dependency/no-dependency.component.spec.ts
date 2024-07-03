import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDependencyComponent } from './no-dependency.component';

describe('NoDependencyComponent', () => {
  let component: NoDependencyComponent;
  let fixture: ComponentFixture<NoDependencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoDependencyComponent]
    });
    fixture = TestBed.createComponent(NoDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
