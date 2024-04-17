import { createReducer, on } from "@ngrx/store";
import { Structure } from "../models/structure";
import * as StructureActions from "./structure.actions";

export interface StructureState {
  items: Structure[];
  item: Structure;
  dependency: Structure;
}
  
export const initialState: StructureState = {
  items: [],
  item: new Structure(),
  dependency: new Structure(),
};

export const structureReducer = createReducer(
  initialState,

  on(StructureActions.setList, (state, { structures }) => ({
    ...state,
    items: [... structures ?? []],
  })),


  on(StructureActions.addToList, (state, { structure }) => ({
    ...state,
    items: [...state.items, structure],
  })),


  on(StructureActions.removeFromList, (state, { id }) => {
    return { ...state, items: filtrarNodosArbol (state.items, [id])};
  }),


  on(StructureActions.setStructure, (state, { structure }) => {
    return { ...state, item: structure };
  }),


  on(StructureActions.setDependency, (state, { structure }) => {
    return { ...state, dependency: structure };
  }),


  on(StructureActions.removeItemsFromList, (state, { structureIds }) => {
    return { ...state, items: filtrarNodosArbol (state.items, structureIds)};
  }),


  on(StructureActions.removeDependencyIfWasDeleted, (state, { removedIds }) => ({
    ...state, dependency: removedIds.includes(state.dependency.id) ? new Structure() : state.dependency,
  })),
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