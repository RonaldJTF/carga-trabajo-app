import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureResumeComponent } from './structure-resume.component';

describe('HeardPageComponent', () => {
  let component: StructureResumeComponent;
  let fixture: ComponentFixture<StructureResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StructureResumeComponent]
    });
    fixture = TestBed.createComponent(StructureResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
