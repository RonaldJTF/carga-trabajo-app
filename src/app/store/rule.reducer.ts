import * as RuleActions from "./rule.actions";
import {createReducer, on} from "@ngrx/store";
import {Rule} from "@models";

export interface RuleState {
  items: Rule[];
  item: Rule;
  mustRecharge: boolean;
}

export const initialState: RuleState = {
  items: [],
  item: new Rule(),
  mustRecharge: true,
};

export const ruleReducer = createReducer(
  initialState,

  on(RuleActions.setList, (state, { rules }) => ({
    ...state,
    items: [...rules ?? []],
  })),

  on(RuleActions.addToList, (state, { rule }) =>{
    return { ...state,
      items:[...state.items, rule]
    };
  }),

  on(RuleActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id != id) };
  }),

  on(RuleActions.removeItemsFromList, (state, { ruleIds }) => {
    return { ...state, items: state.items.filter(e => !ruleIds?.some(o => o == e.id) ) };
  }),

  on(RuleActions.updateFromList, (state, { rule }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === rule.id);
    if (index !== -1){
      items[index] = rule;
    }
    return { ...state, items:items};
  }),

  on(RuleActions.setItemFromList, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(RuleActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),
);