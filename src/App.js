import logo from './logo.svg';
import './App.css';
import {CalendarLayout} from './Layout';
import { Calendar } from './Calendar';

function App() {
  const data = new Calendar(9,2021);
  return (
    <CalendarLayout data={data.getData()}/>
  );
}

export default App;
