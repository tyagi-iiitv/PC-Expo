import './App.css';
import { Navbar, Nav, NavbarBrand, Container, Row, Col, Button } from 'react-bootstrap';
import {GeneratePCP, LoadData, ClearGrouping, DensityChange, SplitUp, Neighborhood, PosCorr, NegCorr, PosVar, NegVar, PosSkew, NegSkew, Fan, Outliers, FeatureSelect, Donut, HeatMap, LocalView, Scatterplot, LoadExamples} from './components';
import { Component } from 'react';
// import * as navbar from './com';
import styles from './app.module.scss';
import Slider from '@mui/material/Slider';
import * as d3 from 'd3';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {},
      pcpdata: {},
      dragdata: {},
      sliderdata: {},
      clear_grouping_sliderval: 0,
      split_up_sliderval: 0,
      density_change_sliderval: 0,
      neigh_sliderval: 0,
      fan_sliderval: 0,
      outliers_sliderval: 0,
      pos_corr_sliderval: 0,
      neg_corr_sliderval: 0,
      pos_var_sliderval: 0,
      neg_var_sliderval: 0,
      pos_skew_sliderval: 0,
      neg_skew_sliderval: 0,
      window_sliderval: 30,
      dimensions: [],
      selectedList: [],
      heatmap_data: {},
      local_cols: [],
      click_seq: [],
      change_heatmap: true,
      area_chart_data: [],
    }
    this.sliderChange = this.sliderChange.bind(this);
    this.recommend = this.recommend.bind(this);
    this.globaloptimize = this.globaloptimize.bind(this);
    this.getareacharts = this.getareacharts.bind(this);
    this.delareacharts = this.delareacharts.bind(this);
    this.callbackFromChild = this.callbackFromChild.bind(this);
  }

  componentDidMount(){
    fetch('/getjsondata', {
      methods: 'GET',
    })
    .then(response => response.json())
    .then(response => {
      this.setState({'data_rec': false});
      let dimensions = [];
      let data = response;
      let cols = d3.keys(data[0])
      for(let i=0; i< cols.length; i++){
          dimensions.push({key: i, name: cols[i]})
      }
      this.setState({data: data, dimensions: dimensions, selectedList: dimensions, local_cols: [dimensions[0].name, dimensions[1].name]}, ()=> this.setState({'data_rec': true}))
    })
  }


  callbackFromChild(data){
    this.setState({'data_rec': false});
    this.setState(data, ()=> this.setState({'data_rec': true}));
  }

  delareacharts(){
    this.setState({area_chart_data: []})
  }

  getareacharts(){
    this.setState({'data_rec': false});
    fetch('/getareacharts', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear_grouping_sliderval: this.state.clear_grouping_sliderval,
        split_up_sliderval: this.state.split_up_sliderval,
        density_change_sliderval: this.state.density_change_sliderval,
        neigh_sliderval: this.state.neigh_sliderval,
        fan_sliderval: this.state.fan_sliderval,
        outliers_sliderval: this.state.outliers_sliderval,
        pos_corr_sliderval: this.state.pos_corr_sliderval,
        neg_corr_sliderval: this.state.neg_corr_sliderval,
        pos_var_sliderval: this.state.pos_var_sliderval,
        neg_var_sliderval: this.state.neg_var_sliderval,
        pos_skew_sliderval: this.state.pos_skew_sliderval,
        neg_skew_sliderval: this.state.neg_skew_sliderval,
        window_sliderval: this.state.window_sliderval,
        selected_list: this.state.selectedList,
      })
    })
    .then(response => response.json())
    .then(data => {
        this.setState({area_chart_data: data}, ()=> this.setState({'data_rec': true}))
    })
  }


  globaloptimize(){
    this.setState({'data_rec': false});
    fetch('/globaloptimize', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear_grouping_sliderval: this.state.clear_grouping_sliderval,
        split_up_sliderval: this.state.split_up_sliderval,
        density_change_sliderval: this.state.density_change_sliderval,
        neigh_sliderval: this.state.neigh_sliderval,
        fan_sliderval: this.state.fan_sliderval,
        outliers_sliderval: this.state.outliers_sliderval,
        pos_corr_sliderval: this.state.pos_corr_sliderval,
        neg_corr_sliderval: this.state.neg_corr_sliderval,
        pos_var_sliderval: this.state.pos_var_sliderval,
        neg_var_sliderval: this.state.neg_var_sliderval,
        pos_skew_sliderval: this.state.pos_skew_sliderval,
        neg_skew_sliderval: this.state.neg_skew_sliderval,
        window_sliderval: this.state.window_sliderval
      })
    })
    .then(response => response.json())
    .then(data => {
        this.setState({selectedList: data, dimensions: data}, ()=> this.setState({'data_rec': true}))
    })
  }
  
  recommend(){
    this.setState({'data_rec': false});
    fetch('/heatmapdata', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear_grouping_sliderval: this.state.clear_grouping_sliderval,
        split_up_sliderval: this.state.split_up_sliderval,
        density_change_sliderval: this.state.density_change_sliderval,
        neigh_sliderval: this.state.neigh_sliderval,
        fan_sliderval: this.state.fan_sliderval,
        outliers_sliderval: this.state.outliers_sliderval,
        pos_corr_sliderval: this.state.pos_corr_sliderval,
        neg_corr_sliderval: this.state.neg_corr_sliderval,
        pos_var_sliderval: this.state.pos_var_sliderval,
        neg_var_sliderval: this.state.neg_var_sliderval,
        pos_skew_sliderval: this.state.pos_skew_sliderval,
        neg_skew_sliderval: this.state.neg_skew_sliderval,
        window_sliderval: this.state.window_sliderval
      })
    })
    .then(response => response.json())
    .then(data => {
        this.setState({heatmap_data: data}, ()=> this.setState({'data_rec': true}))
    })
  }

  sliderChange(evt, val){
    this.setState({window_sliderval: val})
  }

  render(){
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <NavbarBrand style={{fontSize: 30, padding: '5 0', marginLeft: 15}}>
            ParaCoords Explorer
          </NavbarBrand>
          <Nav className="mr-auto">
            <LoadData callbackFromParent={this.callbackFromChild}/>
            {/* <EqualWeights callbackFromParent={this.callbackFromChild}/> */}
            <Nav.Item style={{paddingLeft: 15}}>
                <Button variant="info" onClick={this.globaloptimize}>Global Optimize</Button>
            </Nav.Item>
            <Nav.Item style={{paddingLeft: 15}}>
                <Button variant="info" onClick={this.getareacharts}>Show Properties</Button>
            </Nav.Item>
            <Nav.Item style={{paddingLeft: 15}}>
                <Button variant="info" onClick={this.delareacharts}>Hide Properties</Button>
            </Nav.Item>
            <LoadExamples callbackFromParent={this.callbackFromChild}/>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row className={styles.mainRow}>
            <Col md={10}>
              <Row>
                <GeneratePCP pcpdata={this.state.sliderdata} data={this.state.data} corr={this.state.corr} var={this.state.var} skew={this.state.skew} neigh={this.state.neigh} split={this.state.split} fan={this.state.fan} callbackFromParent={this.callbackFromChild} selectedList={this.state.selectedList} click_seq={this.state.click_seq} change={this.state.change_heatmap} area_chart_data={this.state.area_chart_data}/>
              </Row>
              <Row>
                <Col md="auto">
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
                    />
                  </Row>
                  <Row>
                    <Scatterplot data={this.state.data} local_cols={this.state.local_cols} dragdata={this.state.dragdata}/>
                  </Row>
                </Col>
                <Col md="auto">
                  <HeatMap heatmap_data={this.state.heatmap_data} click_seq={this.state.click_seq} change={this.state.change_heatmap} dimensions={this.state.dimensions} selected_list={this.state.selectedList} callbackFromParent={this.callbackFromChild}/>
                </Col>
                <Col md="auto">
                  <LocalView data={this.state.data} local_cols={this.state.local_cols} window={this.state.window_sliderval} callbackFromParent={this.callbackFromChild}/>
                </Col>
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
                    defaultValue={30}
                    valueLabelDisplay="auto"
                    step={20}
                    marks
                    min={10}
                    max={100}
                    onChangeCommitted={this.sliderChange}
                  />
              </Row>
              <Row>
                <Button variant="info" onClick={this.recommend} className={styles.recommend_button}>Recommend</Button>
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

