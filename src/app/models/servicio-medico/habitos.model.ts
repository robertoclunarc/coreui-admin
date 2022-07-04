export interface IHabito{
    uid_habito?: number;
    descripcion?: string;
}

export interface IHabitoPaciente{
    cedula?: string;
    fk_habito?: number;
    resp?: string;
    observacion?: string;
}

export interface IvHabitos{
    cedula?: string;
    habito?: IHabito;
    resp?: string;
    observacion?: string;
}