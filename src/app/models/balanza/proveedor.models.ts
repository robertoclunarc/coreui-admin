export interface Iproveedor{
    idProveedor?: number;
    codigoProveedor?: string;
    rifProveedor?: string;
    nitProveedor?: string;
    nombreProveedor?: string;
    abreviaturaProveedor?: string;
    representanteLegal?: string;
    fkPais?: number;
    fkRegion?: number;
    fkEstado?: number;
    fkCiudad?: number;
    direccionProveedor?: string;
    condEspecialChat?: string;
    sap?: string;
    chatarra?: string;
    statusProveedor?: number;
}