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
import warnings
import os
warnings.filterwarnings("ignore")


UPLOAD_FOLDER = './uploads/'
DOWNLOAD_FOLDER = '../frontend/src/'
ALLOWED_EXTENSIONS = set(['csv'])

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)


df = pd.read_csv('data/penguins.csv')
df = df.dropna()
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)
# num_df = num_df[['bill_length_mm', 'bill_depth_mm']]
bi_hist, xed, yed = np.histogram2d(num_df.bill_length_mm, num_df.bill_depth_mm, bins=256)
xed = xed[:-1]
yed = yed[:-1]

@app.route('/heatmapdata', methods=['POST'])
@cross_origin()
def heatmapdata():
    global num_df
    vals = request.get_json()
    cols = list(num_df.columns)
    matrix = {}
    for col1 in cols:
        matrix[col1] = {}
        for col2 in cols:
            matrix[col1][col2] = 0.2
    return json.dumps(matrix)

@app.route('/defheatmapdata', methods=['GET'])
@cross_origin()
def defheatmapdata():
    global num_df
    cols = list(num_df.columns)
    matrix = []
    for i,col1 in enumerate(cols):
        for j in range(i,len(cols)):
            matrix.append({'col1': col1, 'col2': cols[j], 'val': 0.2})
    return json.dumps([matrix, cols])

@app.route('/getjsondata', methods=['GET'])
@cross_origin()
def getjsondata():
    return num_df.to_json(orient='records')


@app.route('/upload', methods=['POST'])
@cross_origin()
#Function to upload file and read the data
def fileUpload():
    global df, num_df
    target=os.path.join(UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    # logger.info("welcome to upload`")
    file = request.files['file'] 
    # filename = secure_filename(file.filename)
    filename = "data.csv"
    destination="/".join([target, filename])
    file.save(destination)
    df = pd.read_csv('uploads/data.csv')
    try:
        df = df.sample(n=2000)
    except:
        df = df.sample(n=2000, replace=True)
    df = df.dropna()
    # numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    num_df = df.select_dtypes(include=numerics)
    num_df.columns = [f'{i}_{x[:4]}' for i, x in enumerate(num_df.columns)]
    return num_df.to_json(orient='records')

@app.route('/getsliderdata', methods=['POST'])
@cross_origin()
def getSliderData():
    '''
    Calculates properties based on the window slider
    clear grouping, density change, split up, neighborhood, pos/neg corr, pos/neg var, pos/neg skew, fan, outliers
    '''
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
    p_vals = []
    para = []
    clear_grouping = []
    density_change = []
    split_up = []
    outlier_ids = np.where(np.absolute(stats.zscore(num_df.bill_length_mm)) > 2)[0]
    ourliers = []
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
        ourliers.append(len(list(set(cur_pts[0]).intersection(outlier_ids))))
        p_vals.append(len(cur_pts[0]))
        if len(cur_pts[0]) > 2:
            data = num_df.iloc[cur_pts]
            matrix = data[['bill_length_mm', 'bill_depth_mm']]
            x_pts_pcpnr = list(matrix['bill_length_mm'])
            y_pts_pcpnr = list(matrix['bill_depth_mm'])
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
            (cur_corr, _) = stats.pearsonr(matrix['bill_length_mm'], matrix['bill_depth_mm'])
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
    return json.dumps([list(np.nan_to_num(correlation_pos[1:])), 
                        list(np.nan_to_num(correlation_neg[1:])), 
                        list(np.nan_to_num(variance_pos[1:])), 
                        list(np.nan_to_num(variance_neg[1:])),
                        list(np.nan_to_num(skewness_pos[1:])),
                        list(np.nan_to_num(skewness_neg[1:])),
                        list(np.nan_to_num(convergence[1:])),
                        list(np.nan_to_num(para[1:])),
                        list(x_pts[1:]),
                        window_size,
                        list(np.nan_to_num(p_vals[1:])),
                        list(np.nan_to_num(clear_grouping[1:])),
                        list(np.nan_to_num(density_change[1:])),
                        list(np.nan_to_num(split_up[1:])),
                        list(np.nan_to_num(outliers[1:]))])

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