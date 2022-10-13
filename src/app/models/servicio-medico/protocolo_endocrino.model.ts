import { IPaciente } from './paciente.model';
import { IMedicos } from './medicos.model';

export interface IProtocolosEndrocrinos{
    idprotocolo?: number;
    fkpaciente?: number;
    emision?: string;
    vigencia?: string;
    referecia?: string;
    charla?: string;
    boletin?: string;
    folleto?: string;
    otro?: string;
    indicaciones?: string;
    fkmedico?: number;
    diagnostico?: string;
    lugar?: string;
    proxima_cita?: string;    
}

export interface IEvaluaciones_endocrinas
{
    idevaluacion?: number;
    tipoevaluacion?: string;
    descripcion_evaluacion?: string;
    indice?: number;
    tipoindice?: number;  
}

export interface IPosibles_resp_endocrinas
{
    idposibleresp?: number;
    fkevaluacion?: number;
    posible_resp?: string;
}

export interface IRespuestas_pacientes_eval_endocrino
{
    idresp?: number;
    fkprotocolo?: number;
    fkpaciente?: number;
    fkposible_resp?: number;
    respuesta?: string;
}

export interface IvProtocoloEndrocrinos{
    protocolo?: IProtocolosEndrocrinos;
    paciente?: IPaciente;
    medico?: IMedicos;
}