import { createAction, props } from "@ngrx/store";
import { OrganizationChart } from "@models";

export const setList = createAction('[Configuration of Organization Chart] Set the list of Organization Charts', props<{ organizationCharts: OrganizationChart[] }>());
export const addToList = createAction('[Configuration of Organization Chart] Add item to the list', props<{ organizationChart: OrganizationChart }>());
export const removeFromList = createAction('[Configuration of Organization Chart] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Organization Chart] Remove items from list by id', props<{ organizationChartIds: number[] }>());
export const updateFromList = createAction('[Configuration of Organization Chart] Update content of updated item in list', props<{ organizationChart: OrganizationChart }>());
export const setMustRecharge = createAction('[Configuration of Organization Chart] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setOrganizationChart = createAction('[Configuration of Organization Chart] set the organization chart on we are working', props<{ organizationChart: OrganizationChart }>());