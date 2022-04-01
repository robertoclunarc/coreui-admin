import { Ichuto } from './chuto.models';
import { IBatea } from './batea.models';
import { Imaterial } from './material.models';
import { Iproveedor } from './proveedor.models';
import { Icliente } from './cliente.models';
import { Ibalanza } from './balanza.models';
import { Itransportista } from './transportista.models';
import { Iconductor } from './conductor.models';

export interface IConsultas{
    uid?: number;
    id_paciente?: number;
    fecha?: string;
    id_motivo?: number;
    sintomas?: string;
    id_medico?: number;
    observaciones?: string;
    indicaciones?: string;
    fecha_prox_cita?: string;
    observacion_medicamentos?: string;
    resultado_eva?: string;
    id_paramedico?: number;
    id_area?: number;
    id_patologia?: number;
    id_remitido?: number;
    id_reposo?: number;
    fecha_registro?: string;
    turno?: number;
    indicaciones_comp?: string;
    referencia_medica?: string;
    condicion?: string;
    fkafeccion?: number;
    autorizacion?: string;
} 

export interface IConsultasOperaciones{
    idOperador?: number;
    chuto?: Ichuto;
    boleto?: string;
    fechantrada?: string;
    horaEntrada?: string;
    balanzaEntrada?: Ibalanza;
    fechaSalida?: string;
    horaSalida?: string;
    balanzasalida?: Ibalanza;
    peso?: number;
    batea?: IBatea;
    material?: Imaterial;
    proveedor?: Iproveedor;
    cliente?: Icliente;
    transportista?: Itransportista;
    conductor?: Iconductor;
}

export interface IvConsulta {
    idOperacion?: number;
    boleto?: number;
    tipoOpereracion?: number;
    descripcionTipoOperacion?: string;
    idchuto?: number;
    chuto?: string;
    idbatea?: number;
    batea?: string;
    orden?: string;
    renglon?: string;
    guiaNota?: string;
    codigoMaterial?: number;
    descripcionMaterial?: string;
    codigoTipo?: number;
    codigoProveedor?: number;
    nombreProveedor?: string;
    codigoCliente?: number;
    nombreCliente?: string;
    fechaEntrada?: string;
    horaEntrada?: string;
    balanzaEntrada?: number;
    pesoEntrada?: string;
    fechaSalida?: string;
    horaSalida?: string;
    balanzaSalida?: number;
    pesoSalida?: string;
    neto?: string;
    statusBoleto?: number;
    registradorEntrada?: string;
    registradorSalida?: string;
    fechaCancelado?: string;
    registradorCancelado?: string;
    observaciones?: string;
    observaciones_2?: string;
    primeraTara?: number;
    codigoTransportista?: number;
    razonSocial?: string;
    instalacion?: string;
    proceso?: string;
    status_hyl?: string;
    totalPesoGuias?: string;
    diferencia_peso?: string;
    cancel_frente_despacho?: string;
    cancel_codigo_causa?: string;
    enviado?: string;
    procesado_por?: string;
    cedula?: number;
    nombreConductor?: String;
    turnoEntrada?: number;
    turnoEntradaFecha?: number;
    turnoSalida?: number;
    borrar_esto?: string;
    turnoSalidaFecha?: number;
    numeroAutorizaCarga?: number;
    cup?: string;
    tipoFlota?: string;
    mixto?: string;
    manual?: string;
    ordenServicio?: string;
    tipoDespacho?: string;
    pesajeControl?: string;
    instalacionControl?: string;
}

export interface IFiltroConsulta{
    idBoleto?: string,
    tipoOperacion?: string,
    codigoMaterial?: string
    /*fechaFin?: string,
    ciMedico?: string,
    ciParamedico?: string,
    uidMotivo?: string
    */
}

export interface Ireferencia{
    especialidad?: string,
    informe?: string
}