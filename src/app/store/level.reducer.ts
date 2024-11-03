import * as LevelActions from "./level.actions";
import {createReducer, on} from "@ngrx/store";
import {Level, SalaryScale} from "@models";
import { FormArray, FormGroup, Validators } from "@angular/forms";
import { Methods } from "@utils";

export interface LevelState {
  items: Level[];
  item: Level;
  mustRecharge: boolean;
  salaryScales: SalaryScale[];
}

export const initialState: LevelState = {
  items: [],
  item: new Level(),
  mustRecharge: true,
  salaryScales: [],
};

export const levelReducer = createReducer(
  initialState,

  /*********************************************************************/
  /************************** SECTION OF LEVEL *************************/
  /*********************************************************************/
  on(LevelActions.setList, (state, { levels }) => ({
    ...state,
    items: [...levels ?? []],
  })),

  on(LevelActions.addToList, (state, { level }) =>{
    return { ...state,
      items:[...state.items, level]
    };
  }),

  on(LevelActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id !== id) };
  }),

  on(LevelActions.removeItemsFromList, (state, { levelIds }) => {
    return { ...state, items: state.items.filter(e => !levelIds?.some(o => o == e.id) ) };
  }),

  on(LevelActions.updateFromList, (state, { level }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === level.id);
    level.loaded = true;
    if (index !== -1){
      items[index] = level;
    }
    return { ...state, items:items};
  }),

  on(LevelActions.setItemFromList, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(LevelActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  /*********************************************************************/
  /********************** SECTION OF SALARY SCALE **********************/
  /*********************************************************************/

  on(LevelActions.updateSalaryScalesToLevel, (state, { levelId, salaryScales }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === levelId);
    if (index !== -1){
      items[index].escalasSalariales = salaryScales;
      items[index].loaded = true;
    }
    return { ...state, items:items};
  }),

  on(LevelActions.removeSalaryScaleToLevel, (state, { salaryScaleId }) => {
    const items = [...state.items];
    const level = findLevelToSalaryScale(salaryScaleId, items);
    if (level?.escalasSalariales){
      level.escalasSalariales = level.escalasSalariales.filter(e => e.id != salaryScaleId ) 
    }
    return {...state, items:items};
  }),

);


/**
 * Encuentra un nivel ocupacional que contiene la escala salarial (a través del id).
 * @param salaryScaleId 
 * @param levels 
 * @returns 
 */
function findLevelToSalaryScale(salaryScaleId: number, levels: Level[]) {
  for (const level of levels) {
    const index = level.escalasSalariales?.findIndex(salaryScale => salaryScale.id == salaryScaleId);
    if (index != undefined && index !== -1) {return level};
  }
  return null;
}
