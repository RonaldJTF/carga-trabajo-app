import { createReducer, on } from "@ngrx/store";
import { OrganizationChart } from "@models";
import * as OrganizationChartActions from "./organizationChart.actions";
import _ from 'lodash'; //Usada para clonar conservando la estructura del objeto, por ejemplo, el orden en que se encuentran en una lista, etc.

export interface OrganizationChartState {
  items: OrganizationChart[];
  item: OrganizationChart;
  mustRecharge: boolean;
}

export const initialState: OrganizationChartState = {
  items: [],
  item: new OrganizationChart(),
  mustRecharge: true
};

export const organizationChartReducer = createReducer(
  initialState,

  on(OrganizationChartActions.setList, (state, { organizationCharts }) => ({
    ...state,
    items: [...organizationCharts ?? []],
  })),

  on(OrganizationChartActions.addToList, (state, { organizationChart }) =>{
    return { ...state,
      items:[...state.items, organizationChart]
    };
  }),

  on(OrganizationChartActions.removeFromList, (state, { id }) => {
    return { ...state, items: state.items.filter(e => e.id != id) };
  }),

  on(OrganizationChartActions.removeItemsFromList, (state, { organizationChartIds }) => {
    return { ...state, items: state.items.filter(e => !organizationChartIds?.some(o => o == e.id) ) };
  }),

  on(OrganizationChartActions.updateFromList, (state, { organizationChart }) => {
    const items = [...state.items];
    let index = items.findIndex(item => item.id === organizationChart.id);
    if (index !== -1){
      items[index] = organizationChart;
    }
    return { ...state, items:items};
  }),

  on(OrganizationChartActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(OrganizationChartActions.setOrganizationChart, (state, { organizationChart }) => ({
    ...state,
    item: organizationChart,
  })),
);