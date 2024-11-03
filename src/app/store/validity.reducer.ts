import * as ValidityActions from "./validity.actions";
import {createReducer, on} from "@ngrx/store";
import {Validity, SalaryScale} from "@models";

export interface ValidityState {
  items: Validity[];
  item: Validity;
  mustRecharge: boolean;
  salaryScales: SalaryScale[];
}

export const initialState: ValidityState = {
  items: [],
  item: new Validity(),
  mustRecharge: true,
  salaryScales: [],
};

export const validityReducer = createReducer(
  initialState,

  on(ValidityActions.setList, (state, { validities }) => ({
    ...state,
    items: [...validities ?? []],
  })),

  on(ValidityActions.addToList, (state, { validity }) =>{
    return { ...state,
      items:[...state.items, validity]
    };
  }),

  on(ValidityActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id !== id) };
  }),

  on(ValidityActions.removeItemsFromList, (state, { validityIds }) => {
    return { ...state, items: state.items.filter(e => !validityIds?.some(o => o == e.id) ) };
  }),

  on(ValidityActions.updateFromList, (state, { validity }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === validity.id);
    if (index !== -1){
      items[index] = validity;
    }
    return { ...state, items:items};
  }),

  on(ValidityActions.setItemFromList, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(ValidityActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(ValidityActions.removeValueInValidityToValidity, (state, { valueInValidityId }) => {
    const items = [...state.items];
    const valueInValidity = findValidityToValueInValidity(valueInValidityId, items);
    if (valueInValidity?.valoresVigencia){
      valueInValidity.valoresVigencia = valueInValidity.valoresVigencia.filter(e => e.id != valueInValidityId ) 
    }
    return {...state, items:items};
  }),

);


/**
 * Encuentra la vigencia que contiene el valor de la vigencia (a través del id).
 * @param valueInValidity 
 * @param validities 
 * @returns 
 */
function findValidityToValueInValidity(valueInValidity: number, validities: Validity[]) {
  for (const validity of validities) {
    const index = validity.valoresVigencia?.findIndex(e => e.id == valueInValidity);
    if (index != undefined && index !== -1) {return validity};
  }
  return null;
}
