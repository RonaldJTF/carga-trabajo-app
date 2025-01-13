import { createAction, props } from "@ngrx/store";
import { OperationalManagement } from "@models";

export const setList = createAction('[Configuration of Operationals Managements] Set the list of operationals managements', props<{ operationalsManagements: OperationalManagement[] }>());
export const addToList = createAction('[Configuration of Operationals Managements] Add item to the list', props<{ operationalManagement: OperationalManagement }>());
export const removeFromList = createAction('[Configuration of Operationals Managements] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Operationals Managements] Remove items from list by id', props<{ operationalsManagementsIds: number[] }>());
export const updateItemIntoList = createAction('[Configuration of Operationals Managements] Update content of updated item in list', props<{ operationalManagement: OperationalManagement }>());
export const setMustRecharge = createAction('[Configuration of Operationals Managements] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const addToExpandedNodes= createAction('[Configuration of Operationals Managements] Add item to the list of expanded nodes', props<{ id: number }>());
export const removeFromExpandedNodes = createAction('[Configuration of Operationals Managements] Remove from the list of expanded nodes an element by its id', props<{ id: number }>());
export const setOrderIsAscending = createAction('[Configuration of Operationals Managements] Set the order of structures', props<{ orderIsAscending: boolean }>());
export const order = createAction('[Configuration of Operationals Managements] Order to operationals managements');
