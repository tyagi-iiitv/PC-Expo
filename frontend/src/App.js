import './App.css';
import { Navbar, Nav, NavbarBrand, Container, Row, Col, Form } from 'react-bootstrap';
import {GeneratePCP, LoadData, ClearGrouping, DensityChange, SplitUp, Neighborhood, PosCorr, NegCorr, PosVar, NegVar, PosSkew, NegSkew, Fan, Outliers} from './components';
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
      clear_grouping_val: 30,
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
          <Nav className="mr-auto">
            <LoadData callbackFromParent={this.callbackFromChild}/>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={9}>
              <Row>
                <GeneratePCP pcpdata={this.state.sliderdata} data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan} callbackFromParent={this.callbackFromChild}/>
              </Row>
              <Row className={styles.clueImage}>
                <img src="/all_props.png" alt="image" className={styles.clueImage}/>
              </Row>
            </Col>
            <Col md={3} className={styles.slider}>
              <Row>
                <h4>Properties</h4>
                <Col>
                  <ClearGrouping/>
                  <SplitUp/>
                  <DensityChange/>
                  <Neighborhood/>
                  <Fan/>
                  <Outliers/>
                </Col>
                <Col>
                  <PosCorr/>
                  <NegCorr/>
                  <PosVar/>
                  <NegVar/>
                  <PosSkew/>
                  <NegSkew/>
                </Col>
              </Row>
              <Row className={styles.slider}>
                <h4>Granularity (Window Size)</h4>
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
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

