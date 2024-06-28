import { useState, createContext, useContext } from "react";
import Button from "./Button";
import { useEffect } from "react";

const modalTareaContext = createContext();

export const useTareas = () => {
    return useContext(modalTareaContext);
};

function TareasProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [tarea, setTarea] = useState(null);
    const [prevTarea, setPrevTarea] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [columnas, setColumnas] = useState(["To Do", "Doing", "Done"]);
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        const tareasLocalStorage = localStorage.getItem("tareas");

        if (tareasLocalStorage) {
            setTareas(JSON.parse(tareasLocalStorage));
        }
    }, [])

    useEffect(() => {
        if(tareas.length){
            localStorage.setItem("tareas", JSON.stringify(tareas));
        } else {
            localStorage.removeItem("tareas");
        }
    }, [tareas])

    const crearTarea = columna => {
        const id = Date.now();
        const nuevaTarea = {
            id,
            nombre: `Nueva tarea`,
            contenido: ``,
            estado: columna,
        };

        setTareas(prevTareas => [...prevTareas, nuevaTarea]);
        // Automáticamente abrir la ventana para editarla
        abrirModal(nuevaTarea);
        handleEditar(nuevaTarea);
    };

    const editarTarea = (idTarea, nuevaTarea) => {
        setTareas(prevTareas => {
            return prevTareas.map(tarea =>
                tarea.id == idTarea ? nuevaTarea : tarea
            );
        });
    };

    const cambiarEstadoTarea = (idTarea, nuevoEstado) => {
        const nuevasTareas = tareas.map(tarea => {
            if (tarea.id == idTarea) {
                tarea.estado = nuevoEstado;
            }

            return tarea;
        });

        setTareas(nuevasTareas);
    };

    const abrirModal = tarea => {
        setTarea(tarea);
        setOpen(true);
    };

    const cerrarModal = e => {
        setOpen(false);
        setIsEditing(false);
    };

    const handleEditar = (nuevaTarea) => {
        setIsEditing(true);
        // Si se le pasa una tarea nueva, se guarda como prevTarea para poder cancelar
        // Si no, utiliza la tarea actual
        if(nuevaTarea) setPrevTarea({ ...nuevaTarea });
        else setPrevTarea({ ...tarea });
    };

    const handleCancelar = () => {
        setIsEditing(false);
        setTarea(prevTarea);
    };

    const handleInput = e => {
        setTarea({
            ...tarea,
            [e.target.name]: e.target.value,
        });
    };

    const handleGuardar = e => {
        e.preventDefault();

        setIsEditing(false);
        editarTarea(tarea.id, tarea);
    };

    const handleBorrar = () => {
        setTareas(prevTareas => prevTareas.filter(t => t.id !== tarea.id));
        setOpen(false);
        setIsEditing(false);
    };

    return (
        <modalTareaContext.Provider
            value={{
                columnas,
                setColumnas,
                tareas,
                setTareas,
                crearTarea,
                editarTarea,
                cambiarEstadoTarea,
                abrirModal,
                cerrarModal,
            }}
        >
            <div
                className={`fixed inset-0 w-full h-dvh bg-gray-900/15 flex justify-end items-center overflow-hidden z-50 ${
                    !open ? "opacity-0 pointer-events-none delay-300" : ""
                }`}
            >
                <div
                    className={`absolute bg-slate-500 w-[90%] max-w-sm h-full flex flex-col items-center p-8 text-white rounded-tl-lg rounded-bl-lg transition-transform ${
                        !open ? "translate-x-full" : "translate-x-0"
                    }`}
                >
                    {!isEditing ? (
                        <>
                            <span className="text-xl text-center w-full">
                                {tarea?.nombre}
                            </span>
                            <span className="tarea-contenido text-lg text-center my-4 w-full flex-1 break-words overflow-auto">
                                {tarea?.contenido}
                            </span>
                        </>
                    ) : (
                        <form
                            className="flex flex-col flex-1"
                            onSubmit={handleGuardar}
                        >
                            <input
                                name="nombre"
                                className="bg-transparent text-xl text-center w-full outline-none ring-1 ring-gray-400 rounded-md px-2"
                                type="text"
                                value={tarea?.nombre}
                                onInput={handleInput}
                            />
                            <textarea
                                name="contenido"
                                className="bg-transparent resize-none text-lg text-center my-4 w-full flex-1 outline-none ring-1 ring-gray-400 rounded-md px-2"
                                value={tarea?.contenido}
                                onInput={handleInput}
                            ></textarea>
                            <input type="submit" hidden />
                        </form>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => handleEditar()}
                                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-900 outline-none"
                                >
                                    Editar
                                </button>
                                <Button onClick={cerrarModal}>Cerrar</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={handleGuardar}>Guardar</Button>
                                <Button onClick={handleCancelar}>Cancelar</Button>
                            </>
                        )}
                        <Button onClick={handleBorrar} className="!bg-red-500 focus:ring-red-600">Borrar</Button>
                    </div>
                </div>
            </div>
            {children}
        </modalTareaContext.Provider>
    );
}

export default TareasProvider;
