import './App.css';
import { Navbar, NavbarBrand, Container, Row, Col, Form } from 'react-bootstrap';
import {GeneratePCP} from './components';
import { ScatterplotPlotly } from './components';
import { Component } from 'react';
import styles from './app.module.scss';
import Slider from '@mui/material/Slider';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
      pcpdata: {},
      sliderdata: {},
      corr: false,
      var: false,
      skew: false,
      neigh: false, 
      split: false, 
      fan: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.callbackFromChild = this.callbackFromChild.bind(this);
  }

  // componentDidMount(){
  //   fetch('/readData', {
  //     methods: 'GET',
  //   })
  //   .then(response => response.json())
  //   .then(response => {
  //     this.setState({data: response})
  //   })
  // }

  callbackFromChild(data){
    this.setState({'data_rec': false});
    this.setState(data, ()=> this.setState({'data_rec': true}));
  }

  handleChange(evt){
    let cur_state = this.state;
    cur_state[evt.target.id] = !cur_state[evt.target.id]
    this.setState(cur_state, ()=> console.log(this.state));
  }

  sliderChange(evt, val){
    fetch('/getsliderdata', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(val)
      // console.log(y['bill_length_mm'].invert(940))
  })
  .then(response => response.json())
  .then(data => {
      this.setState({sliderdata: data}, ()=> console.log(this.state))
  })
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
            <Col md={3}>
              <Form.Check type="checkbox" id="corr" label="Correlation" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="var" label="Variance" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="skew" label="Skewness" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="neigh" label="Neighborhood" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="split" label="Split" onChange={this.handleChange}/>
              <Form.Check type="checkbox" id="fan" label="Fan" onChange={this.handleChange}/>
              <p style={{color: "#d53e4f"}}> Correlation</p>
              <p style={{color: "#fc8d59"}}> Variance</p>
              <p style={{color: "#fee08b"}}> Skewness</p>
              <p style={{color: "#e6f598"}}> Neighborhood</p>
              <p style={{color: "#99d594"}}> Split</p>
              <p style={{color: "#3288bd"}}> Fan</p>
              <Slider
                aria-label="Temperature"
                defaultValue={30}
                // getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={100}
                onChangeCommitted={this.sliderChange}
              />

            </Col>
            <Col md={9}>
              <GeneratePCP pcpdata={this.state.sliderdata} data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan} callbackFromParent={this.callbackFromChild}/>
            </Col>
            {/* <Col md={4}>
              <ScatterplotPlotly pcpdata={this.state.pcpdata}/>
            </Col> */}
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
