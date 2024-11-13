import {createAction, props} from "@ngrx/store";
import {Compensation} from "@models";

export const setList = createAction('[Configuration of Compensation] Set the list of compensations', props<{ compensations: Compensation[] }>());
export const addToList = createAction('[Configuration of Compensation] Add item to the compensation', props<{ compensation: Compensation }>());
export const removeFromList = createAction('[Configuration of Compensation] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Compensation] Remove items from list by id', props<{ compensationIds: number[] }>());
export const updateFromList = createAction('[Configuration of Compensation] Update an item into list', props<{ compensation: Compensation }>());
export const setMustRecharge = createAction('[Configuration of Compensation] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of Compensation] set the item from list', props<{ id: number }>());

export const removeFromListWithCategoryId = createAction('[Configuration of Compensation] Remove from the list all compensations by categoryId', props<{ categoryId: number }>());