import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as RuleActions from "@store/rule.actions";
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Rule } from '@models';
import { Store } from '@ngrx/store';
import { AuthenticationService, ConfirmationDialogService, CryptojsService, RuleService } from '@services';
import { IMAGE_SIZE, Methods } from '@utils';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { Table } from 'primeng/table';

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

  rules: Rule[] = [];
  rulesSubscription: Subscription;

  selectedRules: Rule[] = [];
  menuItemsOfRule: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private confirmationDialogService: ConfirmationDialogService,
    private ruleService: RuleService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    
    const {isAdministrator, isOperator} = this.authService.roles();
    this.isAdmin = isAdministrator;

    this.rulesSubscription =  this.store.select(state => state.rule.items).subscribe(e => this.rules = e);
    this.getRules();
    this.initMenus();
  }

  ngOnDestroy(): void {
    this.rulesSubscription?.unsubscribe();
  }

  initMenus() {
    this.menuItemsOfRule = [
      {label: 'Editar', icon: 'pi pi-pencil', visible: this.isAdmin, command: (e) => this.onGoToUpdateRule(e.item.id, e.originalEvent)},
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteRule(e)},
    ];
  }

  getRules(){
    this.loading = true;
    this.ruleService.getRules().subscribe( e => {
      this.store.dispatch(RuleActions.setList({rules: e as Rule[]}));
      this.loading = false;
    })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route, skipLocationChange: true});
  }

  onGoToUpdateRule (id : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(id)], {relativeTo: this.route, skipLocationChange: true})
  }

  onDeleteRule(event: any): void {
    let id = parseInt(event.item.id);
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.ruleService.deleteRule(id)
        .subscribe({
          next: () => {
            this.store.dispatch(RuleActions.removeFromList({id: id}));
            this.desmarkAll();
          },
        });
      },
    )
  }

  deleteSelectedRules() {
    let ruleIds: number[] = this.selectedRules.map(item => item.id);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.ruleService.deleteSelectedRules(ruleIds)
        .subscribe({
          next: (e) => {
           this.store.dispatch(RuleActions.removeItemsFromList({ruleIds: ruleIds}));
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedRules = [];
  }

  parseStringToBoolean(str: string): boolean{
    return Methods.parseStringToBoolean(str);
  }
}