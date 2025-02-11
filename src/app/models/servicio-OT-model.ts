
export class ServicioOT {
    id: number | null;
    idServicio? : number| null;
    servicio?: string| null;
    cantidad?:number| null;
    precio:number;
    especial?:boolean| null;
  
    constructor(init?: Partial<ServicioOT>) {
      this.id = init?.id ?? null;
      this.idServicio = init?.idServicio ?? null;
      this.servicio = init?.servicio ?? null;
      this.cantidad = init?.cantidad ?? null;
      this.precio = init?.precio ?? 0;
      this.especial = init?.especial ?? null;
    }
  }
  