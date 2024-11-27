import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Rule, Variable } from '@models';
import { Store } from '@ngrx/store';
import { CryptojsService, LevelCompensationService, RuleService, UrlService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { ValidateExpression } from '@validations/validateExpression';
import { AppState } from 'src/app/app.reducers';
import { VariableService } from 'src/app/services/variable.service';

class Expression{
  expressionWithNames: string;
  expressionWithIds: string;
}

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RuleComponent  implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/rules';

  formRule !: FormGroup;
  rule: Rule;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;

  backRoute: string;

  variables: Variable[] = [];

  constructor(
    private store: Store<AppState>,
    private ruleService: RuleService,
    private variableService: VariableService,
    private levelCompensationService: LevelCompensationService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private urlService: UrlService,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.loadRule(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.backRoute = this.route.snapshot.queryParams['backRoute'] ?? this.ROUTE_TO_BACK;
    this.buildForm();
    this.loadVariables();
  }

  ngOnDestroy(): void {}

  buildForm(){
    this.formRule = this.formBuilder.group({
      estado: [true, Validators.required],
      global: [true, Validators.required],
      condiciones: ['', Validators.compose([Validators.required, ValidateExpression.validate()])],
      expresionCondiciones: '',
      nombre: ['', Validators.compose([
        Validators.required, 
        Validators.maxLength(100)
      ])],
      descripcion: ''
    })
  }
  

  loadRule(id: number){
    if (id == undefined){
      this.updateMode = false;
    }else{
      this.ruleService.getRule(id).subscribe({
        next: (e) => {
          this.rule = e;
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
    this.formRule.get('nombre').setValue(this.rule.nombre);
    this.formRule.get('descripcion').setValue(this.rule.descripcion);
    this.formRule.get('estado').setValue(Methods.parseStringToBoolean(this.rule.estado ?? "1" ));
    this.formRule.get('global').setValue(Methods.parseStringToBoolean(this.rule.global ?? "1" ));
    this.formRule.get('condiciones').setValue(this.rule.condiciones);
    this.reloadExpression();
  }

  /**
   * Carga el valor de las condiciones a partir del valor de la formula con los Ids
   */
  reloadExpression(){
    if (this.rule?.condiciones){
      const editableInput = document.getElementById('editableInput')!;
      for (let part of this.extractExpressions(this.rule.condiciones)){
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
      this.setConditionsAndConditionsExpression(new Expression());
    }
  }

  updateRule(payload: Rule, id: number): void {
    this.ruleService.updateRule(id, payload).subscribe({
      next: (e) => {
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.creatingOrUpdating = false;
        //Actualizamos del formulario de relación de compensación laboral de niveles en una vigencia la nueva información de la regla
        this.levelCompensationService.updateRuleInLevelCompensation(e);
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createRule(payload: Rule): void {
    this.ruleService.createRule(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating = false;
        this.router.navigate([this.backRoute], {skipLocationChange: true});
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitRule(event : Event): void {
    event.preventDefault();
    let payload = {...this.rule, ...this.formRule.value};
    payload.estado = Methods.parseBooleanToString(payload.estado);
    payload.porVigencia = Methods.parseBooleanToString(payload.porVigencia);
    payload.global = Methods.parseBooleanToString(payload.global);
    payload.primaria = Methods.parseBooleanToString(payload.primaria);

    if (this.formRule.invalid) {
      this.formRule.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateRule(payload, this.rule.id) : this.createRule(payload);
    }
  }

  onDeleteRule(event : Event): void {
    event.preventDefault();
    const ruleId = this.rule.id;
    this.deleting = true;
    this.ruleService.deleteRule(ruleId).subscribe({
      next: () => {
        this.router.navigate([this.backRoute], {skipLocationChange: true});
        this.deleting = false;
        //Removemos del formulario de relación de compensación laboral de niveles en una vigencia la regla si es la que se aplica
        this.levelCompensationService.removeRuleInLevelCompensation(ruleId);
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelRule(event : Event): void {
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
      this.setConditionsAndConditionsExpression(obj);
    }
  }

  private updateExpression(editableInput) {
    const obj =  this.getExpression(editableInput.childNodes);
    this.setConditionsAndConditionsExpression(obj);
  }

  private setConditionsAndConditionsExpression(obj: Expression){
    this.formRule.patchValue({
      expresionCondiciones: obj.expressionWithNames,
      condiciones: obj.expressionWithIds
    });
    this.formRule.get('condiciones').markAllAsTouched();
    this.formRule.get('expresionCondiciones').markAllAsTouched();
    this.formRule.get('condiciones').updateValueAndValidity();
    this.formRule.get('expresionCondiciones').updateValueAndValidity();
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
    if (this.rule){
      variable = this.rule.variablesRelacionadas?.find(e => e.id == id);
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
    containerDiv.classList.add('_badge-container-dinamic_');
    containerDiv.contentEditable = "false";

    const valueSpan = document.createElement('span');
    valueSpan.textContent = variable?.nombre;
    valueSpan.setAttribute('varId',  this.cryptoService.encryptParam(varId.toString())); 

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('_badge-dinamic_');
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
    const regex = /\$\[\d+\]|<=|>=|==|!=|[\(\)\+\-\*\/\<\>\&\|]|\d+(\.\d+)?/g;
    return expression.match(regex);
  }

  private allowedCharacter(childNodes){
    const allowedCharacters = /^[+\-*/><=!&|()0-9.\s ]*$/;
    for (let node of childNodes ?? []){
      if (node.nodeType === Node.TEXT_NODE && !allowedCharacters.test( node.nodeValue)) {
        node.nodeValue =node.nodeValue.split('').filter(char => allowedCharacters.test(char)).join('');
        return false;
      }
    }
    return true;
  }

}
