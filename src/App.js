import './App.css';
import { Navbar, NavbarBrand } from 'react-bootstrap';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <NavbarBrand style={{fontSize: 30, padding: '5 0', marginLeft: 15}}>
          ParaCoods Explorer
        </NavbarBrand>
      </Navbar>
    </div>
  );
}

export default App;
