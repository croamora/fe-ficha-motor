export class Vehicle {
    id: number | null;
    patente: string;
    modelo: {
      id: number | null;
      idMarca: number | null;
      modelo: string;
    };
    marca: {
      id: number | null;
      marca: string;
    };
    anio: number | null;
    tipo_combustible: {
      id: number | null;
      combustibleName: string;
    };
    tipo_vehiculo: {
      id: number | null;
      vehicleTypeName: string;
    };
    insert_date: string | null;
    update_date: string | null;
  
    constructor(init?: Partial<Vehicle>) {
      this.id = init?.id ?? null;
      this.patente = init?.patente ?? '';
      this.modelo = init?.modelo ?? { id: null, idMarca: null, modelo: '' };
      this.marca = init?.marca ?? { id: null, marca: '' };
      this.anio = init?.anio ?? null;
      this.tipo_combustible = init?.tipo_combustible ?? { id: null, combustibleName: '' };
      this.tipo_vehiculo = init?.tipo_vehiculo ?? { id: null, vehicleTypeName: '' };
      this.insert_date = init?.insert_date ?? null;
      this.update_date = init?.update_date ?? null;
    }
  }
  