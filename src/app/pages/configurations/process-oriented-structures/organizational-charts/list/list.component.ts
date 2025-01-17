import {Component, OnInit} from '@angular/core';
import {IMAGE_SIZE, Methods} from "@utils";
import {MESSAGE} from "@labels/labels";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../app.reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, CryptojsService, OrganizationChartService} from "@services";
import {Observable} from "rxjs";
import {Hierarchy, OrganizationChart, Structure} from "@models";
import {MenuItem, MenuItemCommandEvent, TreeNode} from "primeng/api";
import {an, ee} from "@fullcalendar/core/internal-common";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  protected readonly IMAGE_SIZE = IMAGE_SIZE;
  protected readonly MESSAGE = MESSAGE;

  loading: boolean = false;

  isAdmin: boolean;

  oganizationalManagements$: any;

  organizationChart$: Observable<OrganizationChart>;

  organizationalCharts: OrganizationChart[];
  organizationChart: OrganizationChart;

  dataset: TreeNode[];

  menuItemsOrganizationChart: MenuItem[] = [];
  menuItemsDependency: MenuItem[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationChartService: OrganizationChartService,
    private cryptoService: CryptojsService,
  ) {
  }

  ngOnInit() {
    this.getRol();
    this.getOrganizationChart();

    this.menuItemsOrganizationChart = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        visible: this.isAdmin,
        command: (e) => this.onGoUpdateOrganizationChart(e.item.id, e.originalEvent)
      },
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteOrganizationChart(e)}
    ];

    this.menuItemsDependency = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        visible: this.isAdmin,
        command: (e) => this.onGoUpdateDependency(e.item, e.originalEvent)
      },
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.isAdmin, command: (e) => this.onDeleteDependency(e)},
      {
        label: 'Agregar subdependencia',
        icon: 'pi pi-sitemap',
        visible: this.isAdmin,
        command: (e) => this.onGoCreateDependency(e.item, false)
      },
    ]
  }

  getRol() {
    const {isAdministrator} = this.authService.roles();
    this.isAdmin = isAdministrator;
  }

  getOrganizationChart() {
    this.organizationChartService.getOrganizationalCharts().subscribe({
      next: (resp) => {
        this.organizationalCharts = resp;
      }
    });
  }

  toggleIcon(show: boolean, element: HTMLSpanElement) {
    element.style.display = show ? 'block' : 'none';
  }

  onDeleteOrganizationChart(event: any) {
    console.log("Eliminado ORGANIGRAMA")
  }

  onGoUpdateOrganizationChart(id: any, event: Event) {
    this.router.navigate(['create/', this.cryptoService.encryptParam(id)], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  onDeleteDependency(event: any) {
    console.log("Eliminado DEPENDENCIA")
  }

  onGoUpdateDependency(dependency: any, event: Event) {
    this.router.navigate(['dependency/', this.cryptoService.encryptParam(dependency.value.idDependencia)], {
      relativeTo: this.route,
      skipLocationChange: true,
    }).then();
  }

  openNew() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
      skipLocationChange: true
    }).then();
  }

  onGoCreateDependency(payload: any, first: boolean) {
    this.router.navigate(['dependency'], {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: first ? {organizationChart: JSON.stringify(payload)} : {parentDependency: JSON.stringify(payload.item.value)}
    }).then();
  }


  viewOrganizationChart(organizationChart: OrganizationChart) {
    this.organizationChart = organizationChart;
    this.organizationChartService.getHierarchiesByOrganizationChartId(organizationChart.id).subscribe({
      next: (resp) => {
        this.dataset = this.buildNodes(resp);
        console.log(resp);
      }
    })
  }

  buildNodes(hierarchies: Hierarchy[]): TreeNode<Hierarchy>[] {
    if (!hierarchies) {
      return [];
    }
    const nodes: TreeNode<OrganizationChart>[] = [];
    for (const jerarquia of hierarchies) {
      const node: TreeNode<OrganizationChart> = {
        expanded: true,
        data: jerarquia,
        type: 'person',
        styleClass: `bg-${jerarquia.dependencia.convencion.nombreColor}-50 border-round border-${jerarquia.dependencia.convencion.nombreColor}-300`,
        children: this.buildNodes(jerarquia.subJerarquias)
      };
      nodes.push(node);
    }
    return nodes;
  }


  listOrganizationChart() {
    this.dataset = null;
    this.organizationChart = null;
  }
}
