import { createReducer, on } from "@ngrx/store";
import { Hierarchy } from "@models";
import * as HierarchyActions from "./hierarchy.actions";
import _ from 'lodash'; //Usada para clonar conservando la estructura del objeto, por ejemplo, el orden en que se encuentran en una lista, etc.

export interface HierarchyState {
  items: Hierarchy[];
  item: Hierarchy;
  mustRecharge: boolean;
  orderIsAscending: boolean;
}

export const initialState: HierarchyState = {
  items: [],
  item: new Hierarchy(),
  mustRecharge: true,
  orderIsAscending: true,
};

export const hierarchyReducer = createReducer(
  initialState,

  on(HierarchyActions.setList, (state, { hierarchies }) => ({
    ...state,
    items: [...hierarchies ?? []],
  })),

  on(HierarchyActions.addToList, (state, { hierarchy }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let parentHierarchy = findHierarchy(hierarchy.idPadre, items);
    if (parentHierarchy){
      if (!parentHierarchy.subJerarquias){parentHierarchy.subJerarquias = []}
      if (parentHierarchy.subJerarquias.find( e => e.orden == hierarchy.orden)){
        reasingOrder(parentHierarchy.subJerarquias, hierarchy.orden, 1);
      }
      parentHierarchy.subJerarquias.push(hierarchy)
    }else{
      if (items.find( e => e.orden == hierarchy.orden)){
        reasingOrder(items, hierarchy.orden, 1);
      }
      items.push(hierarchy);
    }
    order(items, state.orderIsAscending);
    return { ...state, items: items};
  }),

  on(HierarchyActions.removeFromList, (state, { id }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let hierarchyToRemove = findHierarchy(id, items);
    let parentHierarchy = findHierarchy(hierarchyToRemove.idPadre, items);
    if (parentHierarchy){
      reasingOrder(parentHierarchy.subJerarquias, hierarchyToRemove.orden, -1);
    }else{
      reasingOrder(items, hierarchyToRemove.orden, -1);
    }
    const filteredItems = filtrarNodosArbol (items, [id]);
    order(filteredItems, state.orderIsAscending);
    return { ...state, items: filteredItems};
  }),

  on(HierarchyActions.removeItemsFromList, (state, { hierarchyIds }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    for (let id of hierarchyIds){
      let hierarchyToRemove = findHierarchy(id, items);
      let parent = findHierarchy(hierarchyToRemove.idPadre, items);
      if (parent){
        reasingOrder(parent.subJerarquias, hierarchyToRemove.orden, -1);
      }else{
        reasingOrder(items, hierarchyToRemove.orden, -1);
      }
    }
    const filteredItems = filtrarNodosArbol (items, hierarchyIds);
    order(filteredItems, state.orderIsAscending);
    return { ...state, items: filteredItems};
  }),

  on(HierarchyActions.updateFromList, (state, { hierarchy }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updated = findHierarchy(hierarchy.id, items);
    let parent = findHierarchy(hierarchy.idPadre, items);

    const list = parent ? parent?.subJerarquias : items;

    if (list.find( e => e.orden == hierarchy.orden)){
      const previousOrder = updated?.orden;
      if (previousOrder != null){
        if (previousOrder >= hierarchy.orden){
          reasingOrder(list, hierarchy.orden, 1, previousOrder);
        }else{
          reasingOrder(list, previousOrder, -1, hierarchy.orden);
        }
      }else{
        reasingOrder(list, hierarchy.orden, 1);
      }
    }

    if (updated){
      Object.assign(updated, JSON.parse(JSON.stringify(hierarchy)));
    }
    order(items, state.orderIsAscending);
    return { ...state, items:items };
  }),

  on(HierarchyActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(HierarchyActions.setHierarchy, (state, { hierarchy }) => ({
    ...state,
    item: hierarchy,
  })),
);


export function filtrarNodosArbol(listaNodos: Hierarchy[], idsAEliminar:number[]) {
  const listaFiltrada = JSON.parse(JSON.stringify(listaNodos));
  for (let i = listaFiltrada.length - 1; i >= 0; i--) {
    const nodo = listaFiltrada[i];
    if (idsAEliminar.includes(nodo.id)) {
        listaFiltrada.splice(i, 1);
    }
    else if (nodo.subJerarquias) {
        nodo.subJerarquias = filtrarNodosArbol(nodo.subJerarquias, idsAEliminar);
        if (nodo.subJerarquias.length === 0) {
          delete nodo.subJerarquias;
        }
    }
  }
  return listaFiltrada;
}


export function findHierarchy(id: number, hierarchies: Hierarchy[]): Hierarchy{
  if (hierarchies && id){
    for (let e of hierarchies){
      if (id == e.id){
        return e;
      }else{
        let obj = findHierarchy(id, e.subJerarquias);
        if (obj){return obj}
      }
    }
  }
  return null;
}

export function reasingOrder(hierarchies: Hierarchy[], inferiorOrder: number, increment: number, superiorOrden?: number){
  hierarchies.forEach(e => {
    if (e.orden >= inferiorOrder && (superiorOrden == null || e.orden <= superiorOrden)){
      e.orden = e.orden + increment
    }
  })
}

export function order(hierarchies: Hierarchy[], isAscending: boolean) {
  if (!hierarchies?.length) {
    return;
  }
  hierarchies.sort((a, b) => {
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
  hierarchies.forEach(e => order(e.subJerarquias, isAscending));
}