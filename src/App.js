import './App.css';
import { Navbar, NavbarBrand } from 'react-bootstrap';
import {GeneratePCP} from './components';
import { Component } from 'react';
import data from './components/pcp/cars.csv';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: data,
    }
  }

  componentDidMount(){
    fetch('/readData', {
      methods: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      this.setState({data: response})
    })
  }

  render(){
    console.log(this.state.data)
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
}

// function App() {
//   return (
//     <div>
//       <Navbar bg="dark" variant="dark">
//         <NavbarBrand style={{fontSize: 30, padding: '5 0', marginLeft: 15}}>
//           ParaCoords Explorer
//         </NavbarBrand>
//       </Navbar>
//       <div>
//         <GeneratePCP />
//       </div>
//     </div>
//   );
// }

// export default App;
