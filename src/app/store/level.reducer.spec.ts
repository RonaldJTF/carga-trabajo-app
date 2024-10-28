import { Workplan } from "../models/workplan";
import { initialState, workplanReducer, WorkplanState } from "./workplan.reducer";
import * as WorkplanActions from "./workplan.actions";
describe('Workplan Reducer', () => {
    let state: WorkplanState;
  
    beforeEach(() => {
      state = { ...initialState,
        items: [
            {
                id: 1,
                nombre: "Workplan 1",
                descripcion: "First workplan",
                etapas: [],
                avance: 0,
                totalEtapas: 0,
                totalTareas: 0
            },{
                id: 2,
                nombre: "Workplan 2",
                descripcion: "Second workplan",
                etapas: [],
                avance: 0,
                totalEtapas: 0,
                totalTareas: 0
            },{
                id: 3,
                nombre: "Workplan 3",
                descripcion: "Third workplan",
                etapas: [],
                avance: 0,
                totalEtapas: 0,
                totalTareas: 0
            }
        ]
       }; // Resetea el estado inicial antes de cada prueba
    });
  
    it('should return the initial state', () => {
      const action = {} as any; // Crea una acción vacía
      const newState = workplanReducer(undefined, action);
      expect(newState).toEqual(initialState);
    })

    it('should set the list of workplans', () => {
        let workplans: Workplan[] = [{
                id: 4,
                nombre: "Workplan 4",
                descripcion: "Fourth workplan",
                etapas: [],
                avance: 0,
                totalEtapas: 0,
                totalTareas: 0
            }
        ]

        let action = WorkplanActions.setList({workplans});
        let newState = workplanReducer(state, action);

        expect(newState.items.length).toBe(1);
        expect(newState.items[0].id).toBe(4);
    })

    it('should add elements to the list of workplans', () => {
        let workplans: Workplan = 
            {
                id: 4,
                nombre: "Workplan 4",
                descripcion: "Fourth workplan",
                etapas: [],
                avance: 0,
                totalEtapas: 0,
                totalTareas: 0
            }
        

        let action = WorkplanActions.addToList({workplan: workplans});
        let newState = workplanReducer(state, action);

        expect(newState.items.length).toBe(4);
        expect(newState.items[0].id).toBe(1);
    })

    it('should remove elements from the list of workplans', () => {
        let action = WorkplanActions.removeFromList({id: 2});
        let newState = workplanReducer(state, action);

        expect(newState.items.length).toBe(2);
    })

    it('should remove items from the list of workplans', () => {
        let action = WorkplanActions.removeItemsFromList({workplanIds: [2,3]});
        let newState = workplanReducer(state, action);

        expect(newState.items.length).toBe(1);
    })

    it('should update elements from the list of workplans', () =>{
        let updatedWorkplan: Workplan = {
            id: 3,
            nombre: "Updated workplan 3",
            descripcion: "Updated third workplan",
            etapas: [],
            avance: 0,
            totalEtapas: 0,
            totalTareas: 0
        }

        let action = WorkplanActions.updateFromList({workplan: updatedWorkplan});
        let newState = workplanReducer(state, action);

        expect(newState.items[2].nombre).toBe("Updated workplan 3");

    })

    it('should set must recharge in the list of workplans', () => {
        let action = WorkplanActions.setMustRecharge({mustRecharge: false});
        let newState = workplanReducer(state, action);

        expect(newState.mustRecharge).toBe(false);
    })

    it('should set item in the list of workplans', () => {
        let action = WorkplanActions.setItem({id: 1});
        let newState = workplanReducer(state, action);

        expect(newState.item.id).toBe(1);
    })
  
  });