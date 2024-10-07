import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SanitizeHtmlPipe } from "./sanitize-html.pipe";


describe('SanitizeHtmlPipe', () => {
  let component: SanitizeHtmlPipe;
  let fixture: ComponentFixture<SanitizeHtmlPipe>;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SanitizeHtmlPipe]
    });
    fixture = TestBed.createComponent(SanitizeHtmlPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});