import {Component, OnInit} from '@angular/core';
import {Functionality} from "@models";
import {MenuService} from "@services";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-level-compensation',
  templateUrl: './level-compensation.component.html',
  styleUrls: ['./level-compensation.component.scss']
})
export class LevelCompensationComponent implements OnInit {

  functionality: Functionality = {
    label: 'Compensación laboral',
    icon: 'pi pi-money-bill',
    color: 'primary',
    description: 'Gestión de las compensaciones laborales'
  };

  constructor(
    public menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.menuService.onFunctionalityChange(this.functionality);
    let idLevel = this.route.snapshot.queryParams['idLevel'];
    if (idLevel) {
      this.router.navigate(["/configurations/level-compensation"], {
        skipLocationChange: false,
        queryParams: {idLevel: idLevel}
      }).then()
    }
  }
}
