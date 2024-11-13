import {createReducer, on} from "@ngrx/store";
import {Compensation} from "@models";
import * as CompensationActions from "@store/compensation.actions";

export interface CompensationState {
  items: Compensation[];
  item: Compensation;
  mustRecharge: boolean;
}

export const initialState: CompensationState = {
  items: [],
  item: new Compensation(),
  mustRecharge: true,
};

export const compensationReducer = createReducer(
  initialState,

  on(CompensationActions.setList, (state, {compensations}) => ({
    ...state,
    items: [...compensations ?? []],
  })),

  on(CompensationActions.addToList, (state, {compensation}) => {
    return {
      ...state,
      items: [...state.items, compensation]
    };
  }),

  on(CompensationActions.removeFromList, (state, {id}) => {
    return {...state, items: state.items.filter(e => e.id != id)};
  }),

  on(CompensationActions.removeItemsFromList, (state, {compensationIds}) => {
    return {...state, items: state.items.filter(e => !compensationIds?.some(o => o == e.id))};
  }),

  on(CompensationActions.updateFromList, (state, {compensation}) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === compensation.id);
    if (index !== -1) {
      items[index] = compensation;
    }
    return {...state, items: items};
  }),

  on(CompensationActions.setMustRecharge, (state, {mustRecharge}) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(CompensationActions.setItemFromList, (state, {id}) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(CompensationActions.removeFromListWithCategoryId, (state, {categoryId}) => {
    return {...state, items: state.items.filter(e => e.idCategoria != categoryId)};
  }),
)
