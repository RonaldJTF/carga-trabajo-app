import { Structure } from "../models/structure";
import { Typology } from "../models/typology";

export const typologyOfActivity: Typology = {
    id: 4,
    nombre: 'Actividad',
    descripcion: 'Concierne a las actividades o tareas que deben realizarse en un procedimiento',
    color: 'yellow',
    esDependencia: false,
    idTipologiaSiguiente: null,
    tipologiaSiguiente: null,
    claseIcono: 'pi pi-calendar',
    acciones: [
        {
            claseIcono: 'pi pi-plus',
            descripcion: 'Asociar responsable',
            nombre: 'Responsable',
            id: 1,
            path: '',
            claseBoton: 'p-button-success'
        }
    ]
}

export const typologyOfProcedure: Typology = {
    id: 3,
    nombre: 'Procedimiento',
    descripcion: 'Referente a los procedimientos que conforman a un proceso',
    color: 'green',
    esDependencia: false,
    idTipologiaSiguiente: 4,
    tipologiaSiguiente: typologyOfActivity,
    claseIcono: 'pi pi-pencil',
    acciones: []
}


export const typologyOfProcess: Typology = {
    id: 2,
    nombre: 'Proceso',
    descripcion: 'Estructura manejadora de procedimientos',
    color: 'blue',
    esDependencia: false,
    idTipologiaSiguiente: 3,
    tipologiaSiguiente: typologyOfProcedure,
    claseIcono: 'pi pi-send',
    acciones: [
    ]
}

export const typologyOfDependency: Typology = {
    id: 1,
    nombre: 'Dependencia',
    descripcion: 'Esstructura principal o área de trabajo en la Unidad',
    color: 'red',
    esDependencia: true,
    idTipologiaSiguiente: 2,
    tipologiaSiguiente: typologyOfProcess,
    claseIcono: 'pi pi-trash',
    acciones: [
        {
            claseIcono: 'pi pi-save',
            descripcion: 'Descargar reporte',
            nombre: 'Descargar',
            id: 1,
            path: '',
            claseBoton: 'p-button-primary'
        }
    ]
}

export const structuresOfMock: Structure[] = [
  {
    id: 1, 
    nombre: 'Vicerrectoría Académica', 
    descripcion: '', 
    idPadre: null, 
    idTipologia: 1,
    srcIcono: 'image-no-exis', 
    tipologia: typologyOfDependency, 
    subEstructuras: [
        {
            id: 2, 
            nombre: 'Registro y Control', 
            descripcion: 'Gestora de procesos de inscripción',
            idPadre: 1, 
            idTipologia: 1,
            tipologia: typologyOfDependency,
            srcIcono: '',  
            subEstructuras: [
                {
                    id: 3, 
                    nombre: 'Actas y diplomas', 
                    descripcion: '', 
                    idPadre: 2, 
                    idTipologia: 1,
                    srcIcono: 'assets/content/images/upload.png', 
                    tipologia: typologyOfDependency, 
                    subEstructuras: [
                        {
                            id: 4, 
                            nombre: 'Proceso 1', 
                            descripcion: 'descripcion del proceso 1',
                            idPadre: 3, 
                            idTipologia: 2,
                            tipologia: typologyOfProcess,
                            srcIcono: '',  
                            subEstructuras:[
                                {
                                    id: 5, 
                                    nombre: 'Procedimiento 1', 
                                    descripcion: 'descripcion del procedimiento 1',
                                    idPadre: 4, 
                                    idTipologia: 3,
                                    tipologia: typologyOfProcedure,
                                    srcIcono: '',  
                                    subEstructuras:[
                                        {
                                            id: 6, 
                                            nombre: 'Actividad 1', 
                                            descripcion: 'descripcion de la actividad 1',
                                            idPadre: 5, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            actividad: {
                                                frecuencia: 5,
                                                tiempoMaximo: 3,
                                                tiempoMinimo: 0,
                                                tiempoPromedio: 1.5,
                                                idNivel: 1,
                                                idEstructura: 6,
                                                id: 1
                                            }
                                        },
                                        {
                                            id: 7, 
                                            nombre: 'Actividad 2', 
                                            descripcion: 'descripcion de la actividad 2',
                                            idPadre: 5, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        },
                                        {
                                            id: 8, 
                                            nombre: 'Actividad 3', 
                                            descripcion: 'descripcion de la actividad 3',
                                            idPadre: 5, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        }
                                    ]
                                },
                                {
                                    id: 9, 
                                    nombre: 'Procedimiento 2', 
                                    descripcion: 'descripcion del procedimiento 2',
                                    idPadre: 4, 
                                    idTipologia: 3,
                                    tipologia: typologyOfProcedure,
                                    srcIcono: '',  
                                    subEstructuras:[
                                        {
                                            id: 10, 
                                            nombre: 'Actividad 1', 
                                            descripcion: 'descripcion de la actividad 1',
                                            idPadre: 9, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        },
                                        {
                                            id: 11, 
                                            nombre: 'Actividad 2', 
                                            descripcion: 'descripcion de la actividad 2',
                                            idPadre: 9, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        },
                                        {
                                            id: 12, 
                                            nombre: 'Actividad 3', 
                                            descripcion: 'descripcion de la actividad 3',
                                            idPadre: 9, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        },
                                        {
                                            id: 13, 
                                            nombre: 'Actividad 3', 
                                            descripcion: 'descripcion de la actividad 4',
                                            idPadre: 9, 
                                            idTipologia: 4,
                                            tipologia: typologyOfActivity,
                                            srcIcono: '',  
                                            subEstructuras:[]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 14, 
            nombre: 'Sistema de AutoEvaluación Y Acreditación',
            descripcion: 'Gestora de calidad Institucional', 
            idPadre: 1, 
            idTipologia: 1,
            srcIcono: '', 
            tipologia: typologyOfDependency, 
            subEstructuras: null
        },
  ]
},
{
    id: 15, 
    nombre: 'Vicerrectoría de Investigaciones',
    descripcion: '', 
    idPadre: null, 
    idTipologia: 1,
    srcIcono: '', 
    tipologia: typologyOfDependency, 
    subEstructuras: []
},
{
    id: 16, 
    nombre: 'Centro de Investigaciones Aplicadas y Desarrollo de Tecnologías de Información',
    descripcion: '', 
    idPadre: null, 
    idTipologia: 1,
    srcIcono: '', 
    tipologia: typologyOfDependency, 
    subEstructuras: []
}
]