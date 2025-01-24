import { createAction, props } from "@ngrx/store";
import { OperationalManagement, OrganizationChart } from "@models";

export const setList = createAction('[Configuration of Organization Chart] Set the list of Organization Charts', props<{ organizationCharts: OrganizationChart[] }>());
export const addToList = createAction('[Configuration of Organization Chart] Add item to the list', props<{ organizationChart: OrganizationChart }>());
export const removeFromList = createAction('[Configuration of Organization Chart] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Organization Chart] Remove items from list by id', props<{ organizationChartIds: number[] }>());
export const updateFromList = createAction('[Configuration of Organization Chart] Update content of updated item in list', props<{ organizationChart: OrganizationChart }>());
export const setMustRecharge = createAction('[Configuration of Organization Chart] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setOrganizationChart = createAction('[Configuration of Organization Chart] set the organization chart on we are working', props<{ organizationChart: OrganizationChart }>());
export const setViewMode = createAction('[Configuration of Organization Chart] set if organization charts must be showed as base structure or diagram', props<{ viewMode: 'base-structure' | 'diagram'}>());

export const setAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Set the list of assigned operationals managements', props<{ assignedOperationalsManagements: OperationalManagement[] }>());
export const addToAssignedOperationalsManagements = createAction('[Configuration of Operationals Managements] Add itemS to the list of assigned operationals managements', props<{ operationalsManagements: OperationalManagement[] }>());
export const removeFromAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Remove from the list of assigned operationals managements an element by its id', props<{ operationalManagementId: number }>());
export const removeItemsFromAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Remove items from list of assigned operationals managements by id', props<{ operationalsManagementsIds: number[] }>());

export const setNoAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Set the list of no-assigned operationals managements', props<{ noAssignedOperationalsManagements: OperationalManagement[] }>());
export const removeFromNoAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Remove from the list of no-assigned operationals managements an element by its id', props<{ operationalManagementId: number }>());
export const removeItemsFromNoAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] Remove items from list of no-assigned operationals managements by id', props<{ operationalsManagementsIds: number[] }>());
export const setMustRechargeNoAssignedOperationalsManagements = createAction('[Configuration of Organization Chart] set if list of no-assigned operationals managements must be recharged', props<{ mustRecharge: boolean }>());

export const addToOperationalManagementExpandedNodes= createAction('[Configuration of Organization Chart] Add item to the list of operational management expanded nodes', props<{ operationalManagementId: number }>());
export const removeFromOperationalManagementExpandedNodes = createAction('[Configuration of Organization Chart] Remove from the list of operational management expanded nodes an element by its id', props<{ operationalManagementId: number }>());
