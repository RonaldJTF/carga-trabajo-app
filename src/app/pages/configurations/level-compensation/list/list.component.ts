import {Component, OnInit} from '@angular/core';
import {AuthenticationService, CompensationService, ConfirmationDialogService, CryptojsService} from "@services";
import {LevelCompensation} from "@models";
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";
import {finalize} from "rxjs";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  isAdmin: boolean = false;

  loading: boolean = false;

  idLevel: string;

  items: MenuItem[] = [];

  selectedLevelCompensation: LevelCompensation[] = [];

  levelCompensation: LevelCompensation[] = [];

  constructor(
    private authService: AuthenticationService,
    private compensationService: CompensationService,
    private cryptojsService: CryptojsService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.getInitialValue();
    this.initMenu();
  }

  initMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.edit(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getInitialValue() {
    this.route.queryParams.subscribe((params) => {
      this.idLevel = params['idLevel'];
      if (this.idLevel != null) {
        this.getLevelCompensations(this.idLevel);
      }
    });
  }

  getLevelCompensations(idLevel: string) {
    this.loading = true;
    this.compensationService.getLevelCompensations(idLevel).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.levelCompensation = res;
        console.log(this.levelCompensation)
      }
    })
  }

  deleteSelectedLevelCompensation() {
    let compensationIds: string[] = this.selectedLevelCompensation.map(item => this.cryptojsService.encryptParam(item.id));
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
            }
          });
      }
    )
  }

  desmarkAll() {
    this.selectedLevelCompensation = [];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idLevel: this.idLevel}
    }).then();
  }

  goBack() {
    this.router.navigate(['/configurations/levels'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(id: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      console.log("Eliminado...-> ", id);
    });
  }

  edit(id: number) {
    console.log("Editando...-> ", id);
  }

  parseStringToBoolean(str: string): boolean {
    return Methods.parseStringToBoolean(str);
  }
}
