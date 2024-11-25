import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Variable } from '@models';
import { BasicTablesService, CryptojsService, UrlService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { ValidateExpression } from '@validations/validateExpression';
import { Subscription } from 'rxjs';

class Expression{
  expressionWithNames: string;
  expressionWithIds: string;
}

@Component({
  selector: 'app-form-primary-primaryVariable',
  templateUrl: './form-primary-variable.component.html',
  styleUrls: ['./form-primary-variable.component.scss'],
})
export class FormPrimaryVariableComponent  implements OnInit {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  DELETE_MESSAGE = `¿Está seguro de eliminar la variable?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong>
            Eliminar esta variable conlleva a eliminar a las otras variables en cascada y las reglas que tienen relación con cada una.
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
    `
  formPrimaryVariable !: FormGroup;
  primaryVariable: Variable;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  backRoute: string;
  loading: boolean = false;

  constructor(
    private basicTablesService: BasicTablesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadVariable(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.buildForm();
  }

  buildForm(){
    this.formPrimaryVariable = this.formBuilder.group({
      estado: [true, Validators.required],
      porVigencia: false,
      primaria: true,
      global: true,
      valor: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      descripcion: ''
    })
  }


  loadVariable(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.basicTablesService.getPrimaryVariable(id).subscribe({
        next: (e) => {
          this.primaryVariable = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }

  assignValuesToForm(){
    this.formPrimaryVariable.get('nombre').setValue(this.primaryVariable.nombre);
    this.formPrimaryVariable.get('descripcion').setValue(this.primaryVariable.descripcion);
    this.formPrimaryVariable.get('estado').setValue(Methods.parseStringToBoolean(this.primaryVariable.estado ?? "1" ));
    this.formPrimaryVariable.get('porVigencia').setValue(Methods.parseStringToBoolean(this.primaryVariable.porVigencia ?? "0" ));
    this.formPrimaryVariable.get('global').setValue(Methods.parseStringToBoolean(this.primaryVariable.global ?? "1" ));
    this.formPrimaryVariable.get('primaria').setValue(Methods.parseStringToBoolean(this.primaryVariable.primaria ?? "1" ));
    this.formPrimaryVariable.get('valor').setValue(this.primaryVariable.valor);
  }

  updateVariable(payload: Variable, id: number): void {
    this.basicTablesService.updatePrimaryVariable(id, payload).subscribe({
      next: (e) => {
        this.goBack();
        this.creatingOrUpdating = false;
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createVariable(payload: Variable): void {
    this.basicTablesService.createPrimaryVariable(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating = false;
        this.goBack();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitVariable(event : Event): void {
    event.preventDefault();
    let payload = {...this.primaryVariable, ...this.formPrimaryVariable.value};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    payload.porVigencia = Methods.parseBooleanToString(payload.porVigencia);
    payload.global = Methods.parseBooleanToString(payload.global);
    payload.primaria = Methods.parseBooleanToString(payload.primaria);

    if (this.formPrimaryVariable.invalid) {
      this.formPrimaryVariable.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateVariable(payload, this.primaryVariable.id) : this.createVariable(payload);
    }
  }

  onDeleteVariable(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.basicTablesService.deletePrimaryVariable(this.primaryVariable.id).subscribe({
      next: () => {
        this.goBack();
        this.deleting = false;
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelVariable(event : Event): void {
    event.preventDefault();
    this.goBack();
  }

  goBack() {
    this.urlService.goBack();
  }
}
