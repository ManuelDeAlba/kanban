import { useAutoAnimate } from "@formkit/auto-animate/react";
import Tarea from "./Tarea";
import { useTareas } from "./TareasProvider";

function Columna({ nombre, tareas }) {
    const { crearTarea, cambiarEstadoTarea } = useTareas();
    const [ parent ] = useAutoAnimate({
        duration: 200
    });

    const handleDrop = e => {
        e.preventDefault();
        let data = e.dataTransfer.getData("idTarea");
        cambiarEstadoTarea(data, nombre);
    };

    const handleDragOver = e => {
        e.preventDefault();
    };

    return (
        <aside
            className="flex flex-col p-4 bg-gray-800 border border-gray-700 rounded-lg"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h2 className="text-xl font-bold mb-2 text-center">{nombre}</h2>

            <div className="space-y-4 flex-1" ref={parent}>
                {tareas.map(tarea => (
                    <Tarea tarea={tarea} key={tarea.id} />
                ))}
            </div>

            <button onClick={() => crearTarea(nombre)} className="mt-4">Agregar nueva tarea...</button>
        </aside>
    );
}

export default Columna;
