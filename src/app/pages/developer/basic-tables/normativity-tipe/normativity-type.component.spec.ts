import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NormativityTypeComponent } from './normativity-type.component';


describe('NormativityTypeComponent', () => {
  let component: NormativityTypeComponent;
  let fixture: ComponentFixture<NormativityTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormativityTypeComponent]
    });
    fixture = TestBed.createComponent(NormativityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
