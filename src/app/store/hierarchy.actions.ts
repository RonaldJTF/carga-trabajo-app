import { createAction, props } from "@ngrx/store";
import { Hierarchy } from "@models";

export const setList = createAction('[Configuration of Hierarchy] Set the list of Hierarchies', props<{ hierarchies: Hierarchy[] }>());
export const addToList = createAction('[Configuration of Hierarchy] Add item to the list', props<{ hierarchy: Hierarchy }>());
export const removeFromList = createAction('[Configuration of Hierarchy] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Hierarchy] Remove items from list by id', props<{ hierarchyIds: number[] }>());
export const updateFromList = createAction('[Configuration of Hierarchy] Update content of updated item in list', props<{ hierarchy: Hierarchy }>());
export const setMustRecharge = createAction('[Configuration of Hierarchy] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setHierarchy = createAction('[Configuration of Hierarchy] set the organization chart on we are working', props<{ hierarchy: Hierarchy }>());