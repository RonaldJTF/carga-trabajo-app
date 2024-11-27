import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Variable } from '@models';
import { Store } from '@ngrx/store';
import { CryptojsService, LevelCompensationService, UrlService, ValidityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { ValidateExpression } from '@validations/validateExpression';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { VariableService } from 'src/app/services/variable.service';

class Expression{
  expressionWithNames: string;
  expressionWithIds: string;
}

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss'],
})
export class VariableComponent  implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/variables';

  DELETE_MESSAGE = `¿Está seguro de eliminar la variable?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar esta variable conlleva a eliminar a las otras variables en cascada y las reglas que tienen relación con cada una.  
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
    `

  formVariable !: FormGroup;
  variable: Variable;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  backRoute: string;

  porVigenciaSubscription: Subscription;

  variables: Variable[] = [];
  result: number | string = '';

  constructor(
    private store: Store<AppState>,
    private variableService: VariableService,
    private validityService: ValidityService,
    private levelCompensationService: LevelCompensationService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadVariable(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.backRoute = this.route.snapshot.queryParams['backRoute'] ?? this.ROUTE_TO_BACK;
    this.buildForm();
    this.loadVariables();

    this.porVigenciaSubscription = this.formVariable.get('porVigencia').valueChanges.subscribe((value: boolean) => {
      if(value){
        this.formVariable.get('valor')?.clearValidators();
      }else{
        this.formVariable.get('valor')?.setValidators(Validators.compose([Validators.required, ValidateExpression.validate()]));
        setTimeout(() => this.reloadExpression(), 0); 
      }
      this.formVariable.get('valor')?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.porVigenciaSubscription?.unsubscribe();
  }

  buildForm(){
    this.formVariable = this.formBuilder.group({
      estado: [true, Validators.required],
      porVigencia: [false, Validators.required],
      primaria: false,
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
      this.variableService.getVariable(id).subscribe({
        next: (e) => {
          this.variable = e;
          this.assignValuesToForm();
        },
      });
      this.updateMode = true;
    }
  }
  
  loadVariables(): void {
    this.variableService.getVariables().subscribe({
      next: (e) => {
        this.variables = e;
      }
    });
  }
  
  assignValuesToForm(){
    this.formVariable.get('nombre').setValue(this.variable.nombre);
    this.formVariable.get('descripcion').setValue(this.variable.descripcion);
    this.formVariable.get('estado').setValue(Methods.parseStringToBoolean(this.variable.estado ?? "1" ));
    this.formVariable.get('porVigencia').setValue(Methods.parseStringToBoolean(this.variable.porVigencia ?? "0" ));
    this.formVariable.get('global').setValue(Methods.parseStringToBoolean(this.variable.global ?? "1" ));
    this.formVariable.get('primaria').setValue(Methods.parseStringToBoolean(this.variable.primaria ?? "0" ));
    this.formVariable.get('valor').setValue(this.variable.valor);
  }

  /**
   * Carga el valor de la expresión a partir del valor de la formula con los Ids
   */
  reloadExpression(){
    if (this.variable?.valor){
      const editableInput = document.getElementById('editableInput')!;
      for (let part of this.extractExpressions(this.variable.valor)){
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
    this.variableService.updateVariable(id, payload).subscribe({
      next: (e) => {
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        //Actualizamos de las asignaciones de las variables en una vigencia con la nueva información de la variable
        this.validityService.updateVariableInValuesInValidity(e);
        //Actualizamos del formulario de relación de compensación laboral de niveles en una vigencia la nueva información de la variable
        this.levelCompensationService.updateVariableInLevelCompensation(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createVariable(payload: Variable): void {
    this.variableService.createVariable(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating = false;
        this.router.navigate([this.backRoute], {skipLocationChange: true});
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitVariable(event : Event): void {
    event.preventDefault();
    let payload = {...this.variable, ...this.formVariable.value};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    payload.porVigencia = Methods.parseBooleanToString(payload.porVigencia);
    payload.global = Methods.parseBooleanToString(payload.global);
    payload.primaria = Methods.parseBooleanToString(payload.primaria);

    if (this.formVariable.invalid) {
      this.formVariable.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateVariable(payload, this.variable.id) : this.createVariable(payload);
    }
  }

  onDeleteVariable(event : Event): void {
    event.preventDefault();
    const variableId = this.variable.id;
    this.deleting = true;
    this.variableService.deleteVariable(variableId).subscribe({
      next: () => {
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        //Removemos de la lista de valores de las variables en la vigencia para la variable que se gestionan
        this.validityService.removeValuesInValidityByVariable(variableId);
        //Removemos del formulario de relación de compensación laboral de niveles en una vigencia la variable si es la que se aplica
        this.levelCompensationService.removeVariableInLevelCompensation(variableId);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelVariable(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.backRoute], {skipLocationChange: true});
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

  updateExpressionFromInputText(event) {
    const editableInput = event.target;
    if(this.allowedCharacter(editableInput.childNodes)){
      const obj =  this.getExpression(editableInput.childNodes);
      this.setValueAndExpressionInformation(obj);
    }
  }

  
  private updateExpression(editableInput) {
    const obj =  this.getExpression(editableInput.childNodes);
    this.setValueAndExpressionInformation(obj);
  }

  private setValueAndExpressionInformation(obj: Expression){
    this.formVariable.patchValue({
      expresionValor: obj.expressionWithNames,
      valor: obj.expressionWithIds
    });
    this.formVariable.get('valor').markAllAsTouched();
    this.formVariable.get('expresionValor').markAllAsTouched();
    this.formVariable.get('valor').updateValueAndValidity();
    this.formVariable.get('expresionValor').updateValueAndValidity();
  }

  private getExpression(childNodes): Expression{
    let expressionWithNames = '';
    let expressionWithIds = '';
    if(childNodes){
      childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('span[varId]')?.hasAttribute('varId')) {
          const id = this.cryptoService.decryptParamAsNumber(node.querySelector('span[varId]').getAttribute('varId'));
          let variable: Variable = this.findVariable(id);
          expressionWithNames += variable.nombre;
          expressionWithIds += `$[${variable.id}]`;
        } else if (node.nodeType === Node.TEXT_NODE) {
          expressionWithNames += node.nodeValue.replace(/\s+/g, '');
          expressionWithIds += node.nodeValue.replace(/\s+/g, '');
        }
      });
    }
    return {expressionWithNames, expressionWithIds};
  }

  private findVariable(id: number): Variable{
    let variable: Variable = null;
    if (this.variable){
      variable = this.variable.variablesRelacionadas.find(e => e.id == id);
    }
    if (!variable){
      variable = this.variables?.find(e => e.id == id);
    }
      return variable;
  }

  private insertVariable(varId: number) {   
    const variable: Variable = this.findVariable(varId);  

    const editableInput = document.getElementById('editableInput')!;

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('_badge-container-dinamic');
    containerDiv.contentEditable = "false";

    const valueSpan = document.createElement('span');
    valueSpan.textContent = variable.nombre;
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
    
    editableInput.appendChild(containerDiv);
    editableInput.appendChild(document.createTextNode(' '));
    
    this.updateExpression(editableInput)
  }

  private extractExpressions(expression) {
    const regex = /\$\[\d+\]|[\(\)\+\-\*\/]|\d+(\.\d+)?/g;
    return expression.match(regex);
  }

  private allowedCharacter(childNodes){
    const allowedCharacters = /^[+\-*/><=()0-9.\s ]*$/;
    for (let node of childNodes ?? []){
      if (node.nodeType === Node.TEXT_NODE && !allowedCharacters.test( node.nodeValue)) {
        node.nodeValue =node.nodeValue.split('').filter(char => allowedCharacters.test(char)).join('');
        return false;
      }
    }
    return true;
  }
}
