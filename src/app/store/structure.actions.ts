import { createAction, props } from "@ngrx/store";
import {Activity, Structure} from "@models";

export const setList = createAction('[Configuration of Structures] Set the list of structures', props<{ structures: Structure[] }>());
export const addToList = createAction('[Configuration of Structures] Add item to the list', props<{ structure: Structure }>());
export const removeFromList = createAction('[Configuration of Structures] Remove from the list an element by its id', props<{ id: number }>());
export const setStructure = createAction('[Configuration of Structures]  Set the structure', props<{ structure: Structure }>());
export const setDependency = createAction('[Configuration of Structures]  Set the dependency', props<{ structure: Structure }>());
export const removeItemsFromList = createAction('[Configuration of Structures] Remove items from list by id', props<{ structureIds: number[] }>());
export const removeDependencyIfWasDeleted = createAction('[Configuration of Structures] Remove dependency if was removed', props<{ removedIds: number[] }>());
export const updateItemIntoList = createAction('[Configuration of Structures] Update content of updated item into list', props<{ structure: Structure }>());
export const setMustRecharge = createAction('[Configuration of Structures] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const addToExpandedNodes= createAction('[Configuration of Structures] Add item to the list of expanded nodes', props<{ id: number }>());
export const removeFromExpandedNodes = createAction('[Configuration of Structures] Remove from the list of expanded nodes an element by its id', props<{ id: number }>());
export const setActivityToStructure = createAction('[Configuration of Structures] Set information of activity to structure', props<{ activity: Activity }>());
export const removeActivityFromStructure = createAction('[Configuration of Structures] Remove from the Activity from structure', props<{ idStructure: number}>());
export const setOrderIsAscending = createAction('[Configuration of Structures] Set the order of structures', props<{ orderIsAscending: boolean }>());
export const order = createAction('[Configuration of Structures] Order to structures');

