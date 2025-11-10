import axiosInstance from './axiosInstance';

export interface Proyecto {
  id?: number;
  titulo_proyecto: string;
  descripcion: string;
  tipo_proyecto: 'portafolio' | 'contratado';
  valoracion_promedio?: number;
  fecha_publicacion?: string;
  arquitecto_id: number;
  cliente_id?: number;
  conversacion_id?: number;
  solicitud_proyecto_id?: number;
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

  async getProyecto(id: number): Promise<Proyecto> {
    const response = await axiosInstance.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async updateProyecto(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
    const response = await axiosInstance.put(`${this.BASE_URL}/${id}`, { proyecto });
    return response.data;
  }

  async deleteProyecto(id: number): Promise<void> {
    await axiosInstance.delete(`${this.BASE_URL}/${id}`);
  }
}

export default new ProyectosService();
