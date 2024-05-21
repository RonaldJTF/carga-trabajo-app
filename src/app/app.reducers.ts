import { StructureState } from "./store/structure.reducer";
import {WorkplanState} from "./store/workplan.reducer";

export interface AppState{
    structure: StructureState,
    workplan: WorkplanState,
}
