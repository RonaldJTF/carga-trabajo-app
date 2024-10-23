import {Component, OnInit} from '@angular/core';
import {MESSAGE} from "@labels/labels";
import {IMAGE_SIZE} from "@utils";
import {Observable} from "rxjs";
import {Compensation, Workplan} from "@models";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, ConfirmationDialogService, CryptojsService} from "@services";
import * as WorkplanActions from "@store/workplan.actions";
import {CompensationService} from "../../../../services/compensation.service";
import {Table} from "primeng/table";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly MESSAGE = MESSAGE;

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  loading: boolean = false;

  isAdmin: boolean;

  selectedCompentations: Compensation[] = [];

  compensation: Compensation[] = [];

  compensation$: Observable<Compensation[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    private compensationService: CompensationService,
    private cryotojsService: CryptojsService,
  ) {
  }

  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
  }

  openNew() {
    this.router.navigate(['create'], {relativeTo: this.route, skipLocationChange: true}).then();
  }

  desmarkAll() {
    this.selectedCompentations = [];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteSelectedCompensations() {
    let compensationIds: string[] = this.selectedCompentations.map(item => this.cryotojsService.encryptParam(item.id));
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
          .subscribe({
            next: (e) => {
              //this.store.dispatch(WorkplanActions.removeItemsFromList({compensationIds: compensationIds}));
              this.desmarkAll();
            }
          });
      }
    )
  }
}
