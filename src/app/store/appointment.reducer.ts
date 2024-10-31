import { Appointment } from "@models";
import * as AppointmentActions from "./appointment.actions";
import {createReducer, on} from "@ngrx/store";

export interface AppointmentState {
  items: Appointment[];
  item: Appointment;
  expandedNodes: any[];
  mustRecharge: boolean;
}

export const initialState: AppointmentState = {
  items: [],
  item: new Appointment(),
  expandedNodes: [],
  mustRecharge: true,
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
);
