import {Component, OnInit} from '@angular/core';
import {MenuService} from "../../../layout/app.menu.service";
import {MegaMenuItem, TreeNode} from "primeng/api";
import {MESSAGE} from "../../../../labels/labels";
import {Router} from "@angular/router";

@Component({
  selector: 'app-basic-tables',
  templateUrl: './basic-tables.component.html',
  styleUrls: ['./basic-tables.component.scss']
})
export class BasicTablesComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  menuItems: MegaMenuItem[];

  constructor(
    public menuService: MenuService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.menuItems = [
      {label: 'Roles', icon: 'pi pi-users', routerLink: 'rol'},
      {label: 'Género', icon: 'pi pi-circle', routerLink: 'gender'}
    ]
  }

  onChangeDependency(event: any) {
    this.router.navigate([`developer/basic-tables/${event.node.routerLink}`], {
      skipLocationChange: true,
    }).then();
  }


}
