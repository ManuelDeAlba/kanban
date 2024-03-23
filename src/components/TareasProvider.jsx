import { useState, createContext, useContext } from "react";
import Button from "./Button";
import { useEffect } from "react";

const modalTareaContext = createContext();

export const useTareas = () => {
    return useContext(modalTareaContext);
};

function TareasProvider({ children }) {
    const [open, setOpen] = useState(true);
    const [tarea, setTarea] = useState(null);
    const [prevTarea, setPrevTarea] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [columnas, setColumnas] = useState(["To Do", "Doing", "Done"]);
    const [tareas, setTareas] = useState([]);
    const [cargadasLS, setCargadasLS] = useState(false);

    useEffect(() => {
        const tareasLocalStorage = localStorage.getItem("tareas");

        if (tareasLocalStorage) {
            setTareas(JSON.parse(tareasLocalStorage));
            setCargadasLS(true);
        }
    }, [])

    useEffect(() => {
        // Hasta que las primeras tareas carguen de localStorage, no se guardan para evitar que se borre el contenido
        if(cargadasLS) localStorage.setItem("tareas", JSON.stringify(tareas));
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
        setOpen(true);
        setTarea(tarea);
    };

    const cerrarModal = e => {
        setOpen(false);
        setIsEditing(false);
    };

    const handleEditar = () => {
        setIsEditing(true);
        setPrevTarea({ ...tarea });
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
            {tarea && (
                <div
                    className={`fixed inset-0 w-full h-dvh bg-gray-900/15 flex justify-end items-center overflow-hidden ${
                        !open ? "opacity-0 pointer-events-none delay-300" : ""
                    }`}
                >
                    <div
                        className={`absolute bg-slate-500 w-[90%] max-w-sm h-full flex flex-col justify-center items-center p-8 text-white rounded-tl-lg rounded-bl-lg transition-transform ${
                            !open ? "translate-x-full" : "translate-x-0"
                        }`}
                    >
                        {!isEditing ? (
                            <>
                                <span className="text-xl text-center w-full">
                                    {tarea.nombre}
                                </span>
                                <span className="text-lg text-center my-4 w-full flex-1">
                                    {tarea.contenido}
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
                                    value={tarea.nombre}
                                    onInput={handleInput}
                                />
                                <textarea
                                    name="contenido"
                                    className="bg-transparent resize-none text-lg text-center my-4 w-full flex-1 outline-none ring-1 ring-gray-400 rounded-md px-2"
                                    value={tarea.contenido}
                                    onInput={handleInput}
                                ></textarea>
                                <input type="submit" hidden />
                            </form>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={handleEditar}
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
            )}
            {children}
        </modalTareaContext.Provider>
    );
}

export default TareasProvider;