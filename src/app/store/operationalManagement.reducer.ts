import { createReducer, on } from "@ngrx/store";
import { OperationalManagement, Structure } from "@models";
import * as OperationalManagementActions from "./operationalManagement.actions";
import _ from 'lodash'; //Usada para clonar conservando la estructura del objeto, por ejemplo, el orden en que se encuentran en una lista, etc.

export interface OperationalManagementState {
  items: OperationalManagement[];
  item: OperationalManagement;
  mustRecharge: boolean;
  expandedNodes: any[];
  orderIsAscending: boolean;
}

export const initialState: OperationalManagementState = {
  items: [],
  item: new OperationalManagement(),
  mustRecharge: true,
  expandedNodes: [],
  orderIsAscending: true,
};

export const operationalManagementReducer = createReducer(
  initialState,

  on(OperationalManagementActions.setList, (state, { operationalsManagements }) => {
    let items =  JSON.parse(JSON.stringify(operationalsManagements ?? []));
   return{
    ...state,
    items: items,
   }
  }),

  on(OperationalManagementActions.addToList, (state, { operationalManagement }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let parentStructure = findOperationalManagement(operationalManagement.idPadre, items);
    if (parentStructure){
      if (!parentStructure.subGestionesOperativas){parentStructure.subGestionesOperativas = []}
      if (parentStructure.subGestionesOperativas.find( e => e.orden == operationalManagement.orden)){
        reasingOrder(parentStructure.subGestionesOperativas, operationalManagement.orden, 1);
      }
      parentStructure.subGestionesOperativas.push(operationalManagement)
    }else{
      items.push(operationalManagement);
    }
    return { ...state, items: items};
  }),

  on(OperationalManagementActions.removeFromList, (state, { id }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let operationalManagementToRemove = findOperationalManagement(id, items);
    let parentOperationalManagement = findOperationalManagement(operationalManagementToRemove.idPadre, items);
    if (parentOperationalManagement){
      reasingOrder(parentOperationalManagement.subGestionesOperativas, operationalManagementToRemove.orden, -1);
    }
    const filteredItems = filtrarNodosArbol (items, [id]);
    return { ...state, items: filteredItems};
  }),

  on(OperationalManagementActions.removeItemsFromList, (state, { operationalsManagementsIds }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    for (let id of operationalsManagementsIds){
      let operationalManagementToRemove = findOperationalManagement(id, items);
      let parent = findOperationalManagement(operationalManagementToRemove.idPadre, items);
      if (parent){
        reasingOrder(parent.subGestionesOperativas, operationalManagementToRemove.orden, -1);
      }
    }
    const filteredItems = filtrarNodosArbol (items, operationalsManagementsIds);
    return { ...state, items: filteredItems};
  }),

  on(OperationalManagementActions.updateItemIntoList, (state, { operationalManagement }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updated = findOperationalManagement(operationalManagement.id, items);
    let parent = findOperationalManagement(operationalManagement.idPadre, items);
    if (parent?.subGestionesOperativas.find( e => e.orden == operationalManagement.orden)){
      const previousOrder = updated?.orden;
      if (previousOrder != null){
        if (previousOrder >= operationalManagement.orden){
          reasingOrder(parent.subGestionesOperativas, operationalManagement.orden, 1, previousOrder);
        }else{
          reasingOrder(parent.subGestionesOperativas, previousOrder, -1, operationalManagement.orden);
        }
      }else{
        reasingOrder(parent.subGestionesOperativas, operationalManagement.orden, 1);
      }
    }
    if (updated){
      Object.assign(updated, JSON.parse(JSON.stringify(operationalManagement)));
    }
    return { ...state, items:items };
  }),

  on(OperationalManagementActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),


  on(OperationalManagementActions.addToExpandedNodes, (state, { id }) =>{
    return { ...state, expandedNodes:  [...state.expandedNodes, id],};
  }),


  on(OperationalManagementActions.removeFromExpandedNodes, (state, { id }) => {
    return { ...state, expandedNodes: state.expandedNodes.filter(item => item != id),};
  }),

  on(OperationalManagementActions.setOrderIsAscending, (state, { orderIsAscending }) => ({
    ...state,
    orderIsAscending: orderIsAscending,
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


export function findOperationalManagement(id: number, operationalsManagements: OperationalManagement[]): OperationalManagement{
  if (operationalsManagements && id){
    for (let e of operationalsManagements){
      if (id == e.id){
        return e;
      }else{
        let obj = findOperationalManagement(id, e.subGestionesOperativas);
        if (obj){return obj}
      }
    }
  }
  return null;
}

export function reasingOrder(operationalsManagements: OperationalManagement[], inferiorOrder: number, increment: number, superiorOrden?: number){
  operationalsManagements.forEach(e => {
    if (e.orden >= inferiorOrder && (superiorOrden == null || e.orden <= superiorOrden)){
      e.orden = e.orden + increment
    }
  })
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
