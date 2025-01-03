import {createAction, props} from "@ngrx/store";
import {Appointment, Structure} from "@models";

export const setList = createAction('[Configuration of Appointment] Set the list of appointments', props<{ appointments: Appointment[] }>());
export const addToList = createAction('[Configuration of Appointment] Add item to the list', props<{ appointment: Appointment }>());
export const removeFromList = createAction('[Configuration of Appointment] Remove from the list an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Appointment] Remove items from list by id', props<{ appointmentIds: number[] }>());
export const updateFromList = createAction('[Configuration of Appointment] Update an item in list', props<{ appointment: Appointment }>());
export const setMustRecharge = createAction('[Configuration of Appointment] set if list must be recharged', props<{ mustRecharge: boolean }>());
export const setItemFromList = createAction('[Configuration of Appointment] set the item from list', props<{ id: number }>());

export const addToExpandedNodes= createAction('[Configuration of Appointments] Add item to the list of expanded nodes', props<{ key: string }>());
export const removeFromExpandedNodes = createAction('[Configuration of Appointments] Remove from the list of expanded nodes an element by its key', props<{ key: string }>());
export const reloadAppointmentsInStore = createAction('[Configuration of Appointment] reload list of appointments');
export const setInformationGroup = createAction('[Configuration of Appointment] set the information group of appointments', props<{ informationGroup: any }>());
export const setStructureOnWorking = createAction('[Configuration of Appointment] set the structure we are working on', props<{ structure: Structure }>());
export const setConfirmedFilters = createAction('[Configuration of Appointment] set the confirmed filter we are working on', props<{ confirmedFilters: any }>());
export const removeConfirmedFilter = createAction('[Configuration of Appointment] remove a confirmed filter', props<{ key: string, index: number }>());
export const setViewMode = createAction('[Configuration of Appointment] set if appointmets must be showed as list or chart', props<{ viewMode: 'list' | 'chart'}>());
