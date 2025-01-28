import {Component, OnInit} from '@angular/core';
import {JobTitle} from "@models";
import {MenuItem} from "primeng/api";
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {Router} from "@angular/router";
import {IMAGE_SIZE} from "@utils";
import {MESSAGE} from "@labels/labels";
import {finalize} from "rxjs";
import {Table} from "primeng/table";

@Component({
  selector: 'app-jobtitle',
  templateUrl: './jobtitle.component.html',
  styleUrls: ['./jobtitle.component.scss']
})
export class JobTitleComponent implements OnInit {
  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  jobTitles: JobTitle[] = [];

  loading: boolean = false;

  selectedJobTitle: JobTitle[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getJobTitle();
    this.initMenu();
  }

  initMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editJobTitle(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getJobTitle() {
    this.loading = true;
    this.basicTableService.getJobTitles().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.jobTitles = res;
      }
    })
  }

  deleteSelectedJobTitle() {
    let jobTitleIds: number[] = this.selectedJobTitle.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedJobTitles(jobTitleIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of jobTitleIds) {
                this.filterJobTitle(id);
              }
            }
          });
      }
    )
  }

  editJobTitle(idJobTitle: number) {
    this.router.navigate(['developer/basic-tables/create-job-title', this.cryptoService.encryptParam(idJobTitle)], {
      skipLocationChange: true,
    }).then();
  }

  filterJobTitle(idJobTitle: number) {
    this.jobTitles = this.jobTitles.filter((item) => item.id != idJobTitle);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedJobTitle = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-job-title'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(jobTitleId: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteJobTitle(jobTitleId).subscribe(() => {
        this.filterJobTitle(jobTitleId);
        this.desmarkAll();
      });
    });
  }

}
