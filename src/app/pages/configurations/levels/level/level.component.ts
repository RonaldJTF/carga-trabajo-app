import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as LevelActions from "@store/level.actions";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Level, Normativity, SalaryScale } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService, LevelService } from '@services';
import { AppState } from 'src/app/app.reducers';
import { Location } from '@angular/common';
import { IMAGE_SIZE, Methods } from '@utils';
import { MESSAGE } from '@labels/labels';
import { NormativityService } from 'src/app/services/normativity.service';
import { MenuItem, SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit, OnDestroy {
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;
  ROUTE_TO_BACK: string = '/configurations/levels';

  @ViewChild('normativityOptionsOverlayPanel') normativityOptionsOverlayPanel: OverlayPanel;

  isAdmin: boolean;

  formLevel !: FormGroup;
  level: Level;
  updateMode: boolean;
  creatingOrUpdating: boolean = false;
  deleting: boolean = false;
  loadingLevel: boolean = false;

  indexOfSalaryScale: number;
  salaryScaleFormGroup: FormGroup;
  mustRechargeLevelFormGroup: boolean;
  indexOfSalaryScaleSubscription: Subscription;
  salaryScaleFormGroupSubscription: Subscription;
  mustRechargeLevelFormGroupSubscription: Subscription;
  levelSubscription: Subscription;
  
  rowGroupMetadata: any = {};

  normativityOptions: SelectItem[] = [];

  menuItemsOfActiveNormativity: MenuItem[] = [];
  menuItemsOfInactiveNormativity: MenuItem[] = [];
  menuItemsOfSalaryScale: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private levelService: LevelService,
    private normativityService: NormativityService,
    private authService: AuthenticationService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cryptoService: CryptojsService,
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.indexOfSalaryScaleSubscription =  this.levelService.indexOfSalaryScale$.subscribe(e => this.indexOfSalaryScale = e);
    this.salaryScaleFormGroupSubscription = this.levelService.salaryScaleFormGroup$.subscribe(e => this.salaryScaleFormGroup = e);
    this.mustRechargeLevelFormGroupSubscription = this.levelService.mustRechargeLevelFormGroup$.subscribe(e => this.mustRechargeLevelFormGroup = e);
    this.levelSubscription = this.levelService.level$.subscribe(e => this.level = e)
    
    if (this.mustRechargeLevelFormGroup){
      this.levelService.createLevelFormGroup();
    }
    this.loadLevelInformation(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.initMenus();
    this.getNormativities();
  }

  ngOnDestroy(): void {
    this.indexOfSalaryScaleSubscription?.unsubscribe();
    this.salaryScaleFormGroupSubscription?.unsubscribe();
    this.mustRechargeLevelFormGroupSubscription?.unsubscribe();
  }

  get escalasSalarialesFormArray(): FormArray{
    return this.formLevel.get('escalasSalariales') as FormArray;
  }

  initMenus(){
      this.menuItemsOfSalaryScale = [
        {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.modifySalaryScale(e.item['index'], e.originalEvent)},
        {label: 'remover', icon: 'pi pi-times', visible: this.isAdmin, command: (e) => this.removeSalaryScale(e.item['index'])},
      ];
  
      this.menuItemsOfInactiveNormativity = [
        {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateNormativity(e.item.id, e.originalEvent)},
        {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteNormativity(e.item['value'], e.originalEvent)},
      ];
  
      this.menuItemsOfActiveNormativity = [
        {label: 'Agregar escala salarial', icon: 'pi pi-plus',  command: (e) => this.openNewSalaryScaleFromNormativity(e.item['value'], e.originalEvent)},
        {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateNormativity(e.item.id, e.originalEvent)},
        {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteNormativity(e.item['value'], e.originalEvent)},
      ];
  }
  
  hasErrors(control: AbstractControl): boolean{
    return Methods.hasErrors(control);
  }

  loadLevelInformation(id: number){
    if (id == undefined){
      this.updateMode = false;
      this.formLevel = this.levelService.getLevelFormGroup();
      this.updateRowGroupMetaData();
      this.levelService.setMustRechargeLevelFormGroup(false);
    }else{
      this.updateMode = true;
      if (this.mustRechargeLevelFormGroup){
        this.loadingLevel = true;
        this.levelService.getLevelById(id).subscribe({
          next: (e) => {
            this.formLevel = this.levelService.initializeLevelFormGroup(e);
            this.updateRowGroupMetaData();
            this.levelService.setMustRechargeLevelFormGroup(false);
            this.loadingLevel = false;
          },
        });
      }else{
        this.formLevel = this.levelService.getLevelFormGroup();
        this.updateRowGroupMetaData();
      }
    }
  }

  getNormativities(): void {
    this.normativityService.getFilteredNormativities({estado: '1', esEscalaSalarial: '1'}).subscribe({
      next: (e) => {
        this.normativityOptions = e?.map( o => ({value: o, label: o.nombre}))
      }
    });
  }

  updateLevel(payload: Level, id: number): void {
    this.levelService.updateLevel(id, payload).subscribe({
      next: (e) => {
        this.store.dispatch(LevelActions.updateFromList({level: e}));
        this.router.navigate([this.ROUTE_TO_BACK]);
        this.creatingOrUpdating = false;
        this.levelService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  createLevel(payload: Level): void {
    this.levelService.createLevel(payload).subscribe({
      next: (e) => {
        this.store.dispatch(LevelActions.addToList({level: e}));
        this.router.navigate([this.ROUTE_TO_BACK]);
        this.creatingOrUpdating = false;
        this.levelService.resetFormInformation();
      },
      error: (error) => {
        this.creatingOrUpdating = false;
      },
    });
  }

  onSubmitLevel(event : Event): void {
    event.preventDefault();
    let payload = {...this.level, ...this.formLevel.value};

    payload.escalasSalariales?.forEach(e => {
      e.estado = Methods.parseBooleanToString(e.estado);
    }); 

    if (this.formLevel.invalid) {
      this.formLevel.markAllAsTouched();
    } else {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateLevel(payload, this.level.id) : this.createLevel(payload);
    }
  }

  onDeleteLevel(event : Event): void {
    event.preventDefault();
    this.deleting = true;
    this.levelService.deleteLevel(this.level.id).subscribe({
      next: () => {
        this.store.dispatch(LevelActions.removeFromList({id: this.level.id}));
        this.router.navigate([this.ROUTE_TO_BACK]);
        this.deleting = false;
        this.levelService.resetFormInformation();
      },
      error: (error) => {
        this.deleting = false;
      },
    });
  }

  onCancelLevel(event : Event): void {
    event.preventDefault();
    this.router.navigate([this.ROUTE_TO_BACK]);
    this.levelService.resetFormInformation();
  }

  openNewSalaryScale(){
    this.levelService.setNewSalaryScale({estado: '1', idNivel: this.level?.id} as SalaryScale);
  }

  openNewSalaryScaleFromNormativity (normativity : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.levelService.setNewSalaryScale({estado: '1', idNivel: this.level?.id, idNormatividad: normativity?.id, normatividad: normativity} as SalaryScale);
  }

  cancelSalaryScale(event: Event){
    this.levelService.cancelSalaryScale();
  }

  submitSalaryScale(event:Event){
    if (this.salaryScaleFormGroup.invalid) {
      this.salaryScaleFormGroup.markAllAsTouched();
    } else {
      this.levelService.submitSalaryScale();
      this.updateRowGroupMetaData();
    }
  }

  modifySalaryScale(index: any, event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.levelService.modifySalaryScale(index);
  }

  removeSalaryScale(index: number){
    this.levelService.removeSalaryScale(index);
    this.updateRowGroupMetaData();
  }

  changeNormativity(data: any){
    this.levelService.setNormativityToSalaryScale(data.value);
    this.normativityOptionsOverlayPanel.hide();
  }

  removeNormativity(){
    this.levelService.setNormativityToSalaryScale(null);
  }

  openNewNormativity() {
    const backRoute = this.level ? `${'/configurations/levels/'+ this.cryptoService.encryptParam(this.level.id)}` : '/configurations/levels/create';
    this.router.navigate(['/configurations/normativities/create'], { skipLocationChange: true, queryParams: {backRoute: backRoute, isSalaryScale: true}});
  }

  onGoToUpdateNormativity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    const backRoute = this.level ? `${'/configurations/levels/'+ this.cryptoService.encryptParam(this.level.id)}` : '/configurations/levels/create';
    this.router.navigate(["/configurations/normativities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {backRoute: backRoute, isSalaryScale: true}})
  }

  onDeleteNormativity(normativity: Normativity, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.normativityService.deleteNormativity(normativity.id).subscribe({
          next: () => {
            this.levelService.removeSalaryScalesByNormativity(normativity.id);
            this.normativityOptions = this.normativityOptions.filter(e => e.value?.id != normativity.id)
            this.updateRowGroupMetaData();
          },
        });
      },
      `
      ¿Está seguro de eliminar la normatividad <strong>${normativity?.nombre}</strong>?
      <div class="bg-yellow-50 text-yellow-500 border-round-xl p-4 text-justify mt-2">
        <span>
            <strong>Advertencia:</strong> 
            Eliminar la normatividad implica eliminar todas las escalas salariales configuradas, 
            incluidas aquellas que están asociadas a otros niveles ocupacionales que dependan de la misma normatividad. 
            Por favor, asegúrese de que comprende el impacto de esta acción antes de proceder.
        </span>
      </div>
      `
    )
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  showDetailOfNormativity(elementRef: HTMLDivElement, event: Event) {
    if (elementRef.style.display === 'none' || !elementRef.style.display) {
      elementRef.style.display = 'block';
    } else {
      elementRef.style.display = 'none'; 
    }

    const button = event.currentTarget as HTMLElement;
    const iconElement = button.querySelector('span'); 
    if (iconElement) {
      if (iconElement.classList.contains('pi-eye')) {
        iconElement.classList.remove('pi-eye');
        iconElement.classList.add('pi-eye-slash');
      } else {
        iconElement.classList.remove('pi-eye-slash');
        iconElement.classList.add('pi-eye');
      }
    }
  }

  private updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    const salaryScales = this.escalasSalarialesFormArray.controls?.map(e => e.value);
    if (salaryScales) {
        for (let i = 0; i < salaryScales.length; i++) {
            const rowData = salaryScales[i];
            const normativityName = rowData?.normatividad?.nombre || '';
            if (i === 0) {
                this.rowGroupMetadata[normativityName] = { index: 0, size: 1 };
            }
            else {
                const previousRowData = salaryScales[i - 1];
                const previousRowGroup = previousRowData?.normatividad?.nombre;
                if (normativityName === previousRowGroup) {
                    this.rowGroupMetadata[normativityName].size++;
                }
                else {
                    this.rowGroupMetadata[normativityName] = { index: i, size: 1 };
                }
            }
        }
    }
  }
}
