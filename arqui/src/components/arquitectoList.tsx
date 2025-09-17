import type { Arquitecto } from '../interfaces/arquitecto';
import { useEffect, useState } from "react";
import ArquitectoCard from './ArquitectoCard';

function ArquitectoList() {
  const [arquitectos, setArquitectos] = useState<Arquitecto[]>([]);

  useEffect(() => {
    const data: Arquitecto[] = [
      { id: 1, nombre: "LEO", descripcion: "Soy un arquitecto", puntuacion: 1 },
      { id: 2, nombre: "JUAN", descripcion: "Soy otro arquitecto", puntuacion: 3 },
      { id: 3, nombre: "MARIO", descripcion: "otro arquitecto mas uwu", puntuacion: 10 },            
      { id: 3, nombre: "STEVEN", descripcion: "otro arquitecto mas uwu", puntuacion: 10 },
      { id: 3, nombre: "CAROL", descripcion: "otro arquitecto mas uwu", puntuacion: 10 },
      { id: 3, nombre: "JOSE", descripcion: "otro arquitecto mas uwu", puntuacion: 10 },

    ];
    setTimeout(() => setArquitectos(data), 100);
  }, []);

  return (
    <div className="arquitecto-list">
      <h1>Lista de Arquitectos</h1>
      {arquitectos.map((arquitecto) => (
        <ArquitectoCard key={arquitecto.id} arquitecto={arquitecto} />
      ))}
    </div>
  );
}

export default ArquitectoList;
