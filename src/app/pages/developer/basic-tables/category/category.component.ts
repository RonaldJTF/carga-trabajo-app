import {Component, OnInit} from '@angular/core';
import {BasicTablesService, ConfirmationDialogService, CryptojsService} from "@services";
import {IMAGE_SIZE} from "@utils";
import {finalize} from "rxjs";
import {MESSAGE} from "@labels/labels";
import {Table} from "primeng/table";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  tipoCategorias: Category[] = [];

  loading: boolean = false;

  selectedCategories: Category[] = [];

  items: MenuItem[] = [];

  constructor(
    private basicTableService: BasicTablesService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.getCategories();
    this.intMenu();
  }

  intMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editCategory(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getCategories() {
    this.loading = true;
    this.basicTableService.getCategories().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.tipoCategorias = res;
      }
    })
  }

  deleteSelectedCategory() {
    let categoryIds: number[] = this.selectedCategories.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.basicTableService.deleteSelectedCategory(categoryIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
              for (let id of categoryIds) {
                this.filterCategory(id);
              }
            }
          });
      }
    )
  }

  editCategory(idCategory: number) {
    this.router.navigate(['developer/basic-tables/create-category', this.cryptoService.encryptParam(idCategory)], {
      skipLocationChange: true,
    }).then();
  }

  filterCategory(idCategory: number) {
    this.tipoCategorias = this.tipoCategorias.filter((item) => item.id != idCategory);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  desmarkAll() {
    this.selectedCategories = [];
  }

  openNew() {
    this.router.navigate(['developer/basic-tables/create-category'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(idCategory: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.basicTableService.deleteCategory(idCategory).subscribe(() => {
        this.filterCategory(idCategory);
        this.desmarkAll();
      });
    });
  }

}
