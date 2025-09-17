import type { Arquitecto } from '../interfaces/arquitecto';

function ArquitectoCard({ arquitecto }: { arquitecto: Arquitecto }) {
  return (
    <div className="arquitecto">
      <p><strong>Nombre:</strong> {arquitecto.nombre}</p>
      <p><strong>Descripcion:</strong> {arquitecto.descripcion}</p>
      <p><strong>Puntuación:</strong> {arquitecto.puntuacion}</p>
    </div>
  );
}

export default ArquitectoCard;
