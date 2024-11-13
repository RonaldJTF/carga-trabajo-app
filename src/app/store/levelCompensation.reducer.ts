import {createReducer, on} from "@ngrx/store";
import {LevelCompensation} from "@models";
import * as LevelCompensationActions from "@store/levelCompensation.actions";

export interface LevelCompensationState {
  items: LevelCompensation[];
  item: LevelCompensation;
  mustRecharge: boolean;
}

export const initialState: LevelCompensationState = {
  items: [],
  item: new LevelCompensation(),
  mustRecharge: true,
};

export const levelCompensationReducer = createReducer(
  initialState,

  on(LevelCompensationActions.setList, (state, {levelCompensations}) => ({
    ...state,
    items: [...levelCompensations ?? []],
  })),

  on(LevelCompensationActions.addToList, (state, {levelCompensation}) => {
    return {
      ...state,
      items: [...state.items, levelCompensation]
    };
  }),

  on(LevelCompensationActions.removeFromList, (state, {id}) => {
    return {...state, items: state.items.filter(e => e.id != id)};
  }),

  on(LevelCompensationActions.removeItemsFromList, (state, {levelCompensationIds}) => {
    return {...state, items: state.items.filter(e => !levelCompensationIds?.some(o => o == e.id))};
  }),

  on(LevelCompensationActions.updateFromList, (state, {levelCompensation}) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === levelCompensation.id);
    if (index !== -1) {
      items[index] = levelCompensation;
    }
    return {...state, items: items};
  }),

  on(LevelCompensationActions.setMustRecharge, (state, {mustRecharge}) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(LevelCompensationActions.setItemFromList, (state, {id}) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),
)
