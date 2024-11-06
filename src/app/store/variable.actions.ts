import {createAction, props} from "@ngrx/store";
import {Variable} from "@models";

export const setList = createAction('[Configuration of Variable] Set the list of variables', props<{ variables: Variable[] }>());
export const addToList = createAction('[Configuration of Variable] Add item to the list', props<{ variable: Variable }>());
export const removeFromList = createAction('[Configuration of Variable] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Variable] Remove items from list by id', props<{ variableIds: number[] }>());
export const updateFromList = createAction('[Configuration of Variable] Update an item into list', props<{ variable: Variable }>());
export const setMustRecharge = createAction('[Configuration of Variable] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of Variable] set the item from list', props<{ id: number }>());