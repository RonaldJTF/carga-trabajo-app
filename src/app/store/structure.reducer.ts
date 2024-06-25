import { createReducer, on } from "@ngrx/store";
import { Structure } from "../models/structure";
import * as StructureActions from "./structure.actions";

export interface StructureState {
  items: Structure[];
  item: Structure;
  dependency: Structure;
  mustRecharge: boolean;
  expandedNodes: any[];
  orderIsAscending: boolean;
}

export const initialState: StructureState = {
  items: [],
  item: new Structure(),
  dependency: new Structure(),
  mustRecharge: true,
  expandedNodes: [],
  orderIsAscending: true,
};

export const structureReducer = createReducer(
  initialState,

  on(StructureActions.setList, (state, { structures }) => {
    let items =  JSON.parse(JSON.stringify(structures ?? []));
   return{
    ...state,
    items: items,
   }
  }),

  on(StructureActions.addToList, (state, { structure }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let parentStructure = findStructure(structure.idPadre, items);
    if (parentStructure){
      if (!parentStructure.subEstructuras){parentStructure.subEstructuras = []}
      if (parentStructure.subEstructuras.find( e => e.orden == structure.orden)){
        reasingOrder(parentStructure.subEstructuras, structure.orden, 1);
      }
      parentStructure.subEstructuras.push(structure)
      order(parentStructure.subEstructuras, state.orderIsAscending);
    }else{
      items.push(structure);
    }
    return { ...state,
            items:[...items],
            dependency: findStructure(state.dependency?.id, items)
          };
  }),


  on(StructureActions.removeFromList, (state, { id }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let structureToRemove = findStructure(id, items);
    let parentStructure = findStructure(structureToRemove.idPadre, items);
    if (parentStructure){
      reasingOrder(parentStructure.subEstructuras, structureToRemove.orden, -1);
      order(parentStructure.subEstructuras, state.orderIsAscending);
    }
    const filteredItems = filtrarNodosArbol (items, [id]);
    return { ...state, items: filteredItems, dependency: findStructure(state.dependency?.id, filteredItems)};
  }),


  on(StructureActions.setStructure, (state, { structure }) => {
    return { ...state, item: structure };
  }),


  on(StructureActions.setDependency, (state, { structure }) => {
    const dependency = JSON.parse(JSON.stringify(structure));
    order(dependency.subEstructuras, state.orderIsAscending);
    return { ...state, dependency: dependency };
  }),


  on(StructureActions.removeItemsFromList, (state, { structureIds }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    for (let id of structureIds){
      let structureToRemove = findStructure(id, items);
      let parentStructure = findStructure(structureToRemove.idPadre, items);
      if (parentStructure){
        reasingOrder(parentStructure.subEstructuras, structureToRemove.orden, -1);
        order(parentStructure.subEstructuras, state.orderIsAscending);
      }
    }

    const filteredItems = filtrarNodosArbol (items, structureIds);
    return { ...state, items: filteredItems, dependency: findStructure(state.dependency?.id, filteredItems)};
  }),


  on(StructureActions.removeDependencyIfWasDeleted, (state, { removedIds }) => ({
    ...state, dependency: removedIds.includes(state.dependency?.id) ? new Structure() : state.dependency,
  })),

  on(StructureActions.updateItemIntoList, (state, { structure }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStructure = findStructure(structure.id, items);
    let parentStructure = findStructure(structure.idPadre, items);
    if (parentStructure?.subEstructuras.find( e => e.orden == structure.orden)){
      const previousOrder = updatedStructure?.orden;
      if (previousOrder != null){
        if (previousOrder >= structure.orden){
          reasingOrder(parentStructure.subEstructuras, structure.orden, 1, previousOrder);
        }else{
          reasingOrder(parentStructure.subEstructuras, previousOrder, -1, structure.orden);
        }
      }else{
        reasingOrder(parentStructure.subEstructuras, structure.orden, 1);
      }
    }
    if (updatedStructure){
      Object.assign(updatedStructure, JSON.parse(JSON.stringify(structure)));
    }
        
    order(parentStructure?.subEstructuras, state.orderIsAscending);

    return { ...state,
            items:items,
            dependency: findStructure(state.dependency?.id, items)
          };
  }),

  on(StructureActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),


  on(StructureActions.addToExpandedNodes, (state, { id }) =>{
    return { ...state, expandedNodes:  [...state.expandedNodes, id],};
  }),


  on(StructureActions.removeFromExpandedNodes, (state, { id }) => {
    return { ...state, expandedNodes: state.expandedNodes.filter(item => item != id),};
  }),


  on(StructureActions.setActivityToStructure, (state, { activity }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStructure = findStructure(activity.idEstructura, items);
    if (updatedStructure){
      if (!updatedStructure.actividad){
        updatedStructure.actividad = activity;
      }else{
        Object.assign(updatedStructure.actividad, activity);
      }
    }
    return { ...state,
            items:items,
            dependency: findStructure(state.dependency?.id, items)
          };
  }),


  on(StructureActions.removeActivityFromStructure, (state, { idStructure }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStructure = findStructure(idStructure, items);
    if (updatedStructure){
      updatedStructure.actividad = null;
    }
    return { ...state,
            items:items,
            dependency: findStructure(state.dependency?.id, items)
          };
  }),

  on(StructureActions.setOrderIsAscending, (state, { orderIsAscending }) => ({
    ...state,
    orderIsAscending: orderIsAscending,
  })),

  on(StructureActions.order, (state) => {
    const item = JSON.parse(JSON.stringify(state.dependency));
    order(item.subEstructuras, state.orderIsAscending);
    return {
      ...state,
      dependency: item
    }
  }),
);


function filtrarNodosArbol(listaNodos: Structure[], idsAEliminar:number[]) {
  const listaFiltrada = JSON.parse(JSON.stringify(listaNodos));
  for (let i = listaFiltrada.length - 1; i >= 0; i--) {
    const nodo = listaFiltrada[i];
    if (idsAEliminar.includes(nodo.id)) {
        listaFiltrada.splice(i, 1);
    }
    else if (nodo.subEstructuras) {
        nodo.subEstructuras = filtrarNodosArbol(nodo.subEstructuras, idsAEliminar);
        if (nodo.subEstructuras.length === 0) {
            delete nodo.subEstructuras;
        }
    }
  }
  return listaFiltrada;
}


function findStructure(id: number, structures: Structure[]): Structure{
  if (structures && id){
    for (let e of structures){
      if (id == e.id){
        return e;
      }else{
        let obj = findStructure(id, e.subEstructuras);
        if (obj){return obj}
      }
    }
  }
  return null;
}

function reasingOrder(structures: Structure[], inferiorOrder: number, increment: number, superiorOrden?: number){
  structures.forEach(e => {
    if (e.orden >= inferiorOrder && (superiorOrden == null || e.orden <= superiorOrden)){
      e.orden = e.orden + increment
    }
  })
}

function order(structures: Structure[], isAscending: boolean) {
  if (!structures?.length) {
    return;
  }
  structures.sort((a, b) => {
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
  structures.forEach(e => order(e.subEstructuras, isAscending));
}
