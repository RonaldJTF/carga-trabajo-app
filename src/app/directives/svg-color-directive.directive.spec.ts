import {SvgColorDirective} from './svg-color-directive.directive';
import {ComponentFixture, TestBed} from "@angular/core/testing";

describe('SvgColorDirectiveDirective', () => {
  let directive: SvgColorDirective;
  let fixture: ComponentFixture<SvgColorDirective>

  beforeEach(()=>{
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SvgColorDirective);
    directive = fixture.componentInstance;
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
