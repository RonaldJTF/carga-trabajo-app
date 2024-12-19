import { Appointment, Structure } from "@models";
import * as AppointmentActions from "./appointment.actions";
import {createReducer, on} from "@ngrx/store";

export interface AppointmentState {
  items: Appointment[];
  item: Appointment;
  expandedNodes: any[];
  mustRecharge: boolean;
  structure: Structure;
  informationGroup: any;
  confirmedFilters: any;
  viewMode: 'list' | 'chart';
}

export const initialState: AppointmentState = {
  items: [],
  item: new Appointment(),
  expandedNodes: [],
  mustRecharge: true,
  structure: null,
  informationGroup: null,
  confirmedFilters: null,
  viewMode: 'list'
};

export const appointmentReducer = createReducer(
  initialState,

  on(AppointmentActions.setList, (state, { appointments }) => ({
    ...state,
    items: [...appointments ?? []],
  })),

  on(AppointmentActions.addToList, (state, { appointment }) =>{
    return { ...state,
      items:[...state.items, appointment]
    };
  }),

  on(AppointmentActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id !== id) };
  }),

  on(AppointmentActions.removeItemsFromList, (state, { appointmentIds }) => {
    return { ...state, items: state.items.filter(e => !appointmentIds?.some(o => o == e.id) ) };
  }),

  on(AppointmentActions.updateFromList, (state, { appointment }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === appointment.id);
    if (index !== -1){
      items[index] = appointment;
    }
    return { ...state, items:items};
  }),

  on(AppointmentActions.setItemFromList, (state, { id }) => ({
    ...state,
    item: JSON.parse(JSON.stringify(state.items.find(item => item.id == id)))
  })),

  on(AppointmentActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(AppointmentActions.addToExpandedNodes, (state, { key }) =>{
    return { ...state, expandedNodes:  [...state.expandedNodes, key],};
  }),

  on(AppointmentActions.removeFromExpandedNodes, (state, { key }) => {
    return { ...state, expandedNodes: state.expandedNodes.filter(item => item != key),};
  }),

  on(AppointmentActions.reloadAppointmentsInStore, (state) => {
    return { ...state, items: JSON.parse(JSON.stringify(state.items))};
  }),

  on(AppointmentActions.setInformationGroup, (state, { informationGroup }) => ({
    ...state,
    informationGroup: informationGroup,
  })),

  on(AppointmentActions.setStructureOnWorking, (state, {structure}) => ({
    ...state,
    structure: structure
  })),

  on(AppointmentActions.setConfirmedFilters, (state, {confirmedFilters}) => ({
    ...state,
    confirmedFilters: confirmedFilters
  })),

  on(AppointmentActions.removeConfirmedFilter, (state, { key, index }) => {
    const confirmedFilters = JSON.parse(JSON.stringify(state.confirmedFilters)) 
    confirmedFilters[key].splice(index, 1);
    return { ...state, confirmedFilters: confirmedFilters};
  }),

  on(AppointmentActions.setViewMode, (state, { viewMode }) => ({
    ...state,
    viewMode: viewMode,
  })),
);
