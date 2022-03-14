import React, {Component} from 'react';
import styles from './localview.module.scss';
import * as d3 from 'd3';

export default class LocalView extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 810, height: 300},
            correlation_pos: [],
            correlation_neg: [], 
            variance_pos: [],
            variance_neg: [],
            skewness_pos: [],
            skewness_neg: [],
            fan: [],
            neigh: [],
            clear_grouping: [],
            density_change: [],
            split_up: [],
            outliers: [],
            indices: [],
            window_size: 0,
        }
    }
    componentDidMount(){
        fetch('/getlocaldata', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              col1: this.props.local_cols[0],
              col2: this.props.local_cols[1],
              window_sliderval: this.props.window
            })
          })
          .then(response => response.json())
          .then(response => {
              this.setState({
                correlation_pos: response[0],
                correlation_neg: response[1],
                variance_pos: response[2],
                variance_neg: response[3],
                skewness_pos: response[4],
                skewness_neg: response[5],
                fan: response[6],
                neigh: response[7],
                clear_grouping: response[8],
                density_change: response[9],
                split_up: response[10],
                outliers: response[11],
                indices: response[12],
                window_size: response[13],
              }, ()=> 
                generateSVG(
                    this.props.data,
                    this.props.local_cols,
                    this.state.canvasDims.width,
                    this.state.canvasDims.height,
                    this.state.correlation_pos,
                    this.state.correlation_neg,
                    this.state.variance_pos,
                    this.state.variance_neg,
                    this.state.skewness_pos,
                    this.state.skewness_neg,
                    this.state.fan,
                    this.state.neigh,
                    this.state.clear_grouping,
                    this.state.density_change,
                    this.state.split_up,
                    this.state.outliers,
                    this.state.indices,
                    this.state.window_size
            )
              )
          })
    }

    render(){
        return(
            <svg
                id="svg3"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        )
    }
}

async function generateSVG(data, local_cols, width, height, pos_corr, neg_corr, pos_var, neg_var, pos_skew, neg_skew, fan, neigh, clear_grouping, density_change, split_up, outliers, indices, window_size){
    d3.selectAll("#svg3 > *").remove();
    let svg = d3.select("#svg3");
    console.log(pos_corr, neigh);
}