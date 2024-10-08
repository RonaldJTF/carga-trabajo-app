import { stageReducer, initialState, StageState, findStage, findTask, calculateStageAdvance, updateAvance, orderByStartDate, filterTasksInAllStages, filtrarNodosArbol } from './stage.reducer';
import * as StageActions from './stage.actions';
import { Stage, Task } from '@models';
import { filter, find } from 'rxjs';

describe('Stage Reducer', () => {
  let state: StageState;

  beforeEach(() => {
    state = { ...initialState }; // Resetea el estado inicial antes de cada prueba
  });

  it('should return the initial state', () => {
    const action = {} as any; // Crea una acción vacía
    const newState = stageReducer(undefined, action);
    expect(newState).toEqual(initialState);
  })

});

describe('Filtrar Nodos Arbol', () => {
  let stage: Stage[] = [
    {
      id: 1,
      nombre: '',
      descripcion: '',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [{
        id: 11,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [],
        avance: 0
      },{
        id: 22,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [],
        avance: 0
      }],
      tareas: [],
      avance: 0
    },
    {
      id: 2,
      nombre: '',
      descripcion: '',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [],
      tareas: [],
      avance: 0
    }
  ];
  
  it('should filtrate a stage by id', () => {
    let result = filtrarNodosArbol(stage, [1]);
    expect(result.length).toBe(1);
  })

  it('should filtrate a subEtapa by id', () => {
    let result = filtrarNodosArbol(stage, [11]);
    expect(result[0].subEtapas.length).toBe(1);
  })
});

describe('Find Stage', () => {
  let stages: Stage[] = [
    {
      id: 1,
      nombre: 'Etapa 1',
      descripcion: 'Primera etapa',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [{
        id: 2,
        nombre: 'Subetapa 1',
        descripcion: 'Primera subetapa',
        idPadre: 1,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [],
        avance: 0
      }],
      tareas: [],
      avance: 0
    }
  ];

  it('should find a stage by id', () => {
    let result = findStage(1, stages);
    expect(result).toEqual(stages[0]);
  })

  it('should find a substage by id', () => {
    let result = findStage(2, stages);
    expect(result).toEqual(stages[0].subEtapas[0])
  })

  it('should return null when stage is not found', () => {
    let result = findStage(3, stages);
    expect(result).toEqual(null);
  })
});

describe('Find Task', () => {
  let stages: Stage[] = [
    {
      id: 1,
      nombre: 'Etapa 1',
      descripcion: 'Primera etapa',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [{
        id: 1,
        nombre: 'Subetapa 1',
        descripcion: 'Primera subetapa',
        idPadre: 1,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [{
          id: 2,
          fechaInicio: '2024-01-01',
          fechaFin: '2024-12-31',
          nombre: 'Tarea 1:subetapa',
          descripcion: 'Primera tarea subetapa 1',
          entregable: 'No',
          responsable: 'Admin',
          idEtapa: 1,
          activo: 'Si',
          seguimientos: [],
          avance: 80
        }],
        avance: 0
      }],
      tareas: [{
        id: 1,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        nombre: 'Tarea 1',
        descripcion: 'Primera tarea',
        entregable: 'No',
        responsable: 'Admin',
        idEtapa: 1,
        activo: 'Si',
        seguimientos: [],
        avance: 50
      }],
      avance: 0
    }
  ];

  it('should find a task by id', () => {
    let result = findTask(1, stages);
    expect(result).toEqual(stages[0].tareas[0]);
  })

  it('should find a task inside a substage', () => {
    let result = findTask(2, stages);
    expect(result).toEqual(stages[0].subEtapas[0].tareas[0])
  })

  it('should return null when task is not found', () => {
    let result = findTask(3, stages);
    expect(result).toBeNull();
  })

});

describe('Update Avance', () =>{
  let stages: Stage[] =[ 
    {
      id: 1,
      nombre: 'Etapa 1',
      descripcion: 'Primera etapa',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [],
      tareas: [{
        id: 1,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        nombre: 'Tarea 1',
        descripcion: 'Primera tarea',
        entregable: 'No',
        responsable: 'Admin',
        idEtapa: 1,
        activo: 'Si',
        seguimientos: [{
          id: 1,
          porcentajeAvance: 100,
          observacion: '',
          activo: '',
          fecha: '',
          idTarea: 0,
          archivos: []
        }],
        avance: 100
      }],
      avance: 0
    }];

    let stageWithSubEtapa: Stage[] =[ 
      {
        id: 1,
        nombre: 'Etapa 1',
        descripcion: 'Primera etapa',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [{
          id: 1,
          nombre: 'Subetapa 1',
          descripcion: '',
          idPadre: 1,
          idPlanTrabajo: 0,
          subEtapas: [],
          tareas: [{
            id: 1,
            fechaInicio: '2024-01-01',
            fechaFin: '2024-12-31',
            nombre: 'Tarea 1',
            descripcion: 'Primera tarea',
            entregable: 'No',
            responsable: 'Admin',
            idEtapa: 1,
            activo: 'Si',
            seguimientos: [{
              id: 1,
              porcentajeAvance: 100,
              observacion: '',
              activo: '',
              fecha: '',
              idTarea: 0,
              archivos: []
            }],
            avance: 100
          }],
          avance: 0
        }],
        tareas: [],
        avance: 0
      }];

      let stageWithNoTask: Stage[] = [
        {
          id: 1,
          nombre: 'Etapa 1',
          descripcion: 'Primera etapa',
          idPadre: 0,
          idPlanTrabajo: 0,
          subEtapas: [],
          tareas: [],
          avance: 0
        }
      ];

  it('should calculate stage advance', () => {
    updateAvance(stages);
    expect(stages[0].avance).toBe(100);
  })

  it('should calculate stage advance with a subEtapa', () => {
    updateAvance(stageWithSubEtapa);
    expect(stageWithSubEtapa[0].avance).toBe(100);
  })

  it('should return 0 when there are no tasks', () => {
    updateAvance(stageWithNoTask);
    expect(stageWithNoTask[0].avance).toBe(0);
  })

  describe('Order By Start Date', () => {
    let stages: Stage[] = [
      {
        id: 1,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [{
          id: 1,
          nombre: '',
          descripcion: '',
          idPadre: 0,
          idPlanTrabajo: 0,
          subEtapas: [],
          tareas: [{
            id: 1,
            fechaInicio: '2024-02-02',
            fechaFin: '',
            nombre: '',
            descripcion: '',
            entregable: '',
            responsable: '',
            idEtapa: 0,
            activo: '',
            seguimientos: [],
            avance: 0
          },{
            id: 2,
            fechaInicio: '2024-02-02',
            fechaFin: '',
            nombre: '',
            descripcion: '',
            entregable: '',
            responsable: '',
            idEtapa: 0,
            activo: '',
            seguimientos: [],
            avance: 0
          },{
            id: 3,
            fechaInicio: '2024-02-03',
            fechaFin: '',
            nombre: '',
            descripcion: '',
            entregable: '',
            responsable: '',
            idEtapa: 0,
            activo: '',
            seguimientos: [],
            avance: 0
          }],
          avance: 0
        }],
        tareas: [{
          id: 1,
          fechaInicio: '2024-01-01',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        },{
          id: 2,
          fechaInicio: '2024-02-01',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        },{
          id: 3,
          fechaInicio: '2024-01-10',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        }],
        avance: 0
      },
      {
        id: 2,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [{
          id: 1,
          fechaInicio: '2024-01-02',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        }],
        avance: 0
      },
      {
        id: 3,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [{
          id: 1,
          fechaInicio: '2024-01-03',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        }],
        avance: 0
      }
    ]
    
    it('should order stages by start date', () => {
      orderByStartDate(stages);
      expect(stages[0].id).toBe(1);
      expect(stages[1].id).toBe(2);
      expect(stages[2].id).toBe(3);
    })

    it('should order tasks within stages by start date', () => {
      orderByStartDate(stages);
      expect(stages[0].tareas[0].id).toBe(1);
      expect(stages[0].tareas[1].id).toBe(3);
      expect(stages[0].tareas[2].id).toBe(2);

    })
    
    it('should order tasks within subEtapas by start date', () => {
      orderByStartDate(stages);
      expect(stages[0].subEtapas[0].tareas[0].id).toBe(1);
      expect(stages[0].subEtapas[0].tareas[1].id).toBe(2);
      expect(stages[0].subEtapas[0].tareas[2].id).toBe(3);

    })
  })
});

describe('Filter Tasks In All Stages', () => {
  let stages: Stage[] = [
    {
      id: 1,
      nombre: '',
      descripcion: '',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [],
      tareas: [{
        id: 10,
        fechaInicio: '',
        fechaFin: '',
        nombre: '',
        descripcion: '',
        entregable: '',
        responsable: '',
        idEtapa: 0,
        activo: '',
        seguimientos: [],
        avance: 0
      }],
      avance: 0
    },
    {
      id: 2,
      nombre: '',
      descripcion: '',
      idPadre: 0,
      idPlanTrabajo: 0,
      subEtapas: [{
        id: 1,
        nombre: '',
        descripcion: '',
        idPadre: 0,
        idPlanTrabajo: 0,
        subEtapas: [],
        tareas: [{
          id: 11,
          fechaInicio: '',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        },
        {
          id: 22,
          fechaInicio: '',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        },
        {
          id: 33,
          fechaInicio: '',
          fechaFin: '',
          nombre: '',
          descripcion: '',
          entregable: '',
          responsable: '',
          idEtapa: 0,
          activo: '',
          seguimientos: [],
          avance: 0
        }],
        avance: 0
      }],
      tareas: [],
      avance: 0
    }
  ]

  it('should filtrate a task in all stages', () => {
    filterTasksInAllStages(stages, [10]);
    expect(stages[0].tareas.length).toBe(0);
  })
  
  it('should filtrate a task in all subEtapas', () => {
    filterTasksInAllStages(stages, [11]);
    filterTasksInAllStages(stages, [22])
    expect(stages[1].subEtapas[0].tareas.length).toBe(1);
  })

});

