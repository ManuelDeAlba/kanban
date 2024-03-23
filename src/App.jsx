import Tablero from "./components/Tablero";
import TareasProvider from "./components/TareasProvider";

function App(){
	return(
		<main className="px-4 py-8 min-h-dvh bg-gray-900 text-white">
			<h1 className="text-3xl font-bold mb-4 text-center uppercase">Kanban</h1>

			<TareasProvider>
				<Tablero />
			</TareasProvider>
		</main>
	)
}

export default App;