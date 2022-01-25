from audioop import cross, minmax
from statistics import variance
import pandas as pd
from flask import Flask, request
from flask.helpers import send_from_directory
import json
import numpy as np
from sklearn.preprocessing import minmax_scale
from scipy import stats
from flask_cors import CORS, cross_origin


app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)

df = pd.read_csv('data/penguins.csv')
df = df.dropna()
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)
num_df = num_df[['bill_length_mm', 'bill_depth_mm']]
bi_hist, xed, yed = np.histogram2d(num_df.bill_length_mm, num_df.bill_depth_mm, bins=256)
xed = xed[:-1]
yed = yed[:-1]

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
    x_pts = np.linspace(num_df.bill_length_mm.min(), num_df.bill_length_mm.max(), 256)
    correlation_pos = []
    correlation_neg = []
    variance_pos = []
    variance_neg = []
    skewness_pos = []
    skewness_neg = []
    convergence = []
    para = []
    var_th = 0.3
    skew_th = 0.3
    max_skew = 1.0
    max_var = 1.0
    for x in range(len(x_pts)):
        # Calculating convergence
        xbin_ids = np.where(np.logical_and(xed>=x_pts[x], xed<=x_pts[x]+window_size))
        # print(xbin_ids)
        conv_data = bi_hist[xbin_ids,:]
        convergence.append((conv_data > 0).sum())
        # Calculating corr, var, skew
        cur_pts = np.where((num_df.bill_length_mm >= x_pts[x]) & 
                    (num_df.bill_length_mm <= x_pts[x]+window_size))
        # print(cur_pts)
        if len(cur_pts[0]) > 0:
            data = num_df.iloc[cur_pts]
            matrix = data[['bill_length_mm', 'bill_depth_mm']]
            cur_corr = matrix.corr()['bill_length_mm']['bill_depth_mm']
            cur_var = np.cov(matrix.T)[0,1]
            cur_skew = stats.skew(matrix)[0]
            cur_para = matrix['bill_depth_mm'] - matrix['bill_length_mm']
            cur_para = minmax_scale(cur_para)
            para.append(1-stats.iqr(cur_para))
            if cur_corr > 0:
                correlation_pos.append(cur_corr)
                correlation_neg.append(0.0)
            else:
                correlation_neg.append(-1*cur_corr)
                correlation_pos.append(0.0)
            if cur_var > 0:
                variance_pos.append(cur_var)
                variance_neg.append(0.0)
            else:
                variance_pos.append(0.0)
                variance_neg.append(-1*cur_var)
            if cur_skew > 0:
                skewness_pos.append(cur_skew)
                skewness_neg.append(0.0)
            else:
                skewness_pos.append(0.0)
                skewness_neg.append(-1*cur_skew)
        else:
            correlation_pos.append(0.0)
            correlation_neg.append(0.0)
            variance_pos.append(0)
            variance_neg.append(0)
            skewness_pos.append(0)
            skewness_neg.append(0)
            para.append(0)

    # Normalize all the arrays
    variance_pos = minmax_scale(variance_pos)
    variance_neg = minmax_scale(variance_neg)
    skewness_pos = minmax_scale(skewness_pos)
    skewness_neg = minmax_scale(skewness_neg)
    convergence = minmax_scale(convergence)

    return json.dumps([list(np.nan_to_num(correlation_pos)), 
                        list(np.nan_to_num(correlation_neg)), 
                        list(np.nan_to_num(variance_pos)), 
                        list(np.nan_to_num(variance_neg)),
                        list(np.nan_to_num(skewness_pos)),
                        list(np.nan_to_num(skewness_neg)),
                        list(np.nan_to_num(convergence)),
                        list(np.nan_to_num(para)),
                        list(x_pts)])

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