import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageFallback]'
})
export class ImageFallbackDirective {

  @Input() appImageFallback: string; 

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('error') onError() {
    const fallbackUrl = this.appImageFallback || 'assets/layout/images/image-fallback.png'; 
    this.renderer.setAttribute(this.el.nativeElement, 'src', fallbackUrl);
  }
}
