import { useTareas } from "./TareasProvider";

function Tarea({ tarea }) {
    const { abrirModal } = useTareas();
    const handleDragStart = e => {
        e.dataTransfer.setData("idTarea", tarea.id);
    }

    const handleClick = () => {
        abrirModal(tarea);
    }

    return (
        <div
            className="bg-gray-700 border border-gray-500 rounded-lg py-1.5 px-4 hover:bg-gray-600 cursor-pointer"
            draggable="true"
            onDragStart={handleDragStart}
            onClick={handleClick}
        >
            {tarea.nombre}
        </div>
    );
}

export default Tarea;
