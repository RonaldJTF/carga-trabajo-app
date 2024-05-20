import {Component} from '@angular/core';
import {Table} from 'primeng/table';
import {Person} from 'src/app/models/person';
import {MenuItem, MessageService} from 'primeng/api';
import {PersonService} from 'src/app/services/person.service';
import {Router} from '@angular/router';
import {IMAGE_SIZE} from 'src/app/utils/constants';
import {MESSAGE} from 'src/labels/labels';
import {ConfirmationDialogService} from 'src/app/services/confirmation-dialog.service';
import * as StructureActions from "../../../../store/structure.actions";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  IMAGE_SIZE = IMAGE_SIZE;

  MESSAGE = MESSAGE;

  loading: boolean = false;

  layout: string = 'list';

  deletePeopleDialog: boolean = false;

  people: Person[] = [];

  person: Person = new Person();

  selectedPeople: Person[] = [];

  cols: any[] = [];

  items: MenuItem[] = [];

  constructor(
    private personService: PersonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.intMenu();
    this.getPeople();
  }

  intMenu() {
    this.items = [
      {
        label: 'Gestionar acceso',
        icon: 'pi pi-key',
        command: (e) => this.onUserPerson(e),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: (e) => this.editPerson(parseInt(e.item.id)),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: (e) => this.onDelete(parseInt(e.item.id)),
      },
    ];
  }

  getPeople() {
    this.loading = true;
    this.personService.getPeople().subscribe({
      next: (data) => {
        this.people = data;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  openNew() {
    this.router.navigate(['configurations/users/person/'], {
      skipLocationChange: true,
    });
  }

  editPerson(idPerson: number) {
    this.router.navigate(['configurations/users/person/', idPerson], {
      skipLocationChange: true,
    });
  }

  deleteSelectedPeople() {
    let peopleIds: number[] = this.selectedPeople.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.personService.deleteSelectedPeople(peopleIds)
          .subscribe({
            next: (e) => {
              this.desmarkAll();
              for (let idPerson of peopleIds) {
                this.filterPeple(idPerson);
              }
            }
          });
      }
    )
  }

  onDelete(idPerson: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.personService.delete(idPerson).subscribe((response) => {
        this.filterPeple(idPerson);
      });
    });
  }

  filterPeple(idPerson: number) {
    this.people = this.people.filter((item) => item.id != idPerson);
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.people.length; i++) {
      if (this.people[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUserPerson(event: any) {
    this.router.navigate(['configurations/users/user/', event.item.id], {
      skipLocationChange: true,
    });
  }

  desmarkAll() {
    this.selectedPeople = [];
  }

}
