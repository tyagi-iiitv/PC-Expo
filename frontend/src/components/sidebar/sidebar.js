import React, {Component} from 'react';
import Slider from '@mui/material/Slider';
import {Form, Row, Col} from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';

export class FeatureSelect extends Component {
    constructor(props){
        super(props);
        this.select = this.select.bind(this);
    }

    select(selectedList){
        this.props.callbackFromParent({selectedList: selectedList})
    }
    

    render(){
        return (
            <Multiselect
                options={this.props.cols}
                selectedValues={this.props.selectedList}
                onSelect={this.select}
                onRemove={this.select}
                displayValue="name"
            />
        )
    }

}

export class ClearGrouping extends Component {
    constructor(props){
        super(props);
        this.sliderChange = this.sliderChange.bind(this);
        this.checkChange = this.checkChange.bind(this);
    }

    sliderChange(evt, val){
        this.props.callbackFromParent({clear_grouping_sliderval: val})       
    }

    checkChange(evt){
        this.props.callbackFromParent({clear_grouping_checkval: evt.target.checked})
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
                        aria-valuetext='Temp'
                        defaultValue={this.props.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Clear Grouping</p>
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

    checkChange(evt){
        this.props.callbackFromParent({density_change_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Density Change</p>
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

    checkChange(evt){
        this.props.callbackFromParent({split_up_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Split Up</p>
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

    checkChange(evt){
        this.props.callbackFromParent({neigh_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Neighborhood</p>
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

    checkChange(evt){
        this.props.callbackFromParent({pos_corr_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Positive Correlation</p>
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

    checkChange(evt){
        this.props.callbackFromParent({neg_corr_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Negative Correlation</p>
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

    checkChange(evt){
        this.props.callbackFromParent({pos_var_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Positive Variance</p>
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

    checkChange(evt){
        this.props.callbackFromParent({neg_var_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Negative Variance</p>
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

    checkChange(evt){
        this.props.callbackFromParent({pos_skew_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Positive Skewness</p>
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

    checkChange(evt){
        this.props.callbackFromParent({neg_skew_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Negative Skewness</p>
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

    checkChange(evt){
        this.props.callbackFromParent({fan_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Fan</p>
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

    checkChange(evt){
        this.props.callbackFromParent({outliers_checkval: evt.target.checked})
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
                        min={0}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '10px'}}>Outliers</p>
                </Col>
            </Row>
        )
    }
}