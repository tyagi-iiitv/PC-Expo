import React, {Component} from 'react';
import Slider from '@mui/material/Slider';
import {Form, Row, Col} from 'react-bootstrap';

export class ClearGrouping extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({clear_grouping_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Clear Grouping</p>
                </Col>
            </Row>
        )
    }
}

export class DensityChange extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({density_change_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Density Change</p>
                </Col>
            </Row>
        )
    }
}

export class SplitUp extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({split_up_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Split Up</p>
                </Col>
            </Row>
        )
    }
}
export class Neighborhood extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({neigh_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Neighborhood</p>
                </Col>
            </Row>
        )
    }
}

export class PosCorr extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({pos_corr_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Positive Correlation</p>
                </Col>
            </Row>
        )
    }
}

export class NegCorr extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({neg_corr_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Negative Correlation</p>
                </Col>
            </Row>
        )
    }
}

export class PosVar extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({pos_var_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Positive Variance</p>
                </Col>
            </Row>
        )
    }
}

export class NegVar extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({neg_var_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Negative Variance</p>
                </Col>
            </Row>
        )
    }
}

export class PosSkew extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({pos_skew_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Positive Skewness</p>
                </Col>
            </Row>
        )
    }
}

export class NegSkew extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({neg_skew_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Negative Skewness</p>
                </Col>
            </Row>
        )
    }
}

export class Fan extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({fan_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Fan</p>
                </Col>
            </Row>
        )
    }
}

export class Outliers extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({outliers_sliderval: val})       
    }

    checkChange(){
        console.log("here in check")
    }


    render(){
        return (
            <Row>
                <Col md="auto">
                    <Form.Check type="checkbox" id="corr" onChange={this.checkChange}/>
                </Col>
                <Col>
                    <Slider
                        key={`slider-${this.props.val}`}
                        aria-label="Temperature"
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        />
                    <p>Outliers</p>
                </Col>
            </Row>
        )
    }
}