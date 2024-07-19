import { Injectable } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { buffer, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeySequenceService {
  private requiredSequence: string[] = ['Shift', 'Alt', 'Control', 'a'];

  constructor() {
    //this.initKeyLogging();
  }

  private initKeyLogging() {
    const keydown$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
      map(event => event.key)
    );

    const keyup$ = fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      map(event => event.key)
    );

    merge(keydown$, keyup$).subscribe(key => {
      console.log(`${new Date().toISOString()} - Key Event: ${key}`);
    });
  }

  // Observable para la combinación de teclas
  keySequence$ = merge(
    fromEvent<KeyboardEvent>(window, 'keydown'),
    fromEvent<KeyboardEvent>(window, 'keyup')
  ).pipe(
    map(event => event.key.toLowerCase()), // Convertir la tecla a minúscula
    buffer(fromEvent<KeyboardEvent>(window, 'keyup').pipe(
      filter(event => event.key.toLowerCase() === this.requiredSequence[this.requiredSequence.length - 1])
    )),
    filter(keys => {
      const pressedKeys = keys.map(key => key.toLowerCase());
      return pressedKeys.includes('shift') && pressedKeys.includes('alt') && pressedKeys.includes('control') && pressedKeys.includes('a');
    })
  );
}
