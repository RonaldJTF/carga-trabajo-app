import {createAction, props} from "@ngrx/store";
import {Rule} from "@models";

export const setList = createAction('[Configuration of Rule] Set the list of Rules', props<{ rules: Rule[] }>());
export const addToList = createAction('[Configuration of Rule] Add item to the list', props<{ rule: Rule }>());
export const removeFromList = createAction('[Configuration of Rule] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Rule] Remove items from list by id', props<{ ruleIds: number[] }>());
export const updateFromList = createAction('[Configuration of Rule] Update an item into list', props<{ rule: Rule }>());
export const setMustRecharge = createAction('[Configuration of Rule] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of Rule] set the item from list', props<{ id: number }>());