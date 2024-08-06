import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Typology} from "../../../../models/typology";
import {MESSAGE} from "../../../../../labels/labels";
import {IMAGE_SIZE} from "../../../../utils/constants";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-typology-actions',
  templateUrl: './typology-action.component.html',
  styleUrls: ['./typology-action.component.scss']
})
export class TypologyActionComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  updateMode: boolean = false;

  typology: Typology = new Typology();

  loading: boolean = false;

  accionesLength: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public urlService: UrlService,
  ) {
  }

  ngOnInit() {
    this.getInitialValue();
  }

  getInitialValue() {
    this.typology.id = this.route.snapshot.queryParams['id'];
    this.typology.nombre = this.route.snapshot.queryParams['nombre'];
    this.typology.claseIcono = this.route.snapshot.queryParams['claseIcono'];
    this.typology.nombreColor = this.route.snapshot.queryParams['nombreColor'];
    this.typology.idTipologiaSiguiente = this.route.snapshot.queryParams['idTipologiaSiguiente'];
    this.accionesLength = this.route.snapshot.queryParams['accionesLength'];
    if (this.typology.id) {
      this.showList(this.typology);
    }
  }

  showList(data: Typology) {
    this.router.navigate(['./list'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idTypology: data.id}
    }).then();
  }

  goBack(): void {
    this.router.navigate(['/developer/basic-tables/typology'], {
      skipLocationChange: true
    }).then();
  }


}
