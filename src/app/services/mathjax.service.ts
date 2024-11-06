import { Injectable } from '@angular/core';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MathjaxService { 
  constructor() {
    if (window.MathJax) {
      window.MathJax = window.MathJax || {};
      window.MathJax.startup = {
        typeset: false,
        pageReady: () => {
          window.MathJax.typesetPromise();
        },
      };
    }
  }

  renderMath() {
    if (window.MathJax) {
      window.MathJax.typesetPromise()
        .then(() => console.log("MathJax renderizado"))
        .catch((err: any) => console.error("Error en MathJax", err));
    } else {
      console.warn("MathJax no está disponible en window");
    }
  }
}