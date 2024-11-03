import { AppointmentState } from "@store/appointment.reducer";
import { LevelState } from "@store/level.reducer";
import {StageState} from "@store/stage.reducer";
import {StructureState} from "@store/structure.reducer";
import { ValidityState } from "@store/validity.reducer";
import {WorkplanState} from "@store/workplan.reducer";

export interface AppState {
  structure: StructureState,
  workplan: WorkplanState,
  stage: StageState,
  level: LevelState,
  appointment: AppointmentState,
  validity: ValidityState,
}
