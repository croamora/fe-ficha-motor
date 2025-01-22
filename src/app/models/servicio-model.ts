export interface Servicio{
    id?: number | null;
    idCategoria?: number | null;
    idTaller?: number | null;
    categoria?:string| null;
    servicio?:string| null;
    especial?:boolean| null;
    precio?:PrecioServicio| null;
}

export interface PrecioServicio{
    id?: number | null;
    idServicio?: number | null;
    idTaller?: number | null;
    precio?: number | null;
}