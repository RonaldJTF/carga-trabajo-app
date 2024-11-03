import {createAction, props} from "@ngrx/store";
import {Validity} from "@models";

export const setList = createAction('[Configuration of Validity] Set the list of Validities', props<{ validities: Validity[] }>());
export const addToList = createAction('[Configuration of Validity] Add item to the list', props<{ validity: Validity }>());
export const removeFromList = createAction('[Configuration of Validity] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Validity] Remove items from list by id', props<{ validityIds: number[] }>());
export const updateFromList = createAction('[Configuration of Validity] Update an item into list', props<{ validity: Validity }>());
export const setMustRecharge = createAction('[Configuration of Validity] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of Validity] set the item from list', props<{ id: number }>());

export const removeValueInValidityToValidity = createAction('[Configuration of Validity] Remove a value in validity by id to a validity into list', props<{ valueInValidityId: number }>());