from audioop import cross, minmax
import enum
from statistics import variance
import pandas as pd
from flask import Flask, request
from flask.helpers import send_from_directory
import json
import numpy as np
from sklearn.preprocessing import minmax_scale
from scipy import stats
from flask_cors import CORS, cross_origin
import warnings
import os
import sys, time, random
from tsp_solver.greedy import solve_tsp
warnings.filterwarnings("ignore")


UPLOAD_FOLDER = './uploads/'
DOWNLOAD_FOLDER = '../frontend/src/'
ALLOWED_EXTENSIONS = set(['csv'])

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)


df = pd.read_csv('data/penguins_sample.csv')
# df = df.dropna()
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)
num_bins = 20

# Using a lookup datastructure for all the information
# #cols * #cols * #windows * #props * #bins
lookup_info = np.load('./data/lookup_info_penguins.npy')
'''
props = ['pos_corr', 'neg_corr', 'pos_var', 'neg_var', 'pos_skew', 'neg_skew', 'fan', 'neigh', 'clear_grouping', 'density_change', 'split_up', 'outliers']
'''
def getSliderData(col1, col2, percent, bi_hist, xed):
    '''
    Calculates properties based on the window slider
    '''
    global num_df
    # percent = request.get_json()
    var_range = num_df[col1].max() - num_df[col1].min()
    window_size = percent/100*var_range
    x_pts = np.linspace(num_df[col1].min(), num_df[col1].max(), num_bins)
    correlation_pos = []
    correlation_neg = []
    variance_pos = []
    variance_neg = []
    skewness_pos = []
    skewness_neg = []
    convergence = []
    p_vals = []
    para = []
    clear_grouping = []
    density_change = []
    split_up = []
    outlier_ids = np.where(np.absolute(stats.zscore(num_df[col1])) > 2)[0]
    ourliers = []
    # var_th = 0.3
    # skew_th = 0.3
    # max_skew = 1.0
    # max_var = 1.0
    for x in range(len(x_pts)):
        # Calculating convergence
        xbin_ids = np.where(np.logical_and(xed>=x_pts[x], xed<=x_pts[x]+window_size))
        # print(xbin_ids)
        conv_data = bi_hist[xbin_ids,:]
        convergence.append((conv_data > 0).sum())
        # Calculating corr, var, skew
        cur_pts = np.where((num_df[col1] >= x_pts[x]) & 
                    (num_df[col1] <= x_pts[x]+window_size))
        ourliers.append(len(list(set(cur_pts[0]).intersection(outlier_ids))))
        p_vals.append(len(cur_pts[0]))
        if len(cur_pts[0]) > 2:
            data = num_df.iloc[cur_pts]
            matrix = num_df[[col1, col2]]
            x_pts_pcpnr = list(num_df[col1])
            y_pts_pcpnr = list(num_df[col2])
            density_x = stats.gaussian_kde(x_pts_pcpnr)(x_pts_pcpnr)
            density_y = stats.gaussian_kde(y_pts_pcpnr)(y_pts_pcpnr)
            density_change.append(stats.entropy(density_x, density_y))
            sorted_x = sorted(x_pts_pcpnr)
            sorted_y = sorted(y_pts_pcpnr)
            sigma_x = (sorted_x[-1] - sorted_x[0])/10
            sigma_y = (sorted_y[-1] - sorted_y[0])/10
            pair_dist_x = np.array([x_pts_pcpnr])-np.array([x_pts_pcpnr]).T
            pair_dist_y = np.array([y_pts_pcpnr])-np.array([y_pts_pcpnr]).T
            sq_sigma_dists_x = np.exp(-(np.square(pair_dist_x)/sigma_x**2))
            sq_sigma_dists_y = np.exp(-(np.square(pair_dist_y)/sigma_y**2))
            pji_x = sq_sigma_dists_x/sq_sigma_dists_x.sum(axis=1, keepdims=True)
            pji_y = sq_sigma_dists_y/sq_sigma_dists_y.sum(axis=1, keepdims=True)
            dkl = pji_x*np.log(pji_x/pji_y)
            dkl = dkl.sum() - dkl.trace()
            clear_grouping.append(dkl)
            (cur_corr, _) = stats.pearsonr(num_df[col1], num_df[col2])
            cur_var = np.cov(matrix.T)[0,1]
            cur_skew = stats.skew(matrix)[0]
            cur_para = num_df[col2] - num_df[col1]
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
            clear_grouping.append(0)
            density_change.append(0)

    # Normalize all the arrays
    variance_pos = minmax_scale(variance_pos)
    variance_neg = minmax_scale(variance_neg)
    skewness_pos = minmax_scale(skewness_pos)
    skewness_neg = minmax_scale(skewness_neg)
    convergence = minmax_scale(convergence)
    clear_grouping = minmax_scale(clear_grouping)
    density_change = minmax_scale(density_change)
    p_vals = minmax_scale(p_vals)
    outliers = minmax_scale(ourliers)
    split_up = [1-x for x in clear_grouping]
    return [np.nan_to_num(correlation_pos[1:]), 
            np.nan_to_num(correlation_neg[1:]), 
            np.nan_to_num(variance_pos[1:]), 
            np.nan_to_num(variance_neg[1:]),
            np.nan_to_num(skewness_pos[1:]),
            np.nan_to_num(skewness_neg[1:]),
            np.nan_to_num(convergence[1:]),
            np.nan_to_num(para[1:]),
            list(x_pts[1:]),
            np.nan_to_num(p_vals[1:]),
            np.nan_to_num(clear_grouping[1:]),
            np.nan_to_num(density_change[1:]),
            np.nan_to_num(split_up[1:]),
            np.nan_to_num(outliers[1:])
            ]

@app.route('/globaloptimize', methods=['POST'])
@cross_origin()
def globaloptimize():
    vals = request.get_json()
    weights = np.array([
        vals['pos_corr_sliderval']/100,
        vals['neg_corr_sliderval']/100,
        vals['pos_var_sliderval']/100,
        vals['neg_var_sliderval']/100,
        vals['pos_skew_sliderval']/100,
        vals['neg_skew_sliderval']/100,
        vals['fan_sliderval']/100,
        vals['neigh_sliderval']/100,
        vals['clear_grouping_sliderval']/100,
        vals['density_change_sliderval']/100,
        vals['split_up_sliderval']/100,
        vals['outliers_sliderval']/100,
    ])
    percent = int(vals['window_sliderval']/10-1)
    cols = list(num_df.columns)
    weights = weights/weights.sum()
    window_data = lookup_info.sum(axis=-1)
    dim_arr = np.ones((1,window_data.ndim),int).ravel()
    dim_arr[-1] = -1
    weights_reshaped = weights.reshape(dim_arr)
    matrix = window_data*weights_reshaped
    matrix = matrix[:,:,percent,:]
    matrix = matrix.sum(axis=-1)
    matrix = matrix*-1
    seq = solve_tsp(matrix)
    solution = []
    for id in seq:
        solution.append({
            'key': id,
            'name': cols[id] 
        })
    return json.dumps(solution)

@app.route('/getareacharts', methods=['POST'])
@cross_origin()
def getareacharts():
    vals = request.get_json()
    weights = np.array([
        vals['pos_corr_sliderval']/100,
        vals['neg_corr_sliderval']/100,
        vals['pos_var_sliderval']/100,
        vals['neg_var_sliderval']/100,
        vals['pos_skew_sliderval']/100,
        vals['neg_skew_sliderval']/100,
        vals['fan_sliderval']/100,
        vals['neigh_sliderval']/100,
        vals['clear_grouping_sliderval']/100,
        vals['density_change_sliderval']/100,
        vals['split_up_sliderval']/100,
        vals['outliers_sliderval']/100,
    ])
    weights = weights/weights.sum()
    weights = weights.tolist()
    col_seq = vals['selected_list']
    cols = list(num_df.columns)
    percent = int(vals['window_sliderval']/10-1)
    dim_arr = np.ones((1,lookup_info.ndim),int).ravel()
    dim_arr[-2] = -1
    # num_active_props = len(weights) - weights.count(0) + 1
    weights_reshaped = np.array(weights).reshape(dim_arr)
    matrix = lookup_info*weights_reshaped
    matrix = matrix.sum(axis=-2)
    solution = []
    for i in range(len(col_seq)-1):
        solution.append(list(matrix[cols.index(col_seq[i]['name']),cols.index(col_seq[i+1]['name']),percent,:]))
        solution.append(list(np.linspace(num_df[col_seq[i]['name']].min(), num_df[col_seq[i]['name']].max(), num_bins)))
    return json.dumps(solution)


@app.route('/getlocaldata', methods=['POST'])
@cross_origin()
def getlocaldata():
    vals = request.get_json()
    cols = list(num_df.columns)
    col1_name = vals['col1']
    col2_name = vals['col2']
    col1 = cols.index(col1_name)
    col2 = cols.index(col2_name)
    percent = int(vals['window_sliderval']/10-1)
    solution = []
    # First 12 arrays are for props
    for prop in range(12):
        solution.append(lookup_info[col1][col2][percent][prop].tolist())
    # 13th array is for bin points
    solution.append(list(np.linspace(num_df[col1_name].min(), num_df[col1_name].max(), num_bins)))
    # 14th val is window size
    var_range = num_df[col1_name].max()-num_df[col1_name].min()
    solution.append(float((percent+1)/10*var_range))
    return json.dumps({
        'pos_corr': solution[0],
        'neg_corr': solution[1],
        'pos_var': solution[2],
        'neg_var': solution[3],
        'pos_skew': solution[4],
        'neg_skew': solution[5],
        'fan': solution[6],
        'neigh': solution[7],
        'clear_grouping': solution[8],
        'density_change': solution[9],
        'split_up': solution[10],
        'outliers': solution[11],
        'indices': solution[12],
        'window_size': solution[13],
    })

@app.route('/heatmapdata', methods=['POST'])
@cross_origin()
def heatmapdata():
    vals = request.get_json()
    weights = np.array([
        vals['pos_corr_sliderval']/100,
        vals['neg_corr_sliderval']/100,
        vals['pos_var_sliderval']/100,
        vals['neg_var_sliderval']/100,
        vals['pos_skew_sliderval']/100,
        vals['neg_skew_sliderval']/100,
        vals['fan_sliderval']/100,
        vals['neigh_sliderval']/100,
        vals['clear_grouping_sliderval']/100,
        vals['density_change_sliderval']/100,
        vals['split_up_sliderval']/100,
        vals['outliers_sliderval']/100,
    ])
    weights = weights/weights.sum()
    weights = weights.tolist()
    percent = int(vals['window_sliderval']/10-1)
    cols = list(num_df.columns)
    matrix = []
    window_data = lookup_info.sum(axis=-1)
    for i,col1 in enumerate(cols):
        for j,col2 in enumerate(cols):
            if (i!=j):
                # Divide by 256 to normalize the values, since each window has a range b/w 0-1
                matrix.append({'col1': col1, 'col2': col2, 'val': np.sum(window_data[i][j][percent]*weights)})
    matrix_norm_vals = np.array([a['val'] for a in matrix])
    matrix_norm_vals = (matrix_norm_vals-matrix_norm_vals.min())/(matrix_norm_vals.max()-matrix_norm_vals.min()+1e-9)
    for i in range(len(matrix)):
        matrix[i]['val'] = matrix_norm_vals[i]
    return json.dumps([matrix, cols])

@app.route('/defheatmapdata', methods=['GET'])
@cross_origin()
def defheatmapdata():
    global num_df
    cols = list(num_df.columns)
    matrix = []
    for i,col1 in enumerate(cols):
        for j,col2 in enumerate(cols):
            if(i != j):
                matrix.append({'col1': col1, 'col2': col2, 'val': 0})
    return json.dumps([matrix, cols])

@app.route('/getjsondata', methods=['GET'])
@cross_origin()
def getjsondata():
    return num_df.to_json(orient='records')


@app.route('/upload', methods=['POST'])
@cross_origin()
#Function to upload file and read the data
def fileUpload():
    global df, num_df, lookup_info
    target=os.path.join(UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    file_num = int(request.get_json())
    if file_num == 1:
        df = pd.read_csv('./data/cars_sample.csv')
        lookup_info = np.load('./data/lookup_info_cars.npy')
    elif file_num == 2:
        df = pd.read_csv('./data/systems_sample.csv')
        lookup_info = np.load('./data/lookup_info_systems.npy')
    else:
        df = pd.read_csv('./data/penguins_sample.csv')
        lookup_info = np.load('./data/lookup_info_penguins.npy')
    # try:
    #     df = df.sample(n=2000)
    # except:
    #     df = df.sample(n=2000, replace=True)
    # df = df.dropna()
    num_df = df.select_dtypes(include=numerics)
    # num_df.columns = [f'{i}{x[-8:]}' for i, x in enumerate(num_df.columns)]
    return num_df.to_json(orient='records')

@app.route('/getpoints', methods=['POST'])
@cross_origin()
def getPoints():
    [end, start, col1, col2] = request.get_json()
    cur_pts = np.where((num_df[col1] >= start) & 
                            (num_df[col1] <= end)
                           )
    subset = num_df.iloc[cur_pts]
    return json.dumps([list(subset[col1]), list(subset[col2])])
    

@app.route('/readdata', methods=['GET'])
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