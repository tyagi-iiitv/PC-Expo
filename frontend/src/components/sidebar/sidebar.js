import React, {Component} from 'react';
import Slider from '@mui/material/Slider';
import {Form, Row, Col} from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import equal from 'fast-deep-equal';


export class FeatureSelect extends Component {
    constructor(props){
        super(props);
        this.select = this.select.bind(this);
    }

    select(selectedList){
        let click_seq = selectedList.map(o => o.name)
        this.props.callbackFromParent({selectedList: selectedList, click_seq: click_seq})
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
        this.state = {
            checked: false,
            val: 30,
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({clear_grouping_sliderval: val})
        })
               
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({clear_grouping_sliderval: 0})
            else
                this.props.callbackFromParent({clear_grouping_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#008FFB'}}>Clear Grouping</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({density_change_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({density_change_sliderval: 0})
            else
                this.props.callbackFromParent({density_change_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '12px', 'fontWeight': 'bold', 'color': '#FEB019'}}>Density Change</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({split_up_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({split_up_sliderval: 0})
            else
                this.props.callbackFromParent({split_up_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#00E396'}}>Split Up</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({neigh_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({neigh_sliderval: 0})
            else
                this.props.callbackFromParent({neigh_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#FF4560'}}>Neighborhood</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({pos_corr_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({pos_corr_sliderval: 0})
            else
                this.props.callbackFromParent({pos_corr_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#00E396'}}>Correlation +</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({neg_corr_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({neg_corr_sliderval: 0})
            else
                this.props.callbackFromParent({neg_corr_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#FEB019'}}>Correlation -</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({pos_var_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({pos_var_sliderval: 0})
            else
                this.props.callbackFromParent({pos_var_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#FF4560'}}>Variance +</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({neg_var_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({neg_var_sliderval: 0})
            else
                this.props.callbackFromParent({neg_var_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#775DD0'}}>Variance -</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({pos_skew_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({pos_skew_sliderval: 0})
            else
                this.props.callbackFromParent({pos_skew_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#008FFB'}}>Skewness +</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({neg_skew_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({neg_skew_sliderval: 0})
            else
                this.props.callbackFromParent({neg_skew_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#00E396'}}>Skewness -</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({fan_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({fan_sliderval: 0})
            else
                this.props.callbackFromParent({fan_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#775DD0'}}>Fan</p>
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
        this.state = {
            checked: false,
            val: 30
        }
    }

    sliderChange(evt, val){
        this.setState({val: val}, ()=> {
            if(this.state.checked)
                this.props.callbackFromParent({outliers_sliderval: val})
        })       
    }

    checkChange(evt){
        this.setState({checked: evt.target.checked}, ()=> {
            if(!this.state.checked)
                this.props.callbackFromParent({outliers_sliderval: 0})
            else
                this.props.callbackFromParent({outliers_sliderval: this.state.val})
        })
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
                        defaultValue={this.state.val}
                        // getAriaValueText={valuetext}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        min={10}
                        max={100}
                        onChangeCommitted={this.sliderChange}
                        size='small'
                        />
                    <p style={{'fontSize': '13px', 'fontWeight': 'bold', 'color': '#008FFB'}}>Outliers</p>
                </Col>
            </Row>
        )
    }
}