import React, {Component} from 'react';
import {Form, Button, Nav} from 'react-bootstrap';

export class LoadData extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // callbackFromChild(dataFromChild){
    //     this.setState(dataFromChild, ()=> this.setState({data_rec: true}));
    // }

    handleSubmit(value){
        const file = value.target.files[0];
        const data = new FormData();
        data.append('file', file);
        data.append('filename', 'data.csv');

        fetch('/upload', {
            method: 'POST',
            body: data,
        }).then(response => response.json())
        .then((response) => {
            console.log(response)
            this.props.callbackFromParent({data: response})
        });
    }

    render(){
        return (
            <Form.Group style={{fontSize: 30, padding: '5 0', marginLeft: 15}} controlId="formFile" className="mb-1">
                <Form.Control type="file" onChange={this.handleSubmit}/>
            </Form.Group>
        )
    }
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