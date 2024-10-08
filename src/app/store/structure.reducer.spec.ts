import { Structure } from "../models/structure";
import { Typology } from "../models/typology";
import { filtrarNodosArbol, findStructure, order, reasingOrder } from "./structure.reducer";
import { initialState, structureReducer, StructureState } from "./structure.reducer";

describe('Structure Reducer', () => {
    let state: StructureState;
  
    beforeEach(() => {
      state = { ...initialState }; // Resetea el estado inicial antes de cada prueba
    });
  
    it('should return the initial state', () => {
      const action = {} as any; // Crea una acción vacía
      const newState = structureReducer(undefined, action);
      expect(newState).toEqual(initialState);
    })
  
  });

  describe('Filtrar Nodos Arbol', () => {
    let structure: Structure[] = [
        {
            id: 1,
            nombre: '',
            descripcion: '',
            idTipologia: 0,
            idPadre: 0,
            subEstructuras: [{
                id: 11,
                nombre: '',
                descripcion: '',
                idTipologia: 0,
                idPadre: 0,
                subEstructuras: [],
                orden: 0
            },{
                id: 22,
                nombre: '',
                descripcion: '',
                idTipologia: 0,
                idPadre: 0,
                subEstructuras: [],
                orden: 0
            }],
            orden: 0
        },
        {
            id: 2,
            nombre: '',
            descripcion: '',
            idTipologia: 0,
            idPadre: 0,
            subEstructuras: [],
            orden: 0 
        }
    ];

    it('should filtrate a structure by id', () => {
        let result = filtrarNodosArbol(structure, [1]);
        expect(result.length).toBe(1);
    })

    it('should filtrate a subEstructura by id', () => {
        let result = filtrarNodosArbol(structure, [11]);
        expect(result[0].subEstructuras.length).toBe(1);
      })
  });

  describe('Find Structure', () => {
    let structures: Structure[] = [
        {
            id: 1,
            nombre: '',
            descripcion: '',
            idTipologia: 0,
            idPadre: 0,
            subEstructuras: [{
                id: 11,
                nombre: '',
                descripcion: '',
                idTipologia: 0,
                idPadre: 0,
                subEstructuras: [],
                orden: 0
            },{
                id: 22,
                nombre: '',
                descripcion: '',
                idTipologia: 0,
                idPadre: 0,
                subEstructuras: [],
                orden: 0
            }],
            orden: 0
        },
        {
            id: 2,
            nombre: '',
            descripcion: '',
            idTipologia: 0,
            idPadre: 0,
            subEstructuras: [],
            orden: 0 
        }
      ];
    
      it('should find a structure by id', () => {
        let result = findStructure(1, structures);
        expect(result).toEqual(structures[0]);
      })
    
      it('should find a subEstructura by id', () => {
        let result = findStructure(11, structures);
        expect(result).toEqual(structures[0].subEstructuras[0])
      })
    
      it('should return null when structure is not found', () => {
        let result = findStructure(3, structures);
        expect(result).toEqual(null);
      })

  });

  describe('Reasign Order', () => {
    let structures: Structure[] = [
        { id: 1, nombre: 'Structure 1', orden: 1 },
        { id: 2, nombre: 'Structure 2', orden: 2 },
        { id: 3, nombre: 'Structure 3', orden: 3 },
        { id: 4, nombre: 'Structure 4', orden: 4 }
      ];
      
    let newStructures: Structure[] = [
        { id: 1, nombre: 'Structure 1', orden: 1 },
        { id: 2, nombre: 'Structure 2', orden: 2 },
        { id: 3, nombre: 'Structure 3', orden: 3 },
        { id: 4, nombre: 'Structure 4', orden: 4 }
      ];

    it('should reasign order within the range inferiorOrder, superiorOrder', () => {
        reasingOrder(structures, 3,1,4);// el rango es entre 3 y 4, se incrementa el límite inferior en 1, se vuelve en cuatro y el límite superior también aumenta
        
        expect(structures[0].orden).toBe(1);
        expect(structures[1].orden).toBe(2);
        expect(structures[2].orden).toBe(4);
        expect(structures[3].orden).toBe(5);
    })

    it('should increment the order for all structures if superiorOrden is undefined', () => {
        reasingOrder(newStructures, 2, 2); // por alguna razón se está generando conflicto entre ambas pruebas, por esa razón se crea un nuevo structures.
    
        expect(newStructures[0].orden).toBe(1); 
        expect(newStructures[1].orden).toBe(4); 
        expect(newStructures[2].orden).toBe(5); 
        expect(newStructures[3].orden).toBe(6); 
    })

  });

  describe('Order', () => {
    let structures: Structure[] = [
      { id: 1, nombre: 'Structure 1', orden: 2 },
      { id: 2, nombre: 'Structure 2', orden: 1 },
      { id: 3, nombre: 'Structure 3', orden: 4 },
      { id: 4, nombre: 'Structure 4', orden: 3 }
    ];

    let newStructures: Structure[] = [
      { id: 1, nombre: 'Structure 1', orden: 2 },
      { id: 2, nombre: 'Structure 2', orden: 1 },
      { id: 3, nombre: 'Structure 3', orden: 4 },
      { id: 4, nombre: 'Structure 4', orden: 3 }
    ];
    let subStructures: Structure[] = [
      { id: 1, nombre: 'Structure 1', subEstructuras: [
        {id: 5, nombre: "Subestructura 1", orden: 2},
        {id: 6, nombre: "Subestructura 2", orden: 1},
        {id: 7, nombre: "Subestructura 3", orden: 3}
      ],orden: 2 },
    ];

    it('should order structures by ascending order', () =>{
      order(structures, true);

      expect(structures[0].id).toBe(2); 
      expect(structures[1].id).toBe(1); 
      expect(structures[2].id).toBe(4); 
      expect(structures[3].id).toBe(3); 
    })

    it('should order structures by descending order', () => {
      order(structures, false);

      expect(structures[0].id).toBe(3);
      expect(structures[1].id).toBe(4);
      expect(structures[2].id).toBe(1);
      expect(structures[3].id).toBe(2);
    })

    // revisar el caso cuando un elemento viene con orden nulo, debería comparar los ids
    it('should order structures by ascending order by orden AND id if one of them has no orden', () => {
      newStructures.push({id: 5, nombre: 'Structure 5', orden: null});
      order(newStructures, true);
      expect(newStructures[4].id).toBe(5);
    })

    it('should order structure by descending order by orden AND id if one of them has no orden', () => {
      newStructures.push({id: 5, nombre: 'Structure 5', orden: null});
      order(newStructures, false);

      expect(newStructures[0].id).toBe(5);
    })

    it('should order subEstructuras by ascending order', () => {
      order(subStructures, true);

      expect(subStructures[0].subEstructuras[0].id).toBe(6);
      expect(subStructures[0].subEstructuras[1].id).toBe(5);
      expect(subStructures[0].subEstructuras[2].id).toBe(7);
    })
    
    it('should order subEstructuras by descending order', () => {
      order(subStructures, false);

      expect(subStructures[0].subEstructuras[2].id).toBe(6);
      expect(subStructures[0].subEstructuras[1].id).toBe(5);
      expect(subStructures[0].subEstructuras[0].id).toBe(7);
    })

  });