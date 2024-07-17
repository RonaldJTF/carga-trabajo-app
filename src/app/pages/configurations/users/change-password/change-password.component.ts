import {Component, OnInit} from '@angular/core';
import {Person} from "../../../../models/person";
import {MenuItem} from "primeng/api";
import {ChangePasswordService} from "./menus/change-password.service";
import {UrlService} from "../../../../services/url.service";
import {AuthenticationService} from "../../../../services/auth.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  person: Person = new Person();

  creatingOrUpdating: boolean = false;

  updateMode: boolean = false;

  loader = false;

  routeItems: MenuItem[] = [];

  constructor(
    private changePasswordService: ChangePasswordService,
    private urlService: UrlService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.buildMenu();
    this.setInitialValues();
  }

  buildMenu() {
    this.routeItems = [
      {label: 'Actual contraseña', routerLink: 'current-password'},
      {label: 'Nueva contraseña', routerLink: 'new-password'}
    ];
  }

  setInitialValues() {
    this.person = this.authenticationService.getLoggedPersonInformation();
    this.changePasswordService.setPreviousUrl(this.urlService.getPreviousUrl());
    this.changePasswordService.setPerson(this.authenticationService.getLoggedPersonInformation());
    console.log(this.authenticationService.getLoggedPersonInformation());
    console.log(this.changePasswordService.getPreviousUrl());
  }

}
