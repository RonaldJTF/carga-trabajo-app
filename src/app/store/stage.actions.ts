import {createAction, props} from "@ngrx/store";
import {FollowUp, Stage, Task} from "@models";

export const setList = createAction('[Configuration of Stage] Set the stages', props<{ stages: Stage[] }>());
export const addToList = createAction('[Configuration of Stage] Add item to the stages', props<{ stage: Stage }>());
export const removeFromList = createAction('[Configuration of Stage] Remove from the stages an element by its id', props<{ id: number }>());
export const removeItemsFromList = createAction('[Configuration of Stage] Remove items from stages by id', props<{ stageIds: number[] }>());
export const updateFromList = createAction('[Configuration of Stage] Update an item in stages', props<{ stage: Stage }>());
export const setMustRecharge = createAction('[Configuration of Stage] set if stages must be recharged', props<{ mustRecharge: boolean }>());
export const setItem = createAction('[Configuration of Stage] Set the clicked stage', props<{ stage: Stage}>());
export const removeStageIfWasDeleted = createAction('[Configuration of Stage] Remove stage if was removed', props<{ removedIds: number[] }>());
export const addToExpandedNodes= createAction('[Configuration of Stage] Add item to the list of expanded nodes', props<{ id: number }>());
export const removeFromExpandedNodes = createAction('[Configuration of Stage] Remove from the list of expanded nodes an element by its id', props<{ id: number }>());
export const reset = createAction('[Configuration of Stage] Reset variables');

export const addTaskToStage = createAction('[Configuration of Stage] Add task to the stage', props<{ task: Task }>());
export const removeTasksFromStage = createAction('[Configuration of Stage] Remove tasks from Stage', props<{ taskIds: number[] }>());
export const updateTaskFromStage = createAction('[Configuration of Stage] Update a task in stage', props<{ task: Task }>());
export const setShowMoreDetailOfTasks = createAction('[Configuration of Stage] set if task must more details', props<{ showMoreDetailOfTasks: boolean }>());

export const addFollowUpToTask = createAction('[Configuration of Stage] Add follow-up to task', props<{ idTask: number, followUp: FollowUp }>());
export const removeFollowUpFromTask = createAction('[Configuration of Stage] Remove follow-up from task', props<{ idTask: number, idFollowUp: number}>());

export const setViewMode = createAction('[Configuration of Stage] set if events or tasks must be showed as calendar or diary', props<{ viewMode: 'diary' | 'calendar'}>());

