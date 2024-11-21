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
export class FormPrimaryVariableComponent  implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  //ROUTE_TO_BACK: string = '/basic-tables/primary-variable';

  DELETE_MESSAGE = `¿Está seguro de eliminar la variable?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar la normatividad implica eliminar todas las escalas salariales configuradas, 
            incluidas aquellas que están asociadas a otros niveles ocupacionales que dependan de la misma normatividad. 
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

  porVigenciaSubscription: Subscription;

  primaryVariables: Variable[] = [];
  result: number | string = '';

  constructor(
    private basicTablesService: BasicTablesService,
    private validityService: ValidityService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadVariable(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    //this.backRoute = this.route.snapshot.queryParams['backRoute'] ?? this.ROUTE_TO_BACK;
    this.buildForm();
    this.loadVariables();

    this.porVigenciaSubscription = this.formPrimaryVariable.get('porVigencia').valueChanges.subscribe((value: boolean) => {
      if(value){
        this.formPrimaryVariable.get('valor')?.clearValidators();
      }else{
        this.formPrimaryVariable.get('valor')?.setValidators(Validators.compose([Validators.required, ValidateExpression.validate()]));
        setTimeout(() => this.reloadExpression(), 0); 
      }
      this.formPrimaryVariable.get('valor')?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.porVigenciaSubscription?.unsubscribe();
  }

  buildForm(){
    this.formPrimaryVariable = this.formBuilder.group({
      estado: [true, Validators.required],
      porVigencia: [false, Validators.required],
      primaria: true,
      global: [true, Validators.required],
      valor: ['', Validators.compose([Validators.required, ValidateExpression.validate()])],
      expresionValor: '',
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

  loadVariables(): void {
    this.basicTablesService.getPrimaryVariables().subscribe({
      next: (e) => {
        this.primaryVariables = e;
      }
    });
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

  /**
   * Carga el valor de la expresión a partir del valor de la formula con los Ids
   */
  reloadExpression(){
    if (this.primaryVariable?.valor){
      const editableInput = document.getElementById('editableInput')!;
      if (!editableInput) {
        console.warn("El elemento editableInput no está disponible en el DOM.");
        return;  // Salir si el elemento no está disponible
      }
      for (let part of this.extractExpressions(this.primaryVariable.valor)){
        if(/^\$\[\d+\]$/.test(part)){
          const match = part.match(/\$\[(\d+)\]/);
          const id = match ? parseInt(match[1], 10) : null;
          this.insertVariable(id);
        }else{
          editableInput.appendChild(document.createTextNode(part));
          editableInput.appendChild(document.createTextNode(' '));
        }
      }
      this.updateExpression(editableInput);
    }else{
      this.setValueAndExpressionInformation(new Expression());
    }
  }

  updateVariable(payload: Variable, id: number): void {
    this.basicTablesService.updatePrimaryVariable(id, payload).subscribe({
      next: (e) => {
        //this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.goBack();
        this.creatingOrUpdating = false;
        this.validityService.updateVariableInValuesInValidity(e);
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
        //this.router.navigate([this.backRoute], {skipLocationChange: true});
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
        //this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        //Removemos de la lista de valores de las primaryVariables en la vigencia para la primaryVariable que se gestionan
        this.validityService.removeValuesInValidityByVariable(this.primaryVariable.id);
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
    //this.formPrimaryVariable.reset();
  }

  hasErrors(control: AbstractControl): boolean{
    return Methods.hasErrors(control);
  }
  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  onDragStart(event: DragEvent, key: number) {
    event.dataTransfer?.setData('text/plain', key.toString());
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); 
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      this.insertVariable(parseInt(data));
    }
  }

  ngAfterViewInit() {
    this.reloadExpression();
  }

  updateExpressionFromInputText(event) {
    const editableInput = event.target;
    const obj =  this.getExpression(editableInput.childNodes);
    this.setValueAndExpressionInformation(obj);
  }
  
  private updateExpression(editableInput) {
    const obj =  this.getExpression(editableInput.childNodes);
    this.setValueAndExpressionInformation(obj);
  }

  private setValueAndExpressionInformation(obj: Expression){
    this.formPrimaryVariable.patchValue({
      expresionValor: obj.expressionWithNames,
      valor: obj.expressionWithIds
    });
    this.formPrimaryVariable.get('valor').markAllAsTouched();
    this.formPrimaryVariable.get('expresionValor').markAllAsTouched();
    this.formPrimaryVariable.get('valor').updateValueAndValidity();
    this.formPrimaryVariable.get('expresionValor').updateValueAndValidity();
  }

  private getExpression(childNodes): Expression{
    let expressionWithNames = '';
    let expressionWithIds = '';
    if(childNodes){
      childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('span[varId]')?.hasAttribute('varId')) {
          const id = this.cryptoService.decryptParamAsNumber(node.querySelector('span[varId]').getAttribute('varId'));
          let primaryVariable: Variable = this.findVariable(id);
          expressionWithNames += primaryVariable.nombre;
          expressionWithIds += `$[${primaryVariable.id}]`;
        } else if (node.nodeType === Node.TEXT_NODE) {
          expressionWithNames += node.nodeValue.replace(/\s+/g, '');
          expressionWithIds += node.nodeValue.replace(/\s+/g, '');
        }
      });
    }
    return {expressionWithNames, expressionWithIds};
  }

  private findVariable(id: number): Variable{
    let primaryVariable: Variable = null;
    if (this.primaryVariable){
      primaryVariable = this.primaryVariable.variablesRelacionadas.find(e => e.id == id);
    }
    if (!primaryVariable){
      primaryVariable = this.primaryVariables?.find(e => e.id == id);
    }
      return primaryVariable;
  }

  private insertVariable(varId: number) {   
    const primaryVariable: Variable = this.findVariable(varId);  

    const editableInput = document.getElementById('editableInput')!;

    

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('_badge-container-dinamic');
    containerDiv.contentEditable = "false";

    const valueSpan = document.createElement('span');
    valueSpan.textContent = primaryVariable.nombre;
    valueSpan.setAttribute('varId',  this.cryptoService.encryptParam(varId.toString())); 

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('_badge-dinamic');
    iconSpan.setAttribute('pTooltip', "Click para cancelar");
    iconSpan.contentEditable = "false";
    iconSpan.style.display = 'none';

    iconSpan.addEventListener('click', (event) => {
        event.stopPropagation();
        containerDiv.remove();
        this.updateExpression(editableInput)
    });

    containerDiv.addEventListener('mouseenter', function() {
        iconSpan.style.display = 'block';
    });
    containerDiv.addEventListener('mouseleave', function() {
        iconSpan.style.display = 'none';
    });

    const icon = document.createElement('i');
    icon.className = 'pi pi-times';
    icon.contentEditable = "false"; 

    iconSpan.appendChild(icon);
    
    containerDiv.appendChild(valueSpan);
    containerDiv.appendChild(iconSpan);
    
    // Insertar al final y mover el cursor
    editableInput.appendChild(containerDiv);
    editableInput.appendChild(document.createTextNode(' '));
    
    this.updateExpression(editableInput)
  }

  private extractExpressions(expression) {
    const regex = /\$\[\d+\]|[\+\-\*\/\(\)]|\d+(\.\d+)?/g;
    return expression.match(regex);
  }
}
