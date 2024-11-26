import {createReducer, on} from "@ngrx/store";
import {Level, LevelCompensation, ValueByRule} from "@models";
import * as LevelCompensationActions from "@store/levelCompensation.actions";

export interface LevelCompensationState {
  items: LevelCompensation[];
  item: LevelCompensation;
  mustRecharge: boolean;
  level: Level;
}

export const initialState: LevelCompensationState = {
  items: [],
  item: new LevelCompensation(),
  mustRecharge: true,
  level: new Level(),
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

  on(LevelCompensationActions.updateValuesByRulesToLevelCompensation, (state, { levelCompensationId, valuesByRules }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === levelCompensationId);
    if (index !== -1){
      items[index].valoresCompensacionLabNivelVigencia = valuesByRules;
      items[index].loaded = true;
    }
    return { ...state, items:items};
  }),

  on(LevelCompensationActions.removeValueByRuleToLevelCompensation, (state, { valueByRuleId }) => {
    const items = [...state.items];
    const levelCompensation = findLevelCompensationToValueByRule(valueByRuleId, items);
    if (levelCompensation?.valoresCompensacionLabNivelVigencia){
      levelCompensation.valoresCompensacionLabNivelVigencia = levelCompensation.valoresCompensacionLabNivelVigencia.filter(e => e.id != valueByRuleId ) 
    }
    return {...state, items:items};
  }),

  on(LevelCompensationActions.setLevelOnWorking, (state, {level}) => ({
    ...state,
    level: level
  })),
)


/**
 * Encuentra el levelCompensation que contiene el valueByRule (a través del id).
 * @param valueByRuleId 
 * @param valuesByRules 
 * @returns 
 */
function findLevelCompensationToValueByRule(valueByRuleId: number, levelCompensations: LevelCompensation[]) {
  for (const levelCompensation of levelCompensations) {
    const index = levelCompensation.valoresCompensacionLabNivelVigencia?.findIndex(e => e.id == valueByRuleId);
    if (index != undefined && index !== -1) {return levelCompensation};
  }
  return null;
}

