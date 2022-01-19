from audioop import cross
import pandas as pd
from flask import Flask, request
from flask.helpers import send_from_directory
import json
import numpy as np
from scipy import stats
from flask_cors import CORS, cross_origin


app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

df = pd.read_csv('data/penguins.csv')
df = df.dropna()
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)

@app.route('/getjsondata', methods=['GET'])
@cross_origin()
def getjsondata():
    # global num_df
    matrix = num_df[['bill_length_mm', 'bill_depth_mm']]
    return matrix.to_json(orient='records')

@app.route('/getsliderdata', methods=['POST'])
@cross_origin()
def getSliderData():
    # global num_df
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
@cross_origin()
def getPoints():
    # global num_df
    [end, start] = request.get_json()
    cur_pts = np.where((num_df.bill_length_mm >= start) & 
                            (num_df.bill_length_mm <= end)
                           )
    subset = num_df.iloc[cur_pts]
    return json.dumps([list(subset['bill_length_mm']), list(subset['bill_depth_mm'])])
    

@app.route('/readData', methods=['GET'])
@cross_origin()
def readData():
    # global num_df
    return json.dumps([list(num_df['bill_length_mm']), list(num_df['bill_depth_mm'])])

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    # num_df.to_csv('penguins_num.csv', index=False)
    app.run(debug=True)