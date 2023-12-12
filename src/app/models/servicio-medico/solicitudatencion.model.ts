export interface ISolicitudAtencion{
    uid?: number;
    id_paciente?: number;
	ci_paciente?: string;
    fecha_solicitud?: string;
	fecha_atencion?: string;
	fecha_salida?: string;
    motivo?: string;
    observaciones?: string;
	observacion_sup?: string;
    id_medico?: number;
    id_paramedico?: number;
    id_reposo?: number;
    id_consulta?: number;
    estatus?: string;
    email_solicitante?: string;
    email_supervisor?: string;
    ci_supervisor?: string;
    nombres_jefe?: string;
}

export interface ISolicitudesAtenciones{
    uid?: number;
    id_paciente?: number;
	ci_paciente?: string;
    paciente?: string;
    fecha_solicitud?: string;
	fecha_atencion?: string;
	fecha_salida?: string;
    motivo?: string;
    observaciones?: string;
	observacion_sup?: string;
    id_medico?: number;
    id_paramedico?: number;
    id_reposo?: number;
    id_consulta?: number;
    estatus?: string;
    paramedico?: string;
    medico?: string;
    reposo?: string;
    nombres_jefe?: string;
    email_solicitante?: string;
    email_supervisor?: string;
    ci_supervisor?: string;
    consultas?: number[];
}

export interface IFilterSolicitud{
    uid?: string;
    ciPaciente?: string;
    nombre?: string;
    supervisor?: string;
    fecha_solicitud?: string;
    medico?: string;
    paramedico?: string;
    estatus?: string;
    condlogica?: string;
}

export interface ISolicitudesConsultas{
    uid?: number;
    id_consulta?: number;
    id_solicitud?: number;
    fecha_salida?: string;
}