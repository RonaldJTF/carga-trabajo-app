import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public countdown$: Observable<number>;

  @Input() countdownValue: number = 5;

  @Input() colorName: string = 'green';

  constructor() {}

  ngOnInit() {
    const countdownStartValue = this.countdownValue;

    this.countdown$ = interval(1000).pipe(
      map(value => countdownStartValue - value),
      take(countdownStartValue + 1)
    );

    this.subscription = this.countdown$.subscribe(value => {
      this.countdownValue = value;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
