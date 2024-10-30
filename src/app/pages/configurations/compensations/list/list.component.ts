import {Component, OnDestroy, OnInit} from '@angular/core';
import {MESSAGE} from "@labels/labels";
import {IMAGE_SIZE} from "@utils";
import {Subscription} from "rxjs";
import {Compensation} from "@models";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, CompensationService, ConfirmationDialogService, CryptojsService} from "@services";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../app.reducers";

import * as CompensationActions from "@store/compensation.actions";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  protected readonly MESSAGE = MESSAGE;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  loading: boolean = false;

  isAdmin: boolean;

  compensation: Compensation;

  compensations: Compensation[] = [];

  compensationsSubscription: Subscription;

  compensationSubscription: Subscription;

  selectedCompentations: Compensation[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    private compensationService: CompensationService,
    private cryptojsService: CryptojsService,
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.compensationsSubscription = this.store.select(state => state.compensation.items).subscribe(e => {
      this.compensations = e;
      this.compensations?.forEach(e => {
        e['menuItems'] = this.getMenuItemsOfCompensation(e);
      })
    });
    this.compensationSubscription = this.store.select(state => state.compensation.item).subscribe(e => this.compensation = e);
    this.getCompensations();
  }

  desmarkAll() {
    this.selectedCompentations = [];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getCompensations() {
    this.compensationService.getCompesations().subscribe({
      next: (res) => {
        this.store.dispatch(CompensationActions.setList({compensations: this.cryptojsService.decryptList<Compensation>(res)}));
      }
    })
  }

  deleteSelectedCompensations() {
    let compensationIds: string[] = this.selectedCompentations.map(item => this.cryptojsService.encryptParam(item.id));
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
          .subscribe({
            next: () => {
              this.store.dispatch(CompensationActions.removeItemsFromList({compensationIds: this.selectedCompentations.map(item => item.id)}));
              this.desmarkAll();
            }
          });
      }
    )
  }

  onManagementCompensations(idCompensation: number, event: Event) {
    this.router.navigate(['create'], {
      queryParams: {idCompensation: this.cryptojsService.encryptParam(idCompensation)},
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  onDeleteCompensation(event: any) {
    let id = this.cryptojsService.encryptParam(event.item.id);
    event.originalEvent.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteCompensation(id)
          .subscribe({
            next: () => {
              this.store.dispatch(CompensationActions.removeFromList({id: event.item.id}));
              this.desmarkAll();
            },
          });
      }
    )
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true
    }).then();
  }

  private getMenuItemsOfCompensation(compensation: Compensation): MenuItem [] {
    if (!compensation) {
      return [];
    }
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        visible: this.isAdmin,
        command: (e) => this.onManagementCompensations(parseInt(e.item.id), e.originalEvent)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        visible: this.isAdmin,
        command: (e) => this.onDeleteCompensation(e)
      },

    ];
  }

  ngOnDestroy(): void {
    this.compensationsSubscription?.unsubscribe();
  }
}
