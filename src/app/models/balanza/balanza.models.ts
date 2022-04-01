export interface Ibalanza{
    idBalanza?: number;
    codigoBalanza?: string;
    modo?: string;
    pesoAcumulado?: number;
    pesoActual?: number;
    fechaUltimoMantenimiento?: Date;
    fechaProximoMantenimiento?: Date;
    boletoInicial?: number;
    boletoFinal?: number;
    boletoActual?: number;
    pesoRemoto?: string;
    fechaPesoRemoto?: Date;
    statusBalanza?: number;
    instalacion?: string;
    fkArea?: number;
}