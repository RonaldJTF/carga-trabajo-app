import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Directive({
  selector: '[appShowFormValue]'
})
export class ShowFormValueDirective implements OnInit{
  @Input('appShowFormValue') form: FormGroup;
  @Input() controlName: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.form.get(this.controlName).valueChanges.subscribe(value => {
      this.el.nativeElement.innerText = value;
    });
  }

}
