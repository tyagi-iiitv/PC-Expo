import './App.css';
import { Navbar, NavbarBrand, Container, Row, Col, Form } from 'react-bootstrap';
import {GeneratePCP} from './components';
import { Component } from 'react';
import styles from './app.module.scss';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
      corr: false,
      var: false,
      skew: false,
      neigh: false, 
      split: false, 
      fan: false
    }
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(evt){
    let cur_state = this.state;
    cur_state[evt.target.id] = !cur_state[evt.target.id]
    this.setState(cur_state, ()=> console.log(this.state));
  }

  render(){
    // console.log(this.state.data)
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <NavbarBrand style={{fontSize: 30, padding: '5 0', marginLeft: 15}}>
            ParaCoords Explorer
          </NavbarBrand>
        </Navbar>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={2}>
              <Form.Check type="checkbox" id="corr" label="Correlation" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="var" label="Variance" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="skew" label="Skewness" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="neigh" label="Neighborhood" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="split" label="Split" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="fan" label="Fan" onChange={this.handleChange}/>
            </Col>
            <Col md={9}>
              <GeneratePCP data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan}/>
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
