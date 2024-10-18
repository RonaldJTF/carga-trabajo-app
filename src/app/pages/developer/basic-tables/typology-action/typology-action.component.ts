import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Typology} from "@models";
import {MESSAGE} from "@labels/labels";
import {IMAGE_SIZE} from "@utils";
import {CryptojsService} from "@services";

@Component({
  selector: 'app-typology-actions',
  templateUrl: './typology-action.component.html',
  styleUrls: ['./typology-action.component.scss']
})
export class TypologyActionComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  typology: Typology = new Typology();

  updateMode: boolean = false;

  loading: boolean = false;

  accionesLength: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit() {
    this.getInitialValue();
  }

  getInitialValue() {
    this.typology.id = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['id']);
    this.typology.nombre = this.cryptoService.decryptParamAsString(this.route.snapshot.queryParams['nombre']);
    this.typology.claseIcono = this.cryptoService.decryptParamAsString(this.route.snapshot.queryParams['claseIcono']);
    this.typology.nombreColor = this.cryptoService.decryptParamAsString(this.route.snapshot.queryParams['nombreColor']);
    this.typology.idTipologiaSiguiente = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['idTipologiaSiguiente']);
    this.accionesLength = this.cryptoService.decryptParamAsNumber(this.route.snapshot.queryParams['accionesLength']);
    if (this.typology.id) {
      this.showList(this.typology.id);
    }
  }

  showList(idTypology: number) {
    this.router.navigate(['./list'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idTypology: this.cryptoService.encryptParam(idTypology)}
    }).then();
  }

  goBack(): void {
    this.router.navigate(['/developer/basic-tables/typology'], {
      skipLocationChange: true
    }).then(() => this.typology = null);
  }
}
