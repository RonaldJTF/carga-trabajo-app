import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: '[appSvgColor]'
})
export class SvgColorDirective implements OnInit {
  @Input() appSvgColor: string;
  @Input() svgPath: string;
  @Input() svgElementSelector: string;
  @Input() svgWidth: string = '250px';

  constructor(private el: ElementRef, private http: HttpClient) {}

  ngOnInit() {
    this.loadSvg();
  }

  private loadSvg() {
    this.http.get(this.svgPath, { responseType: 'text' }).subscribe(svg => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svg, 'image/svg+xml').documentElement;

      if (this.svgElementSelector) {
        const targetElements = svgDoc.querySelectorAll(this.svgElementSelector);
        if (targetElements) {
          for (let i = 0; i < targetElements.length; i++) {
            targetElements[i].setAttribute('fill', this.appSvgColor);
          }
        }
      } else {
        // Si no hay selector, cambiar todos los paths
        svgDoc.querySelectorAll('path').forEach(path => {
          path.setAttribute('fill', this.appSvgColor);
        });
      }

      svgDoc.setAttribute('width', this.svgWidth);
      svgDoc.setAttribute('height', 'auto');

      this.el.nativeElement.innerHTML = '';
      this.el.nativeElement.appendChild(svgDoc);
    });
  }


}
