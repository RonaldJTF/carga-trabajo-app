import {Component, OnInit} from '@angular/core';
import {Table} from 'primeng/table';
import {Person} from 'src/app/models/person';
import {MenuItem} from 'primeng/api';
import {PersonService} from 'src/app/services/person.service';
import {Router} from '@angular/router';
import {IMAGE_SIZE} from 'src/app/utils/constants';
import {MESSAGE} from 'src/labels/labels';
import {ConfirmationDialogService} from 'src/app/services/confirmation-dialog.service';
import {CryptojsService} from "../../../../services/cryptojs.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit{
  IMAGE_SIZE = IMAGE_SIZE;

  MESSAGE = MESSAGE;

  loading: boolean = false;

  layout: string = 'list';

  people: Person[] = [];

  person: Person = new Person();

  selectedPeople: Person[] = [];

  items: MenuItem[] = [];

  constructor(
    private personService: PersonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private cryptoService: CryptojsService
  ) {
  }

  ngOnInit() {
    this.intMenu();
    this.getPeople();
  }

  intMenu() {
    this.items = [
      {label: 'Gestionar acceso', icon: 'pi pi-key', command: (e) => this.onUserPerson(e)},
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editPerson(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
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
    }).then();
  }

  editPerson(idPerson: number) {
    this.router.navigate(['configurations/users/person/', this.cryptoService.encryptParam(idPerson)],  {
      skipLocationChange: true,
    }).then();
  }

  deleteSelectedPeople() {
    let peopleIds: number[] = this.selectedPeople.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.personService.deleteSelectedPeople(peopleIds)
          .subscribe({
            next: () => {
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
      this.personService.delete(idPerson).subscribe(() => {
        this.filterPeple(idPerson);
      });
    });
  }

  filterPeple(idPerson: number) {
    this.people = this.people.filter((item) => item.id != idPerson);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUserPerson(event: any) {
    this.router.navigate(['configurations/users/user/', this.cryptoService.encryptParam(event.item.id)], {
      skipLocationChange: true,
    }).then();
  }

  desmarkAll() {
    this.selectedPeople = [];
  }

}
