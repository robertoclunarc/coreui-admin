export interface Ioperador{
    idOperador?: number;
    operador?: string;
    claveOperador?: string;
    cedulaOperador?: number;
    nombreOperador?: string;
    idOperadorWin?: string;
    estadoOperador?: string;
    fechaInclusion?: Date;
    totalAcceso?: number;
    accesoEstado?: string;
    accesoIdEstacion?: string;
    accesoIdsistema?: string;
    accesoIdEmpresa?: string;
    accesoIdInstalacion?: string;
    accesoIdArea?: string;
    accesoCheckin?: Date;
    accesocheckout?: Date;
    accesoTiempoConexion?: number;
    accesoIdOperadorWin?: string;
    cambioClave?: Date;
    statusOperador?: number;
    token?: string;
}