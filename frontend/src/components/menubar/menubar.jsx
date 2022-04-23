import React, {Component, useState} from 'react';
import {Form, Button, Nav, Modal, DropdownButton} from 'react-bootstrap';
import * as d3 from 'd3';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

// export class LoadData extends Component {
    // constructor(props){
    //     super(props);
    //     this.handleSubmit = this.handleSubmit.bind(this);
    // }

    // callbackFromChild(dataFromChild){
    //     this.setState(dataFromChild, ()=> this.setState({data_rec: true}));
    // }
    

    // handleSubmit(value){
    //     const file = value.target.files[0];
    //     const data = new FormData();
    //     data.append('file', file);
    //     data.append('filename', 'data.csv');

    //     fetch('/upload', {
    //         method: 'POST',
    //         body: data,
    //     }).then(response => response.json())
    //     .then((response) => {
    //         let data = response;
    //         let dimensions = []
    //         let cols = d3.keys(data[0])
    //         for(let i=0; i< cols.length; i++){
    //             dimensions.push({key: i, name: cols[i]})
    //         }
    //         this.props.callbackFromParent({data: data, dimensions: dimensions, selectedList: dimensions, local_cols: [dimensions[0].name, dimensions[1].name], click_seq: []})
    //     });
    // }

    // render(){
    //     return (
    //         <Form.Group style={{fontSize: 30, padding: '5 0', marginLeft: 15}} controlId="formFile" className="mb-1">
    //             <Form.Control type="file" onChange={this.handleSubmit}/>
    //         </Form.Group>
    //     )
    // }
// }

export function LoadData() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <div>
        <Button variant="info" onClick={handleShow}>
          Upload Dataset
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Whoops!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Our hosting partner is having issues with this feature. We are working on it. Please try examples for now.</Modal.Body>
        </Modal>
      </div>
    );
  }
  

export class EqualWeights extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.props.callbackFromParent({
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
        })
    }

    render(){
        const reset_button = (
            <Nav.Item style={{paddingLeft: 15}}>
                <Button variant="info" onClick={this.handleChange}>Set Equal Weights</Button>
            </Nav.Item>
        );
        return reset_button;
    }
}

export class LoadExamples extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(evt){
        fetch('/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([evt, this.props.session_id])})
            .then(response => response.json())
            .then((response) => {
                let data = response;
                let dimensions = []
                let cols = d3.keys(data[0])
                for(let i=0; i< cols.length; i++){
                    dimensions.push({key: i, name: cols[i]})
                }
                this.props.callbackFromParent({data: data, dimensions: dimensions, selectedList: dimensions, local_cols: [dimensions[0].name, dimensions[1].name], click_seq: []})
        });
    }

    render(){
        return (
            <DropdownButton variant='info' style={{paddingLeft: 15}} id='examples' title='Load Examples' onSelect={this.handleSubmit}>
                <DropdownItem eventKey="1">Cars</DropdownItem>
                <DropdownItem eventKey="2">Systems</DropdownItem>
                <DropdownItem eventKey="3">Penguins</DropdownItem>
            </DropdownButton>
        )
    }
}