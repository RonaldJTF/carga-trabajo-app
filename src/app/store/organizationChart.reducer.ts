import { createReducer, on } from "@ngrx/store";
import { OperationalManagement, OrganizationChart } from "@models";
import * as OrganizationChartActions from "./organizationChart.actions";
import _ from 'lodash'; //Usada para clonar conservando la estructura del objeto, por ejemplo, el orden en que se encuentran en una lista, etc.

export interface OrganizationChartState {
  items: OrganizationChart[];
  item: OrganizationChart;
  mustRecharge: boolean;
  viewMode: 'base-structure' | 'diagram';
  assignedOperationalsManagements: OperationalManagement[];
  noAssignedOperationalsManagements: OperationalManagement[];
  mustRechargeNoAssignedOperationalsManagements: boolean;
  operationalManagementExpandedNodes: any[];
}

export const initialState: OrganizationChartState = {
  items: [],
  item: new OrganizationChart(),
  mustRecharge: true,
  viewMode: 'base-structure',
  assignedOperationalsManagements: [],
  noAssignedOperationalsManagements: [],
  mustRechargeNoAssignedOperationalsManagements: true,
  operationalManagementExpandedNodes: [],
};

export const organizationChartReducer = createReducer(
  initialState,

  on(OrganizationChartActions.setList, (state, { organizationCharts }) => ({
    ...state,
    items: [...organizationCharts ?? []],
  })),

  on(OrganizationChartActions.addToList, (state, { organizationChart }) =>{
    return { ...state,
      items:[...state.items, organizationChart]
    };
  }),

  on(OrganizationChartActions.removeFromList, (state, { id }) => {
    return { 
      ...state, 
      items: state.items.filter(e => e.id != id) ,
      item: state.item?.id == id ? null : state.item 
    };
  }),

  on(OrganizationChartActions.removeItemsFromList, (state, { organizationChartIds }) => {
    return { 
      ...state, 
      items: state.items.filter(e => !organizationChartIds?.some(o => o == e.id) ),
      item: organizationChartIds.includes(state.item.id) ? null : state.item 
    };
  }),

  on(OrganizationChartActions.updateFromList, (state, { organizationChart }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === organizationChart.id);
    if (index !== -1){
      items[index] = organizationChart;
    }
    return { ...state, items:items, item: state.item?.id == organizationChart.id ? organizationChart : state.item};
  }),

  on(OrganizationChartActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(OrganizationChartActions.setOrganizationChart, (state, { organizationChart }) => ({
    ...state,
    item: organizationChart,
  })),

  on(OrganizationChartActions.setAssignedOperationalsManagements, (state, { assignedOperationalsManagements }) => {
    let items =  JSON.parse(JSON.stringify(assignedOperationalsManagements ?? []));
    order(items, true);
    return{
      ...state,
      assignedOperationalsManagements: items,
    }
  }),

  on(OrganizationChartActions.addToAssignedOperationalsManagements, (state, { operationalsManagements }) =>{
    const items = JSON.parse(JSON.stringify(state.assignedOperationalsManagements));
    mergeOperationalManagementLists(items, operationalsManagements)
    order(items, true);
    return{
      ...state,
      assignedOperationalsManagements: items,
    }
  }),

  on(OrganizationChartActions.removeFromAssignedOperationalsManagements, (state, { operationalManagementId }) => {
    const items = JSON.parse(JSON.stringify(state.assignedOperationalsManagements));
    const filteredItems = filtrarNodosArbol (items, [operationalManagementId]);
    return { ...state, assignedOperationalsManagements: filteredItems};
  }),

  on(OrganizationChartActions.removeItemsFromAssignedOperationalsManagements, (state, { operationalsManagementsIds }) => {
    const items = JSON.parse(JSON.stringify(state.assignedOperationalsManagements));
    const filteredItems = filtrarNodosArbol (items, operationalsManagementsIds);
    return { ...state, assignedOperationalsManagements: filteredItems};
  }),

  on(OrganizationChartActions.addToOperationalManagementExpandedNodes, (state, { operationalManagementId }) =>{
    return { ...state, operationalManagementExpandedNodes:  [...state.operationalManagementExpandedNodes, operationalManagementId],};
  }),

  on(OrganizationChartActions.removeFromOperationalManagementExpandedNodes, (state, { operationalManagementId }) => {
    return { ...state, operationalManagementExpandedNodes: state.operationalManagementExpandedNodes.filter(item => item != operationalManagementId),};
  }),

  on(OrganizationChartActions.setNoAssignedOperationalsManagements, (state, { noAssignedOperationalsManagements }) => {
    let items =  JSON.parse(JSON.stringify(noAssignedOperationalsManagements ?? []));
    order(items, true);
    return{
      ...state,
      noAssignedOperationalsManagements: items,
    }
  }),
  
  on(OrganizationChartActions.removeFromNoAssignedOperationalsManagements, (state, { operationalManagementId }) => {
    const items = JSON.parse(JSON.stringify(state.noAssignedOperationalsManagements));
    const filteredItems = filtrarNodosArbol (items, [operationalManagementId]);
    return { ...state, noAssignedOperationalsManagements: filteredItems};
  }),

  on(OrganizationChartActions.removeItemsFromNoAssignedOperationalsManagements, (state, { operationalsManagementsIds }) => {
    const items = JSON.parse(JSON.stringify(state.noAssignedOperationalsManagements));
    const filteredItems = filtrarNodosArbol (items, operationalsManagementsIds);
    return { ...state, noAssignedOperationalsManagements: filteredItems};
  }),

  on(OrganizationChartActions.setMustRechargeNoAssignedOperationalsManagements, (state, { mustRecharge }) => ({
    ...state,
    mustRechargeNoAssignedOperationalsManagements: mustRecharge,
  })),
  
  on(OrganizationChartActions.setViewMode, (state, { viewMode }) => ({
      ...state,
      viewMode: viewMode,
    })),
);


export function filtrarNodosArbol(listaNodos: OperationalManagement[], idsAEliminar:number[]) {
  const listaFiltrada = JSON.parse(JSON.stringify(listaNodos));
  for (let i = listaFiltrada.length - 1; i >= 0; i--) {
    const nodo = listaFiltrada[i];
    if (idsAEliminar.includes(nodo.id)) {
        listaFiltrada.splice(i, 1);
    }
    else if (nodo.subGestionesOperativas) {
        nodo.subGestionesOperativas = filtrarNodosArbol(nodo.subGestionesOperativas, idsAEliminar);
        if (nodo.subGestionesOperativas.length === 0) {
          delete nodo.subGestionesOperativas;
        }
    }
  }
  return listaFiltrada;
}

export function order(operationalsManagements: OperationalManagement[], isAscending: boolean) {
  if (!operationalsManagements?.length) {
    return;
  }
  operationalsManagements.sort((a, b) => {
    const orderMultiplier = isAscending ? 1 : -1;
    if (a.orden == null && b.orden == null) {
      return (a.id - b.id) * orderMultiplier;
    }
    if (a.orden == null) {
      return 1 * orderMultiplier;
    }
    if (b.orden == null) {
      return -1 * orderMultiplier;
    }
    return (a.orden - b.orden) * orderMultiplier;
  });
  operationalsManagements.forEach(e => order(e.subGestionesOperativas, isAscending));
}


/**
 * Combina dos listas de OperationalManagement en cascada.
 * @param list1 - Lista principal que será modificada.
 * @param list2 - Lista secundaria cuyos elementos se incorporarán a la lista principal.
 */
function mergeOperationalManagementLists(list1: OperationalManagement[], list2: OperationalManagement[]): void {
  const mapById: Map<number, OperationalManagement> = new Map();

  const buildMap = (list: OperationalManagement[]) => {
    for (const item of list) {
      if (item.id) {
        mapById.set(item.id, item);
        if (item.subGestionesOperativas) {
          buildMap(item.subGestionesOperativas);
        }
      }
    }
  };

  buildMap(list1);

  const addToHierarchy = (item: OperationalManagement, parentList: OperationalManagement[]) => {
    const existingItem = item.id ? mapById.get(item.id) : undefined;

    if (existingItem) {
      if (item.subGestionesOperativas) {
        for (const subItem of item.subGestionesOperativas) {
          if (!existingItem.subGestionesOperativas) {
            existingItem.subGestionesOperativas = [];
          }
          addToHierarchy(subItem, existingItem.subGestionesOperativas);
        }
      }
    } else {
      parentList.push(item);
      if (item.id) {
        mapById.set(item.id, item);
      }
    }
  };

  for (const item of list2) {
    const parent = item.idPadre ? mapById.get(item.idPadre) : undefined;
    if (parent) {
      if (!parent.subGestionesOperativas) {
        parent.subGestionesOperativas = [];
      }
      addToHierarchy(item, parent.subGestionesOperativas);
    } else {
      addToHierarchy(item, list1);
    }
  }
}