import axiosInstance from './axiosInstance';

interface Imagen {
  id: number;
  imagen_url: string;
  fecha: string;
}

export interface Proyecto {
  id?: string | number;
  titulo_proyecto: string;
  descripcion: string;
  tipo_proyecto: 'portafolio' | 'contratado';
  valoracion_promedio?: number;
  fecha_publicacion?: string;
  arquitecto_id: string | number;
  cliente_id?: string | number;
  conversacion_id?: string | number;
  solicitud_proyecto_id?: string | number;
  imagenes?: Imagen[];
}

class ProyectosService {
  private readonly BASE_URL = '/proyectos';

  async createProyecto(proyecto: Proyecto): Promise<Proyecto> {
    const response = await axiosInstance.post(this.BASE_URL, { proyecto });
    return response.data;
  }

  async getProyectos(): Promise<Proyecto[]> {
    const response = await axiosInstance.get(this.BASE_URL);
    return response.data;
  }

  async getProyecto(id: number | string): Promise<Proyecto> {
    const response = await axiosInstance.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async updateProyecto(id: number | string, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const response = await axiosInstance.put(`${this.BASE_URL}/${id}`, { proyecto });
    return response.data;
  }

  async deleteProyecto(id: number | string): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }

  async addImagenesToProyecto(id: number | string, imagenes: string[]): Promise<Proyecto> {
    const response = await axiosInstance.post(`${this.BASE_URL}/${id}/imagenes`, { imagenes });
    return response.data;
  }
}

export default new ProyectosService();
