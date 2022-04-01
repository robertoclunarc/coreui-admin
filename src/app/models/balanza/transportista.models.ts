export interface Itransportista{
    idTransportista?: number;
    codigoTransportista?: string;
    rifTransportista?: string;
    nitTransportistas?: string;
    razonSocial?: string;
    representanteLegal?: string;
    cedulaRepresentanteLegal?: string;
    fkPais?: number;
    fkRegion?: number;
    fkEstado?: number;
    fkCiudad?: number;
    direccionTransportista?: string;
    telefonoTransportista?: string;
    tipoTransporte?: string;
    fechaInclusion?: Date;
    presidente?: string;
    cantidadFlota?: number;
    sap?: string;
    statusTransportista?: number
}