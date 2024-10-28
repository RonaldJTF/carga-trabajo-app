import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativitiesComponent } from './normativities.component';

describe('NormativitiesComponent', () => {
  let component: NormativitiesComponent;
  let fixture: ComponentFixture<NormativitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormativitiesComponent]
    });
    fixture = TestBed.createComponent(NormativitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
