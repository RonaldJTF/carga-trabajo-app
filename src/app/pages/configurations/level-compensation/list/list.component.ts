import {Component, OnInit} from '@angular/core';
import {AuthenticationService, CompensationService, ConfirmationDialogService, CryptojsService} from "@services";
import {LevelCompensation} from "@models";
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import {MenuItem, TreeNode} from "primeng/api";
import {finalize} from "rxjs";
import {TreeTable} from "primeng/treetable";

class GroupAttribute {
  groupKey: 'idVigencia';
  groupValue: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;

  protected readonly MESSAGE = MESSAGE;

  isAdmin: boolean = false;

  loading: boolean = false;

  idLevel: string;

  items: MenuItem[] = [];

  selectedLevelCompensation: LevelCompensation[] = [];

  levelCompensation: LevelCompensation[] = [];

  groupLevelCompensation: any = [];

  tree: TreeNode[] = [];

  expandedRows: { [vigenciaId: string]: { [escalaId: string]: boolean } } = {};


  constructor(
    private authService: AuthenticationService,
    private compensationService: CompensationService,
    private cryptojsService: CryptojsService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  toggleRow(vigenciaId: string, escalaId: string): void {
    if (!this.expandedRows[vigenciaId]) {
      this.expandedRows[vigenciaId] = {};
    }
    this.expandedRows[vigenciaId][escalaId] = !this.expandedRows[vigenciaId][escalaId];
  }


  ngOnInit() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
    this.getInitialValue();
    this.initMenu();
  }

  initMenu() {
    this.items = [
      {label: 'Editar', icon: 'pi pi-pencil', command: (e) => this.editValidity(parseInt(e.item.id))},
      {label: 'Eliminar', icon: 'pi pi-trash', command: (e) => this.onDelete(parseInt(e.item.id))},
    ];
  }

  getInitialValue() {
    this.route.queryParams.subscribe((params) => {
      this.idLevel = params['idLevel'];
      if (this.idLevel != null) {
        this.getLevelCompensations(this.idLevel);
      }
    });
  }

  getLevelCompensations(idLevel: string) {
    this.loading = true;
    this.compensationService.getLevelCompensations(idLevel).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.levelCompensation = res;
        this.groupLevelCompensation = this.groupByValidityAndScale(this.levelCompensation);
        this.tree = this.buildTreeNode(this.groupLevelCompensation)
        console.log(this.tree)
      }
    })
  }

  groupByValidityAndScale(data: any[]) {
    const grouped = {};

    data.forEach((item) => {
      const vigenciaId = item.vigencia.id;
      const escalaSalarial = item.escalaSalarial
      const escalaId = item.escalaSalarial?.id;

      if (!grouped[vigenciaId]) {
        grouped[vigenciaId] = {...item.vigencia, escalas: {}};
      }

      if (!grouped[vigenciaId].escalas[escalaId]) {
        grouped[vigenciaId].escalas[escalaId] = {
          escalaSalarial: escalaSalarial,
          items: []
        };
      }

      grouped[vigenciaId].escalas[escalaId].items.push(item);
    });

    return Object.values(grouped).map((vigencia: any) => {
      return {
        ...vigencia,
        escalas: Object.values(vigencia.escalas),
      };
    });
  }

  deleteSelectedLevelCompensation() {
    let compensationIds: string[] = this.selectedLevelCompensation.map(item => this.cryptojsService.encryptParam(item.id));
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.compensationService.deleteSelectedCompensations(compensationIds)
          .subscribe({
            next: () => {
              this.desmarkAll();
            }
          });
      }
    )
  }

  desmarkAll() {
    this.selectedLevelCompensation = [];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: {idLevel: this.idLevel}
    }).then();
  }

  goBack() {
    this.router.navigate(['/configurations/levels'], {
      skipLocationChange: true,
    }).then();
  }

  onDelete(id: number) {
    this.confirmationDialogService.showDeleteConfirmationDialog(() => {
      console.log("Eliminado...-> ", id);
    });
  }

  editValidity(id: number) {
    console.log("Editando...-> ", id);
    this.router.navigate(['/configurations/validities/create', this.cryptojsService.encryptParam(id)], {
      skipLocationChange: true,
      queryParams: {idLevel: this.idLevel}
    }).then();
  }

  parseStringToBoolean(str: string): boolean {
    return Methods.parseStringToBoolean(str);
  }


  buildTreeNode(data: any): TreeNode[] {
    return data.map((nodeData: any) => this.createNode(nodeData));
  }


  createNode(data: any): TreeNode {
    let node: TreeNode = {
      label: '',
      data: data,
      expanded: true,
      children: []
    };

    // Determina el tipo de nodo en base a las propiedades disponibles en `data`
    if (data.nombre && data.anio !== undefined) {
      // Nodo de Vigencia
      node.label = `${data.nombre} - Año: ${data.anio}`;
      node.children = [
        {
          label: 'Valores de Vigencia',
          expanded: true,
          children: this.buildTreeNode(data.valoresVigencia || [])
        },
        {
          label: 'Escalas Salariales',
          expanded: true,
          children: this.buildTreeNode(data.escalas || [])
        }
      ];
    } else if (data.valor !== undefined && data.variable) {
      // Nodo de Valor de Vigencia
      node.label = `Valor: ${data.valor} - Variable: ${data.variable.nombre}`;
    } else if (data.escalaSalarial) {
      // Nodo de Escala Salarial
      node.label = `${data.escalaSalarial.nombre} - Código: ${data.escalaSalarial.codigo}`;
      node.children = this.buildTreeNode(data.items || []);
    } else if (data.compensacionLaboral && data.nivel) {
      // Nodo de Item
      node.label = `${data.compensacionLaboral.nombre} - ${data.nivel.nombre}`;
      node.children = [
        this.createNode({label: `Compensación: ${data.compensacionLaboral.nombre}`, data: data.compensacionLaboral}),
        this.createNode({label: `Variable: ${data.variable.nombre}`, data: data.variable}),
        this.createNode({label: `Regla: ${data.regla.nombre}`, data: data.regla})
      ];
    }

    return node;
  }


}
