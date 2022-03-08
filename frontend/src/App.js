import './App.css';
import { Navbar, Nav, NavbarBrand, Container, Row, Col, Form } from 'react-bootstrap';
import {GeneratePCP, LoadData, ClearGrouping, DensityChange, SplitUp, Neighborhood, PosCorr, NegCorr, PosVar, NegVar, PosSkew, NegSkew, Fan, Outliers, EqualWeights, FeatureSelect, Donut} from './components';
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
      clear_grouping_sliderval: 30,
      split_up_sliderval: 30,
      density_change_sliderval: 30,
      neigh_sliderval: 30,
      fan_sliderval: 30,
      outliers_sliderval: 30,
      pos_corr_sliderval: 30,
      neg_corr_sliderval: 30,
      pos_var_sliderval: 30,
      neg_var_sliderval: 30,
      pos_skew_sliderval: 30,
      neg_skew_sliderval: 30,
      dimensions: [
        {id: 0, name: 'bill_length_mm'},
        {id: 1, name: 'bill_depth_mm'}, 
        {id: 2, name: 'flipper_length_mm'}, 
        {id: 3, name: 'body_mass_g'}],
      selectedList: [
        {id: 0, name: 'bill_length_mm'},
        {id: 1, name: 'bill_depth_mm'}, 
        {id: 2, name: 'flipper_length_mm'}, 
        {id: 3, name: 'body_mass_g'}],
    }
    this.handleChange = this.handleChange.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.callbackFromChild = this.callbackFromChild.bind(this);
  }

  componentDidMount(){
    fetch('/getjsondata', {
      methods: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      this.setState({'data_rec': false});
      this.setState({data: response}, ()=> this.setState({'data_rec': true}))
    })
  }

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
            <EqualWeights callbackFromParent={this.callbackFromChild}/>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={10}>
              <Row>
                <GeneratePCP pcpdata={this.state.sliderdata} data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan} callbackFromParent={this.callbackFromChild} selectedList={this.state.selectedList}/>
              </Row>
              <Row>
                <Donut 
                  clear_grouping={this.state.clear_grouping_sliderval}
                  split_up={this.state.split_up_sliderval}
                  density_change={this.state.density_change_sliderval}
                  neigh={this.state.neigh_sliderval}
                  fan={this.state.fan_sliderval}
                  outliers={this.state.outliers_sliderval}
                  pos_corr={this.state.pos_corr_sliderval}
                  neg_corr={this.state.neg_corr_sliderval}
                  pos_var={this.state.pos_var_sliderval}
                  neg_var={this.state.neg_var_sliderval}
                  pos_skew={this.state.pos_skew_sliderval}
                  neg_skew={this.state.neg_skew_sliderval}
                  labels={['clear grouping', 'split up', 'density change']}
                />
              </Row>
              <Row className={styles.clueImage}>
                <img src="/all_props.png" alt="image" className={styles.clueImage}/>
              </Row>
            </Col>
            <Col md={2} className={styles.slider}>
              <Row>
                <h5>Properties</h5>
                <Col>
                  <ClearGrouping callbackFromParent={this.callbackFromChild} val={this.state.clear_grouping_sliderval}/>
                  <SplitUp callbackFromParent={this.callbackFromChild} val={this.state.split_up_sliderval}/>
                  <DensityChange callbackFromParent={this.callbackFromChild} val={this.state.density_change_sliderval}/>
                  <Neighborhood callbackFromParent={this.callbackFromChild} val={this.state.neigh_sliderval}/>
                  <Fan callbackFromParent={this.callbackFromChild} val={this.state.fan_sliderval}/>
                  <Outliers callbackFromParent={this.callbackFromChild} val={this.state.outliers_sliderval}/>
                </Col>
                <Col>
                  <PosCorr callbackFromParent={this.callbackFromChild} val={this.state.pos_corr_sliderval}/>
                  <NegCorr callbackFromParent={this.callbackFromChild} val={this.state.neg_corr_sliderval}/>
                  <PosVar callbackFromParent={this.callbackFromChild} val={this.state.pos_var_sliderval}/>
                  <NegVar callbackFromParent={this.callbackFromChild} val={this.state.neg_var_sliderval}/>
                  <PosSkew callbackFromParent={this.callbackFromChild} val={this.state.pos_skew_sliderval}/>
                  <NegSkew callbackFromParent={this.callbackFromChild} val={this.state.neg_skew_sliderval}/>
                </Col>
              </Row>
              <Row className={styles.sliderWindow}>
                <h5>Granularity (Window Size)</h5>
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
              <Row>
                <h5>Data Features</h5>
                <FeatureSelect cols={this.state.dimensions} selectedList={this.state.selectedList} callbackFromParent={this.callbackFromChild}/>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

