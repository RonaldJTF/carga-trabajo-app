import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { Person } from 'src/app/models/person';
import { MenuItem, MessageService } from 'primeng/api';
import { PersonService } from 'src/app/services/person.service';

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

  person: Person = new Person;

  selectedPeople: Person[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  cardMenu: MenuItem[] = [];

  
  constructor(
    private messageService: MessageService,
    private personService: PersonService
  ){}

  ngOnInit() {
    this.cols = [
      { field: 'person', header: 'Person' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
      { field: 'rating', header: 'Reviews' },
      { field: 'inventoryStatus', header: 'Status' }
    ];

    this.getPeople();
  }
  
  getPeople(){
    this.personService.getPeople().subscribe(data => this.people = data);
  }

  openNew() {
    this.person = new Person;
    this.submitted = false;
    this.personDialog = true;
  }

  deleteSelectedPeople() {
    this.deletePeopleDialog = true;
  }

  editPerson(person: Person) {
    this.person = { ...person };
    this.personDialog = true;
  }

  deletePerson(person: Person) {
    this.deletePersonDialog = true;
    this.person = { ...person };
  }

  confirmDeleteSelected() {
     this.deletePeopleDialog = false;
     this.people = this.people.filter(
       (val) => !this.selectedPeople.includes(val)
     );
     this.messageService.add({
       severity: 'success',
       summary: 'Successful',
       detail: 'Products Deleted',
       life: 3000,
     });
     this.selectedPeople = [];
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

    // if (this.product.name?.trim()) {
    //   if (this.product.id) {
    //     // @ts-ignore
    //     this.product.inventoryStatus = this.product.inventoryStatus.value
    //       ? this.product.inventoryStatus.value
    //       : this.product.inventoryStatus;
    //     this.products[this.findIndexById(this.product.id)] = this.product;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Updated',
    //       life: 3000,
    //     });
    //   } else {
    //     this.product.id = this.createId();
    //     this.product.code = this.createId();
    //     this.product.image = 'product-placeholder.svg';
    //     // @ts-ignore
    //     this.product.inventoryStatus = this.product.inventoryStatus
    //       ? this.product.inventoryStatus.value
    //       : 'INSTOCK';
    //     this.products.push(this.product);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Created',
    //       life: 3000,
    //     });
    //   }

    //   this.products = [...this.products];
    //   this.productDialog = false;
    //   this.product = {};
    // }
  }

//   getSeverity(person: Person) {
//     switch (person.usuario.activo) {
//         case true:
//             return 'success';

//         case false:
//             return 'warning';

//         case null:
//             return 'danger';

//         default:
//             return null;
//     }
// }

onSort(){}
onFilter(){}
applyFilterGlobal(event: any, string: string){

}
}
