import { Component, Input } from '@angular/core';
import { Person } from '../../../../models/person';

@Component({
  selector: 'app-form-person',
  templateUrl: './form-person.component.html',
  styleUrls: ['./form-person.component.scss'],
})
export class FormPersonComponent {
  @Input() person: Person;

  @Input() submitted: boolean;

  @Input() personDialog: boolean;

  statuses: any[] = [];

  ngOnInit() {
    this.statuses = [
      { label: 'Pasasporte', value: 3 },
      { label: 'Cedula de Ciudadania', value: 1 },
      { label: 'Tarjeta de Indentidad', value: 2 },
    ];
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
}
