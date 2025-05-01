import './App.css'
import {Counter} from "./features/counter/Counter.tsx";
import {ItemManager} from "./features/items/ItemManager.tsx";

function App() {
  return (
    <>
    <Counter />
      <ItemManager />
    </>
  )
}

export default App
