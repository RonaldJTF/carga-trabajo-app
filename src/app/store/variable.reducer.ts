import * as VariableActions from "./variable.actions";
import {createReducer, on} from "@ngrx/store";
import {Variable} from "@models";

export interface VariableState {
  items: Variable[];
  item: Variable;
  mustRecharge: boolean;
}

export const initialState: VariableState = {
  items: [],
  item: new Variable(),
  mustRecharge: true,
};

export const variableReducer = createReducer(
  initialState,

  on(VariableActions.setList, (state, { variables }) => ({
    ...state,
    items: [...variables ?? []],
  })),

  on(VariableActions.addToList, (state, { variable }) =>{
    return { ...state,
      items:[...state.items, variable]
    };
  }),

  on(VariableActions.removeFromList, (state, { id }) => {
    const items = [...state.items];
    const ids = [];
    getAllRelatedVariables(items, [id], ids)
    return { ...state, items: state.items.filter(e => !ids.includes(e.id)) };
  }),

  on(VariableActions.removeItemsFromList, (state, { variableIds }) => {
    const items = [...state.items];
    const ids = [];
    getAllRelatedVariables(items, variableIds, ids)
    return { ...state, items: state.items.filter(e => !ids?.some(o => o == e.id) ) };
  }),

  on(VariableActions.updateFromList, (state, { variable }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === variable.id);
    if (index !== -1){
      items[index] = variable;
    }
    return { ...state, items:items};
  }),

  on(VariableActions.setItemFromList, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(VariableActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),
);

function getAllRelatedVariables(variables: Variable[], relatedIds: number[], allRelatedIds: any) {
  if (!relatedIds){
    return;
  }
  for (const currentId of relatedIds){
    allRelatedIds.push(currentId);
    const related = variables.filter(v => v.valor?.includes(`$[${currentId}]`));
    getAllRelatedVariables(variables, related.map(e=>e.id), allRelatedIds);
  }
}