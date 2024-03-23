import Columna from "./Columna";
import { useTareas } from "./TareasProvider";

function Tablero(){
    const { columnas, tareas } = useTareas();

    return(
        <section className="container mx-auto grid gap-8 md:grid-cols-3">
            {
                columnas.map(columna => (
                    <Columna
                        key={columna}
                        nombre={columna}
                        tareas={tareas.filter(tarea => tarea.estado === columna)}
                    />
                
                ))
            }
        </section>
    )
}

export default Tablero;