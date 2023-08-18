export interface IEntity{
    id?: string; 
    entity?: string;
    title?: string;
}

export interface IRelease{
    code?: string;
    browserUrl?: string;    
    parent?: string[];
    codeRange?: string;
    child?:  string[];
    definicion?: any;
    status?: any;
}

export interface Iicd {
    entity?: IEntity;
    release?: IRelease;
}

