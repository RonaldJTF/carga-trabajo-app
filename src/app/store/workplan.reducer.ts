import * as WorkplanActions from "./workplan.actions";
import {createReducer, on} from "@ngrx/store";
import {Stage, Workplan} from "../models/workplan";

export interface WorkplanState {
  items: Workplan[];
  item: Workplan;
  stages: Stage[];
  stage: Stage;
  mustRecharge: boolean;
  expandedNodes: any[];
}

export const initialState: WorkplanState = {
  items: [],
  item: new Workplan(),
  stages: [],
  stage: new Stage(),
  mustRecharge: true,
  expandedNodes: [],
};

export const workplanReducer = createReducer(
  initialState,

  on(WorkplanActions.setList, (state, { workplans }) => ({
    ...state,
    items: [...workplans ?? []],
  })),

  on(WorkplanActions.addToList, (state, { workplan }) =>{
    return { ...state,
      items:[...state.items, workplan]
    };
  }),

  on(WorkplanActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id !== id) };
  }),

  on(WorkplanActions.removeItemsFromList, (state, { workplanIds }) => {
    return { ...state, items: state.items.filter(e => !workplanIds?.some(o => o == e.id) ) };
  }),

  on(WorkplanActions.updateFromList, (state, { workplan }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === workplan.id);
    if (index !== -1){
      items[index] = workplan;
    }
    return { ...state, items:items};
  }),

  on(WorkplanActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),
  
  on(WorkplanActions.setItem, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),
);
