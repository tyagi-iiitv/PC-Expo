import pandas as pd
from flask import Flask, request
import json
import numpy as np
from scipy import stats

app = Flask(__name__)

@app.route('/getjsondata', methods=['GET'])
def getjsondata():
    matrix = num_df[['bill_length_mm', 'bill_depth_mm']]
    return matrix.to_json(orient='records')

@app.route('/getsliderdata', methods=['POST'])
def getSliderData():
    percent = request.get_json()
    var_range = num_df.bill_length_mm.max() - num_df.bill_length_mm.min()
    window_size = percent/100*var_range
    x_pts = np.linspace(num_df.bill_length_mm.min(), num_df.bill_length_mm.max(), 10) 
    correlation = []
    variance = []
    skewness = []
    print(len(x_pts))
    for x in range(len(x_pts)):
        cur_pts = np.where((num_df.bill_length_mm >= x_pts[x]) & 
                    (num_df.bill_length_mm <= x_pts[x]+window_size))
        print(cur_pts)
        if len(cur_pts[0]) > 0:
            data = num_df.iloc[cur_pts]
            matrix = data[['bill_length_mm', 'bill_depth_mm']]
            correlation.append(matrix.corr()['bill_length_mm']['bill_depth_mm'])
            variance.append(np.cov(matrix.T)[0,1])
            skewness.append(stats.skew(matrix)[0])
    return json.dumps([list(np.nan_to_num(correlation)), list(np.nan_to_num(variance)), list(np.nan_to_num(skewness)), list(x_pts)])

@app.route('/getpoints', methods=['POST'])
def getPoints():
    [end, start] = request.get_json()
    cur_pts = np.where((num_df.bill_length_mm >= start) & 
                            (num_df.bill_length_mm <= end)
                           )
    subset = num_df.iloc[cur_pts]
    window_size = end-start
    x_pts = np.linspace(num_df.bill_length_mm.min(), num_df.bill_length_mm.max(), 10) 
    correlation = []
    variance = []
    skewness = []
    for x in range(len(x_pts)):
        cur_pts = np.where((num_df.bill_length_mm >= x_pts[x]) & 
                    (num_df.bill_length_mm <= x_pts[x]+window_size))
                    
        if len(cur_pts[0]) > 0:
            data = num_df.iloc[cur_pts]
            matrix = data[['bill_length_mm', 'bill_depth_mm']]
            correlation.append(matrix.corr()['bill_length_mm']['bill_depth_mm'])
            variance.append(np.cov(matrix.T)[0,1])
            skewness.append(stats.skew(matrix)[0])
    return json.dumps([list(subset['bill_length_mm']), list(subset['bill_depth_mm'])])
    

@app.route('/readData', methods=['GET'])
def readData():
    return json.dumps([list(num_df['bill_length_mm']), list(num_df['bill_depth_mm'])])

if __name__ == "__main__":
    df = pd.read_csv('data/penguins.csv')
    df = df.dropna()
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    num_df = df.select_dtypes(include=numerics)
    # num_df.to_csv('penguins_num.csv', index=False)
    app.run(debug=True)