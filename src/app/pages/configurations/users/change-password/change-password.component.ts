import {Component, OnInit} from '@angular/core';
import {Person} from "../../../../models/person";
import {CryptojsService} from "../../../../services/cryptojs.service";
import {ActivatedRoute} from "@angular/router";
import {PersonService} from "../../../../services/person.service";
import {MenuItem} from "primeng/api";
import {ChangePasswordService} from "./menus/change-password.service";
import {UrlService} from "../../../../services/url.service";

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

  personId: number;

  routeItems: MenuItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private personService: PersonService,
    private changePasswordService: ChangePasswordService,
    private urlService: UrlService,
  ) {
  }

  ngOnInit() {
    this.buildMenu();
    this.getUrlParameter();
    this.changePasswordService.setPreviousUrl(this.urlService.getPreviousUrl());
  }

  getUrlParameter() {
    this.route.params.subscribe(params => {
      if (params['id'] != null) {
        this.personId = this.cryptoService.decryptParamAsNumber(params['id']);
        this.getUserPerson(this.personId);
      }
    });
  }

  buildMenu() {
    this.routeItems = [
      {label: 'Actual contraseña', routerLink: 'current-password'},
      {label: 'Nueva contraseña', routerLink: 'new-password'}
    ];
  }

  getUserPerson(personId: number) {
    this.personService.getPerson(personId).subscribe({
      next: (data) => {
        this.person = data;
        this.changePasswordService.setPerson(data);
      }
    });
  }


}
