import { createReducer, on } from "@ngrx/store";
import { Structure } from "../models/structure";
import * as StructureActions from "./structure.actions";

export interface StructureState {
  items: Structure[];
  item: Structure;
  dependency: Structure;
  mustRecharge: boolean;
  expandedNodes: any[];
}
  
export const initialState: StructureState = {
  items: [],
  item: new Structure(),
  dependency: new Structure(),
  mustRecharge: true,
  expandedNodes: [],
};

export const structureReducer = createReducer(
  initialState,

  on(StructureActions.setList, (state, { structures }) => ({
    ...state,
    items: [... structures ?? []],
  })),

  on(StructureActions.addToList, (state, { structure }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let parentStructure = findStructure(structure.idPadre, items);
    console.log(parentStructure)
    if (parentStructure){
      if (!parentStructure.subEstructuras){parentStructure.subEstructuras = []}
      parentStructure.subEstructuras.push(structure)
    }else{
      items.push(structure);
    }
    return { ...state, 
            items:[...items], 
            dependency: findStructure(state.dependency?.id, items)
          };  
  }), 


  on(StructureActions.removeFromList, (state, { id }) => {
    const items = filtrarNodosArbol (state.items, [id]);
    return { ...state, items: items, dependency: findStructure(state.dependency?.id, items)};
  }),


  on(StructureActions.setStructure, (state, { structure }) => {
    return { ...state, item: structure };
  }),


  on(StructureActions.setDependency, (state, { structure }) => {
    return { ...state, dependency: structure };
  }),


  on(StructureActions.removeItemsFromList, (state, { structureIds }) => {
    const items = filtrarNodosArbol (state.items, structureIds);
    return { ...state, items: items, dependency: findStructure(state.dependency?.id, items)};
  }),


  on(StructureActions.removeDependencyIfWasDeleted, (state, { removedIds }) => ({
    ...state, dependency: removedIds.includes(state.dependency?.id) ? new Structure() : state.dependency,
  })),

  on(StructureActions.updateItemIntoList, (state, { structure }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStructure = findStructure(structure.id, items);
    if (updatedStructure){
      Object.assign(updatedStructure, structure);
    }
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