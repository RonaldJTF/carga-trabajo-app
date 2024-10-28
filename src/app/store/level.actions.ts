import {createAction, props} from "@ngrx/store";
import {Level, SalaryScale} from "@models";

export const setList = createAction('[Configuration of Level] Set the list of levels', props<{ levels: Level[] }>());
export const addToList = createAction('[Configuration of Level] Add item to the list', props<{ level: Level }>());
export const removeFromList = createAction('[Configuration of Level] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Level] Remove items from list by id', props<{ levelIds: number[] }>());
export const updateFromList = createAction('[Configuration of Level] Update an item into list', props<{ level: Level }>());
export const setMustRecharge = createAction('[Configuration of Level] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of level] set the item from list', props<{ id: number }>());

export const updateSalaryScalesToLevel = createAction('[Configuration of Level] Update the salary scales to item into list', props<{ levelId: number, salaryScales: SalaryScale[] }>());
export const removeSalaryScaleToLevel = createAction('[Configuration of Level] Remove a salary scale by id to a level into list', props<{ salaryScaleId: number }>());
