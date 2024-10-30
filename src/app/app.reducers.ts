import { LevelState } from "@store/level.reducer";
import {StageState} from "@store/stage.reducer";
import {StructureState} from "@store/structure.reducer";
import {WorkplanState} from "@store/workplan.reducer";
import {Compensation} from "@models";
import {CompensationState} from "@store/compensation.reducer";

export interface AppState {
  structure: StructureState,
  workplan: WorkplanState,
  stage: StageState,
  level: LevelState,
  compensation: CompensationState,
}
