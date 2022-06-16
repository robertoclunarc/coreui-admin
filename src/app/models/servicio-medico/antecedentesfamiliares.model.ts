import {  IPatologia} from './patologias.model'

export interface IAntecedenteFamiliar{
    fk_paciente?: number;
    fk_patologia?: number;
    paterentezco?: string;
    estatus_familiar?: string;
}

export interface IAntecedentesFamiliares{
    fk_paciente?: number;
    patologia?: IPatologia;
    paterentezco?: string;
    estatus_familiar?: string;
}