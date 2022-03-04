import './App.css';
import { Navbar, Nav, NavbarBrand, Container, Row, Col, Form } from 'react-bootstrap';
import {GeneratePCP, LoadData} from './components';
import { ScatterplotPlotly } from './components';
import { Component } from 'react';
// import * as navbar from './com';
import styles from './app.module.scss';
import Slider from '@mui/material/Slider';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
      pcpdata: {},
      dragdata: {},
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
    console.log("here")
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
          <Nav className="mr-auto">
            <LoadData callbackFromParent={this.callbackFromChild}/>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={9}>
              <img src="/all_props.png" alt="image"/>
            </Col>
            <Col md={3} className={styles.slider}>
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
              <p>Window Size</p>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={9}>
              <GeneratePCP pcpdata={this.state.sliderdata} data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan} callbackFromParent={this.callbackFromChild}/>
            </Col>
            <Col md={3}>
              {/* <ScatterplotPlotly data={this.state.data} dragdata={this.state.dragdata}/> */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

