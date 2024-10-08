import * as StageActions from "./stage.actions";
import {createReducer, on} from "@ngrx/store";
import {Stage, Task} from "@models";

export interface StageState {
  items: Stage[];
  item: Stage;
  mustRecharge: boolean;
  expandedNodes: any[];
  showMoreDetailOfTasks: boolean;
  viewMode: 'diary' | 'calendar';
}

export const initialState: StageState = {
  items: [],
  item: new Stage(),
  mustRecharge: true,
  expandedNodes: [],
  showMoreDetailOfTasks: true,
  viewMode: 'diary'
};

export const stageReducer = createReducer(
  initialState,

  on(StageActions.setList, (state, { stages }) =>{
   let newItems = JSON.parse(JSON.stringify(stages ?? []));
   updateAvance(newItems);
   orderByStartDate(newItems);
   return {
    ...state,
    items: newItems,
   }
  }),

  on(StageActions.addToList, (state, { stage }) =>{
    let items = JSON.parse(JSON.stringify(state.items));
    let parent = findStage(stage.idPadre, items);
    if (parent){
      if (!parent.subEtapas){parent.subEtapas = []}
      parent.subEtapas.push({...stage})
    }else{
      items.push({...stage});
    }
    updateAvance(items);
    return { ...state,
            items: items,
            item: findStage(state.item?.id, items)
          };
  }),

  on(StageActions.removeFromList, (state, { id }) => {
    const items = filtrarNodosArbol (state.items, [id]);
    updateAvance(items);
    return { ...state, items: items, item: findStage(state.item?.id, items)};
  }),

  on(StageActions.removeItemsFromList, (state, { stageIds }) => {
    const items = filtrarNodosArbol (state.items, stageIds);
    updateAvance(items);
    return { ...state, items: items, item: findStage(state.item?.id, items)};
  }),

  on(StageActions.updateFromList, (state, { stage }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStage = findStage(stage.id, items);
    if (updatedStage){
      Object.assign(updatedStage, JSON.parse(JSON.stringify(stage)));
    }
    updateAvance(items);
    return { ...state,
            items:items,
            item: findStage(state.item?.id, items)
          };
  }),

  on(StageActions.setMustRecharge, (state, { mustRecharge }) => ({
    ...state,
    mustRecharge: mustRecharge,
  })),

  on(StageActions.setItem, (state, { stage }) => {
    return { ...state, item: stage };
  }),

  on(StageActions.removeStageIfWasDeleted, (state, { removedIds }) => ({
    ...state, item: removedIds.includes(state.item?.id) ? new Stage() : state.item,
  })),

  on(StageActions.addToExpandedNodes, (state, { id }) =>{
    return { ...state, expandedNodes:  [...state.expandedNodes, id],};
  }),

  on(StageActions.removeFromExpandedNodes, (state, { id }) => {
    return { ...state, expandedNodes: state.expandedNodes.filter(item => item != id),};
  }),

  on(StageActions.reset, (state) => {
    return {
      ...state,
      items: [],
      item: new Stage(),
      mustRecharge: true
    };
  }),

   on(StageActions.addTaskToStage, (state, { task }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let stage = findStage(task.idEtapa, items);
    if (!stage.tareas){stage.tareas = []}
    stage.tareas.push({...task})
    updateAvance(items);
    orderByStartDate(items);
    return { ...state,
            items: items,
            item: findStage(state.item?.id, items)
          };
   }),

   on(StageActions.updateTaskFromStage, (state, { task }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let stage = findStage(task.idEtapa, items);
    let updatedTask = stage.tareas.find(e => e.id == task.id);
    if (updatedTask){
      Object.assign(updatedTask, task);
    }
    orderByStartDate(items);
    return { ...state, items: items, item: stage};
  }),

   on(StageActions.removeTasksFromStage, (state, { taskIds }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let updatedStage = findStage(state.item?.id, items);
    if (updatedStage){
      updatedStage.tareas = updatedStage.tareas.filter( e => !taskIds.includes(e.id));
    }else{
      filterTasksInAllStages(items, taskIds);
    }
    updateAvance(items);
    orderByStartDate(items);
    return { ...state,  items: items, item: updatedStage};
  }),

  on(StageActions.setShowMoreDetailOfTasks, (state, { showMoreDetailOfTasks }) => ({
    ...state,
    showMoreDetailOfTasks: showMoreDetailOfTasks,
  })),

  on(StageActions.addFollowUpToTask, (state, { idTask, followUp }) =>{
    const items = JSON.parse(JSON.stringify(state.items));
    let task = findTask(idTask, items);
    if (!task.seguimientos){task.seguimientos = []}
    task.seguimientos.push(followUp)
    updateAvance(items);
    return { ...state,
      items: items,
      item: findStage(state.item?.id, items)
    };
  }),

  on(StageActions.removeFollowUpFromTask, (state, { idTask, idFollowUp }) => {
    const items = JSON.parse(JSON.stringify(state.items));
    let task = findTask(idTask, items);
    task.seguimientos = task.seguimientos.filter(e => e.id != idFollowUp);
    updateAvance(items);
    return { ...state,  items: items, item: findStage(state.item?.id, items)};
  }),

  on(StageActions.setViewMode, (state, { viewMode }) => ({
    ...state,
    viewMode: viewMode,
  })),
);

export function filtrarNodosArbol(listaNodos: Stage[], idsAEliminar:number[]) {
  const listaFiltrada = JSON.parse(JSON.stringify(listaNodos));
  for (let i = listaFiltrada.length - 1; i >= 0; i--) {
    const nodo = listaFiltrada[i];
    if (idsAEliminar.includes(nodo.id)) {
        listaFiltrada.splice(i, 1);
    }
    else if (nodo.subEtapas) {
        nodo.subEtapas = filtrarNodosArbol(nodo.subEtapas, idsAEliminar);
        if (nodo.subEtapas.length === 0) {
            delete nodo.subEtapas;
        }
    }
  }
  return listaFiltrada;
}

export function findStage(id: number, stages: Stage[]): Stage{
  if (stages && id){
    for (let e of stages){
      if (id == e.id){
        return e;
      }else{
        let obj = findStage(id, e.subEtapas);
        if (obj){return obj}
      }
    }
  }
  return null;
}

export function findTask(idTask: number, stages: Stage[]): Task{
  if (stages && idTask){
    for (let e of stages){
      const task = e.tareas?.find((t) => t.id == idTask);
      if (task){
        return task;
      }else{
        let obj = findTask(idTask, e.subEtapas);
        if (obj){return obj}
      }
    }
  }
  return null;
}

export function updateAvance(stages: Stage[]){
  for (let stage of stages){
    stage.avance = calculateStageAdvance(stage)
  }
}

export function calculateStageAdvance(stage: Stage) {
  if (!stage) return 0;
  let totalAdvance = 0;
  let count = 0;
  if (stage.tareas && stage.tareas.length > 0) {
    stage.tareas.forEach(task => {
      if (task.seguimientos?.length){
        const lastFolloUp = task.seguimientos.reduce((max, tarea) => {
          const fechaMax = new Date(max.fecha);
          const fechaTarea = new Date(tarea.fecha);
          return fechaTarea > fechaMax ? tarea : max;
        });
        task.avance =  parseFloat(lastFolloUp.porcentajeAvance.toFixed(1));
      }else{
        task.avance =  0;
      }
      totalAdvance += task.avance ?? 0;
      count++;
    });
  }
  if (stage.subEtapas && stage.subEtapas.length > 0) {
    stage.subEtapas.forEach(subStage => {
      totalAdvance += calculateStageAdvance(subStage);
      count++;
    });
  }
  if (count === 0){stage.avance = 0; return 0;}
  stage.avance = parseFloat((totalAdvance / count).toFixed(1));
  return parseFloat(stage.avance.toFixed(1));
}

  export function orderByStartDate(items) {
  function sortTasks(item) {
      if (item.tareas) {
          item.tareas.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
      }
      if (item.subEtapas) {
          item.subEtapas.forEach(subItem => sortTasks(subItem));
          item.subEtapas.sort((a, b) => {
              const aDate = findStartDate(a);
              const bDate = findStartDate(b);
              return aDate - bDate;
          });
      }
  }

  function findStartDate(item) {
      let startDate = Number.MAX_VALUE;
      if (item.tareas && item.tareas.length > 0) {
        const taskStartDate = new Date(item.tareas[0].fechaInicio).getTime();
        startDate = Math.min(startDate, taskStartDate);
      }
      if (item.subEtapas) {
        item.subEtapas.forEach(subItem => {
          const subStartDate = findStartDate(subItem);
          startDate = Math.min(startDate, subStartDate);
        });
      }
      return startDate;
  }
  items.forEach(item => sortTasks(item));
  items.sort((a, b) => {
    const aDate = findStartDate(a);
    const bDate = findStartDate(b);
    return aDate - bDate;
  });
}

export function filterTasksInAllStages(stages: Stage[], taskIds: number[]): void{
  if (!stages){
    return;
  }
  stages.forEach(e => {
    if (e.tareas){
      e.tareas = e.tareas.filter( e => !taskIds.includes(e.id));
    }
    filterTasksInAllStages(e.subEtapas, taskIds);
  })
}
