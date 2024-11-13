import {createAction, props} from "@ngrx/store";
import {LevelCompensation} from "@models";

export const setList = createAction('[Configuration of LevelCompensation] Set the list of compensations', props<{ levelCompensations: LevelCompensation[] }>());
export const addToList = createAction('[Configuration of LevelCompensation] Add item to the compensation', props<{ levelCompensation: LevelCompensation }>());
export const removeFromList = createAction('[Configuration of LevelCompensation] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of LevelCompensation] Remove items from list by id', props<{ levelCompensationIds: number[] }>());
export const updateFromList = createAction('[Configuration of LevelCompensation] Update an item into list', props<{ levelCompensation: LevelCompensation }>());
export const setMustRecharge = createAction('[Configuration of LevelCompensation] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of LevelCompensation] set the item from list', props<{ id: number }>());