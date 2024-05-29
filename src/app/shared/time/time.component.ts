import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ]
})
export class TimeComponent  implements OnInit, OnDestroy, ControlValueAccessor{
  onChange = (value: number) => {};
  onTouched = () => {};

  registerOnChange(fn: (value: number) => void): void {this.onChange = fn}
  registerOnTouched(fn: () => void): void {this.onTouched = fn}

  writeValue(value: number): void {
    this.timeInMinutes = value;
    this.timeForm.get('minutes').setValue(this.timeInMinutes, { emitEvent: true });
  }

  timeInMinutes: number;
  timeForm: FormGroup;
  hasError = false;

  hourSubscription: Subscription;
  minuteSubscription: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.timeForm = this.formBuilder.group({
      minutes: [null, Validators.compose([Validators.required, Validators.min(0)])],
      hours: [null, Validators.compose([Validators.required, Validators.min(0)])]
    });

    this.minuteSubscription = this.timeForm.get('minutes').valueChanges.subscribe(value => {
      this.onChange(value);
      const convertedValue = this.convertToHours(value);
      this.timeForm.get('hours').setValue(convertedValue, { emitEvent: false });
      this.hasError = this.timeForm.controls['minutes'].errors && (this.timeForm.controls['minutes'].touched||this.timeForm.controls['minutes'].dirty)
    });

    this.hourSubscription = this.timeForm.get('hours').valueChanges.subscribe(value => {
      const convertedValue = this.convertToMinutes(value);
      this.onChange(convertedValue);
      this.timeForm.get('minutes').setValue(convertedValue, { emitEvent: false });
      this.hasError = this.timeForm.controls['hours'].errors && (this.timeForm.controls['hours'].touched||this.timeForm.controls['hours'].dirty)
    });
  }

  ngOnDestroy() {
    this.hourSubscription?.unsubscribe();
    this.minuteSubscription?.unsubscribe();
  }

  convertToHours(minutes: number): number | null{
    return minutes !==null ? parseFloat((minutes/60).toFixed(2)) : null;
  }

  convertToMinutes(hours: number): number | null{
    return hours !==null ? parseFloat((hours*60).toFixed(2)) : null;
  }

  markAllAsTouched() {
    this.timeForm.markAllAsTouched();
  }
}
