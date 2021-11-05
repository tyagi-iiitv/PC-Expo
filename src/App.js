import './App.css';
import { Navbar, NavbarBrand, Container, Row, Col } from 'react-bootstrap';
import {GeneratePCP} from './components';
import { Component } from 'react';
import data from './components/pcp/cars.csv';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
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
        <Container>
          <Row>
            <Col md={11}>
              <GeneratePCP data={this.state.data}/>
            </Col>
            <Col md={1}>
              <p style={{color: "#d53e4f"}}> Correlation</p>
              <p style={{color: "#fc8d59"}}> Variance</p>
              <p style={{color: "#fee08b"}}> Skewness</p>
              <p style={{color: "#e6f598"}}> Neighborhood</p>
              <p style={{color: "#99d594"}}> Split</p>
              <p style={{color: "#3288bd"}}> Fan</p>
            </Col>
          </Row>
        </Container>
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
