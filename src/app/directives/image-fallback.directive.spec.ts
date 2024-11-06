import { ImageFallbackDirective } from './image-fallback.directive';
import {ComponentFixture, TestBed} from "@angular/core/testing";

describe('ImageFallbackDirective', () => {
  let directive: ImageFallbackDirective;
  let fixture: ComponentFixture<ImageFallbackDirective>

  beforeEach(()=>{
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ImageFallbackDirective);
    directive = fixture.componentInstance;
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
