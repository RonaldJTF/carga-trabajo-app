import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { Person } from 'src/app/models/person';
import { MenuItem, MessageService } from 'primeng/api';
import { PersonService } from 'src/app/services/person.service';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../../../services/confirmation-dialog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  layout: string = 'list';

  personDialog: boolean = false;

  deletePersonDialog: boolean = false;

  deletePeopleDialog: boolean = false;

  people: Person[] = [];

  person: Person = new Person();

  selectedPeople: Person[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  cardMenu: MenuItem[] = [];

  items: MenuItem[] = [];

  constructor(
    private messageService: MessageService,
    private personService: PersonService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Asignar credenciales',
        icon: 'pi pi-key',
        command: (e) => this.onUserPerson(e),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: (e) => this.editPerson(e),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: (e) => this.onDelete(e.item.id),
      },
    ];
    this.cols = [
      { field: 'person', header: 'Person' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
      { field: 'rating', header: 'Reviews' },
      { field: 'inventoryStatus', header: 'Status' },
    ];

    this.getPeople();
  }

  getPeople() {
    this.personService.getPeople().subscribe({
      next: (data) => {
        this.people = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openNew() {
    this.router.navigate(['configurations/users/person/'], {
      skipLocationChange: true,
    });
  }

  
  editPerson(event: any) {
    this.router.navigate(['configurations/users/person/', event.item.id], {
      skipLocationChange: true,
    });
  }
  
  deleteSelectedPeople() {
    this.deletePeopleDialog = true;
  }

  deletePerson(person: Person) {
    this.person = { ...person };
  }

  onDelete(idPerson: string) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.personService.delete(idPerson).subscribe((response) => {
        if(response){
          this.people = this.people.filter((item) => item.id !== idPerson);
        }
      });
    });
  }

  confirmDeleteSelected() {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      this.deletePerson(this.person);
    });
  }

  confirmDelete() {
    this.deletePersonDialog = false;
    this.people = this.people.filter((val) => val.id !== this.person.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
    //this.people;
  }

  findIndexById(id: string): number {
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

  hideDialog() {
    this.personDialog = false;
    this.submitted = false;
  }

  savePerson() {
    this.submitted = true;
  }

  onUserPerson(event: any) {
    this.router.navigate(['configurations/users/user/', event.item.id], {
      skipLocationChange: true,
    });
  }
}
