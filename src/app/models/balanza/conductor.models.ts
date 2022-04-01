export interface Iconductor{
    idConductor?: number;
    cedulaConductor?: number;
    nombreConductor?: string;
    apellidoConductor?: string;
    gradoLicencia?: number;
    fechaVencimientoLicencia?: Date;
    fechaVencimientoCertificadoMedico?: Date;
    fkTransportista?: string;
    estado?: string;
    fechaInicioSuspencion?: Date;
    fechaFinalSuspencion?: Date;
    FechaSuspencionRegistro?: Date;
    nacionalidad?: string;
    statusConductor?: number
 }