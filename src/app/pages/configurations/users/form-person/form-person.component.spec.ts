import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormPersonComponent } from './form-person.component';
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ConfirmationService, MessageService} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {FormActionButtonComponent} from "../../../../shared/form-action-button/form-action-button.component";
import {ConfirmationDialogService} from "@services";
import {ImageFallbackDirective} from "@directives";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared";

describe('FormPersonComponent', () => {
  let component: FormPersonComponent;
  let fixture: ComponentFixture<FormPersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPersonComponent, FormActionButtonComponent, ImageFallbackDirective],
      imports: [HttpClientTestingModule, DropdownModule, InputNumberModule, FormsModule, ReactiveFormsModule, SharedModule],
      providers: [
        MessageService,
        ConfirmationDialogService,
        ConfirmationService,
        {
          provide: ActivatedRoute,
          useValue: {
            // Simulamos el snapshot de los parámetros de la ruta o cualquier dato relevante
            snapshot: { params: { id: '37' } },
            // Si estás utilizando observables en ActivatedRoute (ejemplo: paramMap o data)
            paramMap: of({ get: () => '37' }),
            // Añade más simulaciones si son necesarias
          }
        }
      ]
    });
    fixture = TestBed.createComponent(FormPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send id at person', () => {
    const personId = '37';
    component.getPerson(personId);
  });
});
