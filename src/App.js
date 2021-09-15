import './App.css';
import { Navbar, NavbarBrand } from 'react-bootstrap';
import {GeneratePCP} from './components';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <NavbarBrand style={{fontSize: 30, padding: '5 0', marginLeft: 15}}>
          ParaCoords Explorer
        </NavbarBrand>
      </Navbar>
      <div>
        <GeneratePCP />
      </div>
    </div>
  );
}

export default App;
