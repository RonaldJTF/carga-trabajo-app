import {createAction, props} from "@ngrx/store";
import {Workplan} from "@models";

export const setList = createAction('[Configuration of Workplan] Set the list of workplans', props<{ workplans: Workplan[] }>());
export const addToList = createAction('[Configuration of Workplan] Add item to the list', props<{ workplan: Workplan }>());
export const removeFromList = createAction('[Configuration of Workplan] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Workplan] Remove items from list by id', props<{ workplanIds: number[] }>());
export const updateFromList = createAction('[Configuration of Workplan] Update an item in list', props<{ workplan: Workplan }>());
export const setMustRecharge = createAction('[Configuration of Workplan] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItem = createAction('[Configuration of Workplan] set the item from list', props<{ id: number }>());
