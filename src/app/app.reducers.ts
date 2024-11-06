import { AppointmentState } from "@store/appointment.reducer";
import { LevelState } from "@store/level.reducer";
import { RuleState } from "@store/rule.reducer";
import {StageState} from "@store/stage.reducer";
import {StructureState} from "@store/structure.reducer";
import { ValidityState } from "@store/validity.reducer";
import { VariableState } from "@store/variable.reducer";
import {WorkplanState} from "@store/workplan.reducer";
import {Compensation} from "@models";
import {CompensationState} from "@store/compensation.reducer";

export interface AppState {
  structure: StructureState,
  workplan: WorkplanState,
  stage: StageState,
  level: LevelState,
  appointment: AppointmentState,
  validity: ValidityState,
  variable: VariableState,
  rule: RuleState,
  compensation: CompensationState,
}
