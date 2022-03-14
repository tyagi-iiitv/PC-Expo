import React, {Component} from 'react';
import styles from './localview.module.scss';
import * as d3 from 'd3';

export default class LocalView extends Component{
    constructor(props){
        super(props);
        this.state = {
            canvasDims: {width: 810, height: 300},
        }
    }
    componentDidMount(){
        generateSVG(
            this.state.canvasDims.width,
            this.state.canvasDims.height,
        )
    }

    render(){
        return(
            <svg
                id="svg2"
                className={styles.svgComp}
                height={this.state.canvasDims.height}
                width={this.state.canvasDims.width}
            />
        )
    }
}

async function generateSVG(width, height){
    d3.selectAll("#svg2 > *").remove();
    let svg = d3.select("#svg2");
}