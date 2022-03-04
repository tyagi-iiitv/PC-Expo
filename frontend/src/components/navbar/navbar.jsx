import React, {Component} from 'react';
import {Form, Button, Nav} from 'react-bootstrap';

export class LoadData extends Component {
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
    //     }).then((response) => {
    //         console.log(response)
    //     });
    // }

    render(){
        const upload_button = (
            <Form>
              <Form.File id="custom-file" label="Load" custom/>
            </Form>
        );
        return upload_button;
    }
}