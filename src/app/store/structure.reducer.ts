import { createReducer, on } from "@ngrx/store";
import { Structure } from "@models";
import * as StructureActions from "./structure.actions";
import _ from 'lodash'; //Usada para clonar conservando la estructura del objeto, por ejemplo, el orden en que se encuentran en una lista, etc.

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
    }else{
      items.push(structure);
    }
    const dependency = findStructure(state.dependency?.id, items);
    order(dependency?.subEstructuras, state.orderIsAscending);
    return { ...state,
            items: items,
            dependency: dependency
          };
  }),


  on(StructureActions.removeFromList, (state, { id }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let structureToRemove = findStructure(id, items);
    let parentStructure = findStructure(structureToRemove.idPadre, items);
    if (parentStructure){
      reasingOrder(parentStructure.subEstructuras, structureToRemove.orden, -1);
    }
    const filteredItems = filtrarNodosArbol (items, [id]);
    const dependency = findStructure(state.dependency?.id, filteredItems);
    order(dependency?.subEstructuras, state.orderIsAscending);
    return { ...state, items: filteredItems, dependency: dependency};
  }),


  on(StructureActions.setStructure, (state, { structure }) => {
    return { ...state, item: structure };
  }),


  on(StructureActions.setDependency, (state, { structure, hasLoadedInformation }) => {
    const dependency = JSON.parse(JSON.stringify(structure));
    order(dependency.subEstructuras, state.orderIsAscending);
    const items = _.cloneDeep(state.items);
    if (!hasLoadedInformation){
      Object.assign(findStructure(dependency.id, items), dependency);
    }
    return { ...state, items: items, dependency: dependency };
  }),


  on(StructureActions.removeItemsFromList, (state, { structureIds }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    for (let id of structureIds){
      let structureToRemove = findStructure(id, items);
      let parentStructure = findStructure(structureToRemove.idPadre, items);
      if (parentStructure){
        reasingOrder(parentStructure.subEstructuras, structureToRemove.orden, -1);
      }
    }
    const filteredItems = filtrarNodosArbol (items, structureIds);
    const dependency = findStructure(state.dependency?.id, filteredItems);
    order(dependency?.subEstructuras, state.orderIsAscending);
    return { ...state, items: filteredItems, dependency: dependency};
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
    const dependency = findStructure(state.dependency?.id, items);
    order(dependency?.subEstructuras, state.orderIsAscending);
    return { ...state,
            items:items,
            dependency: dependency
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
    const items = _.cloneDeep(state.items);
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
    const items = _.cloneDeep(state.items);
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
    const items = JSON.parse(JSON.stringify(state.items));
    const dependency = findStructure(state.dependency?.id, items);
    order(dependency?.subEstructuras, state.orderIsAscending);
    return {
      ...state,
      items: items,
      dependency: dependency
    }
  }),

  on(StructureActions.moveStructureTo, (state, {structure, newParentId}) => {
    const items = JSON.parse(JSON.stringify(state.items));
    const filteredItems = filtrarNodosArbol (items, [structure.id]);

    let parentStructure = findStructure(newParentId, filteredItems);
    if (!parentStructure.subEstructuras){parentStructure.subEstructuras = []}
    parentStructure.subEstructuras.push(structure)
    const dependency = findStructure(state.dependency?.id, filteredItems);
    return {
      ...state,
      items: filteredItems,
      dependency: dependency
    }
  }),

  on(StructureActions.copyStructureTo, (state, {structure, newParentId}) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let parentStructure = findStructure(newParentId, items);
    if (!parentStructure.subEstructuras){parentStructure.subEstructuras = []}
    parentStructure.subEstructuras.push(structure)
    const dependency = findStructure(state.dependency?.id, items);
    return {
      ...state,
      items: items,
      dependency: dependency
    }
  }),

  on(StructureActions.relaodStructuresInStore, (state) => {
    const items = JSON.parse(JSON.stringify(state.items));
    const dependency = findStructure(state.dependency?.id, items);
    return {
      ...state,
      items: items,
      dependency: dependency
    }
  }),

);


export function filtrarNodosArbol(listaNodos: Structure[], idsAEliminar:number[]) {
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


export function findStructure(id: number, structures: Structure[]): Structure{
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

export function reasingOrder(structures: Structure[], inferiorOrder: number, increment: number, superiorOrden?: number){
  structures.forEach(e => {
    if (e.orden >= inferiorOrder && (superiorOrden == null || e.orden <= superiorOrden)){
      e.orden = e.orden + increment
    }
  })
}

export function order(structures: Structure[], isAscending: boolean) {
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
