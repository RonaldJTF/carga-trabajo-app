import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Person} from "@models";
import {AuthenticationService, ChangePasswordService, UrlService} from "@services";

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
      {label: 'Contraseña actual', routerLink: 'current-password'},
      {label: 'Nueva contraseña', routerLink: 'new-password'}
    ];
  }

  setInitialValues() {
    this.person = this.authenticationService.getLoggedPersonInformation();
    this.changePasswordService.setPreviousUrl(this.urlService.getPreviousUrl());
    this.changePasswordService.setPerson(this.authenticationService.getLoggedPersonInformation());
  }

}
