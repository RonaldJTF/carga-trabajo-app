import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as LevelActions from "@store/level.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Level, SalaryScale } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService, LevelService, NormativityService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Normativity } from 'src/app/models/normativity';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy{
  IMAGE_SIZE = IMAGE_SIZE;
  MESSAGE = MESSAGE;

  isAdmin: boolean;
  loading: boolean = false;
  loadingLevel: boolean = false;
  loadingLevelById: any = {};

  levels: Level[] = [];
  level: Level;
  levelsSubscription: Subscription;
  levelSubscription: Subscription;

  selectedLevels: Level[] = [];

  filteredSalaryScales: SalaryScale[] = [];
  rowGroupMetadata: any;
  
  menuItemsOfLevel: MenuItem[] = [];
  menuItemsOfNormativity: MenuItem[] = [];
  menuItemsOfSalaryScale: MenuItem[] = [];

  viewModeOptions: any[] = [
    {icon: 'pi pi-check-circle', value: 'active', tooltip: 'Activas'},
    {icon: 'pi pi-circle-fill', value: 'all', tooltip: 'Todas'},
  ];
  viewMode: 'active' | 'all' = 'all';

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private levelService: LevelService,
    private normativityService: NormativityService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.levelsSubscription =  this.store.select(state => state.level.items).subscribe(e => this.levels = e);
    this.levelSubscription = this.store.select(state => state.level.item).subscribe(e => this.level=e);
    this.getLevels();
    this.initMenus();
    //Reestablecemos a valores iniciales cuando vayamos a editar o a gestionar las escalas salariales del nivel ocupacional
    this.levelService.setMustRechargeLevelFormGroup(true);
  }

  ngOnDestroy(): void {
    this.levelsSubscription?.unsubscribe();
    this.levelSubscription?.unsubscribe();
  }

  initMenus() {
    this.menuItemsOfLevel = [
      {label: 'Gestión de escalas salariales', icon: 'pi pi-cog',command: (e) => this.onGoToUpdateLevel(e.item.id, e.originalEvent)},
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateLevel(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteLevel(e)},
    ];

    this.menuItemsOfNormativity = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateNormativity(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteNormativity(e.item['value'], e.originalEvent)},
    ];

    this.menuItemsOfSalaryScale = [
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteSalaryScale(e)},
    ];
  }

  getLevels(){
    this.loading = true;
    this.levelService.getLevels().subscribe( e => {
      this.store.dispatch(LevelActions.setList({levels: e as Level[]}));
      this.loading = false;
    })
  }

  loadSalaryScalesToOverlayPanel(idLevel:number, isLoaded: boolean, overlayPanel?: OverlayPanel,  event?: Event){
    if (overlayPanel){
      this.store.dispatch(LevelActions.setItemFromList({id: idLevel}));
      this.setSalaryScalesFiltered(this.viewMode)
      overlayPanel.show(event);
    }
    if(!isLoaded){
      this.loadingLevel = true;
      this.levelService.getSalaryScalesByLevelId(idLevel).subscribe({
        next: (e) =>{
          this.store.dispatch(LevelActions.updateSalaryScalesToLevel({levelId: idLevel, salaryScales: e}));
          this.store.dispatch(LevelActions.setItemFromList({id: idLevel}));
          this.setSalaryScalesFiltered(this.viewMode)
          this.loadingLevel = false;
        }
      })
    }
  }
  
  loadSalaryScalesToTable(idLevel: number, isLoaded: boolean, expanded: boolean){
    if(!expanded && !isLoaded){
      this.loadingLevelById[idLevel] = true;
      this.levelService.getSalaryScalesByLevelId(idLevel).subscribe({
        next: (e) =>{
          this.store.dispatch(LevelActions.updateSalaryScalesToLevel({levelId: idLevel, salaryScales: e}));
          this.loadingLevelById[idLevel] = false;
        }
      })
    }
  }

  onDeleteSalaryScale(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelService.deleteSalaryScale(id)
        .subscribe({
          next: () => {
            this.store.dispatch(LevelActions.removeSalaryScaleToLevel({salaryScaleId: id}));
            this.desmarkAll();
          },
        });
      }
    )
  }

  getActiveSalaryScales(salaryScales: SalaryScale[]): SalaryScale[]{
    return salaryScales?.filter( e => Methods.parseStringToBoolean( e.estado));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdateLevel (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onDeleteLevel(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelService.deleteLevel(id)
        .subscribe({
          next: () => {
            this.store.dispatch(LevelActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      }
    )
  }

  deleteSelectedLevels() {
    let levelsIds: number[] = this.selectedLevels.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.levelService.deleteSelectedLevel(levelsIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(LevelActions.removeItemsFromList({levelIds: levelsIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedLevels = [];
  }

  onGoToUpdateNormativity (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(["/configurations/normativities", this.cryptoService.encryptParam(id)], {skipLocationChange: true, queryParams: {isSalaryScale: true}})
  }

  onDeleteNormativity(normativity: Normativity, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.normativityService.deleteNormativity(normativity.id).subscribe({
          next: () => {
            this.levelService.removeSalaryScalesByNormativity(normativity.id);
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

  showDetailOfNormativity(elementRef: HTMLDivElement, event: Event) {
    if (elementRef.style.display === 'none' || !elementRef.style.display) {
      elementRef.style.display = 'block';
    } else {
      elementRef.style.display = 'none'; 
    }
    const button = event.currentTarget as HTMLElement;
    // Cambiar el ícono del botón que muestra el detalle
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
  
  onChangeSalaryScaleType(optionType: 'active' | 'all') {
    this.setSalaryScalesFiltered(optionType)
  }

  setSalaryScalesFiltered(optionType: 'active' | 'all'){
    let order = (a, b) => {
      if (a.idNormatividad < b.idNormatividad) return -1;
      if (a.idNormatividad > b.idNormatividad) return 1;
      return a.nombre.localeCompare(b.nombre);;
    }
    if (optionType == 'active'){
      this.filteredSalaryScales = this.level.escalasSalariales?.filter(o =>  Methods.parseStringToBoolean(o.estado))?.sort(order);
    }
    else{
      this.filteredSalaryScales = this.level.escalasSalariales?.sort(order);
    }
    this.updateRowGroupMetaData();
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.filteredSalaryScales) {
        for (let i = 0; i < this.filteredSalaryScales.length; i++) {
            const rowData = this.filteredSalaryScales[i];
            const normativityName = rowData?.normatividad?.nombre || '';
            if (i === 0) {
                this.rowGroupMetadata[normativityName] = { index: 0, size: 1 };
            }
            else {
                const previousRowData = this.filteredSalaryScales[i - 1];
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