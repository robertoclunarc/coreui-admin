export interface Icliente{
    idCliente?: number;
    codigoCliente?: string;
    abreviaturaCliente?: string;
    nombreCliente?: string;
    direccionCliente?: string;
    telefonoCliente?: string;
    fkPaisCliente?: number;
    fkRegionCliente?: number;
    fkEstadoCliente?: number;
    fkCiudadCliente?: number;
    funcionCliente?: string;
    condicionPagoCliente?: string;
    rifCliente?: string;
    nitCliente?: string;
    representanteLegalCliente?: string;
    cedulaRepresentanteLegalCliente?: string;
    propietarioRegistroCliente?: string;
    direccion2Cliente?: string;
    direccion3Cliente?: string;
    sapCliente?: string;
    instalacionCliente?: string;
    ind_borradoCliente?: string;
    statusCliente?: number 
 }