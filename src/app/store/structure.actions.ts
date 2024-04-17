import { createAction, props } from "@ngrx/store";
import { Structure } from "../models/structure";

export const setList = createAction('[Configuration of Structures] Set the list of structures', props<{ structures: Structure[] }>());
export const addToList = createAction('[Configuration of Structures] Add item to the list', props<{ structure: Structure }>());
export const removeFromList = createAction('[Configuration of Structures] Remove from the list an element by its id', props<{ id: number }>());
export const setStructure = createAction('[Configuration of Structures]  Set the structure', props<{ structure: Structure }>());
export const setDependency = createAction('[Configuration of Structures]  Set the dependency', props<{ structure: Structure }>());
export const removeItemsFromList = createAction('[Configuration of Structures] Remove items from list by id', props<{ structureIds: number[] }>());
export const removeDependencyIfWasDeleted = createAction('[Configuration of Structures] Remove dependency if was removed', props<{ removedIds: number[] }>());
