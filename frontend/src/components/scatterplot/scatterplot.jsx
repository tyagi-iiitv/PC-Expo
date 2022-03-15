import React, {Component} from 'react';
import Plot from 'react-plotly.js';
import equal from 'fast-deep-equal';
import styles from './scatterplot.module.scss';


export default class Scatterplot extends Component {
    constructor(props){
        super(props);
        this.state = {
            x: [],
            y: [],
        }
    }

    componentDidUpdate(prevProps){
        if(!equal(this.props, prevProps)){
            this.setState({
                x: this.props.data.map(o => o[this.props.local_cols[0]]),
                y: this.props.data.map(o => o[this.props.local_cols[1]]),
            })
        }
    }
    
    //To display the scatterplot
    render() {
        return (
            <div className={styles.svgComp}>
                <Plot
                    data={[
                        {   
                            //Creates the original scatterplot based on the embeddings
                            x: this.state.x,
                            y: this.state.y,
                            mode: 'markers',
                            type: 'scatter',
                            marker: {color: '#F08080', size: 5},
                        },
                        // {
                        //     x: this.props.dragdata[0],
                        //     y: this.props.dragdata[1],
                        //     mode: 'markers',
                        //     type: 'scatter',
                        //     marker: {color: '#3182bd', size: 13},
                        // }
                    ]}
                    layout={{
                        showlegend: false, xaxis: {showgrid: false, showticklabels: false, zeroline: false, rangemode: 'tozero'}, yaxis: {showgrid: false, showticklabels: false, zeroline: false, rangemode: 'tozero'}, margin: {b: 10, l: 0, r: 0, t: 0}
                    }}
                    style={{width: 150, height: 125}}
                />
            </div>

        );
        
    }
}