import {Injectable} from '@angular/core';
import {Person, User} from "@models";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private personSubject: BehaviorSubject<Person> = new BehaviorSubject<Person>(null);

  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  private previousUrl: string;

  getPerson(): Observable<Person> {
    return this.personSubject.asObservable();
  }

  setPerson(person: Person) {
    this.personSubject.next(person);
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl = previousUrl;
  }

  getPreviousUrl(){
    return this.previousUrl;
  }

  clear(): void {
    this.personSubject.next(null);
    this.userSubject.next(null);
  }
}
