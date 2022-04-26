#!/usr/bin/env python
# coding: utf-8

# In[3]:


import pandas as pd
import numpy as np
import os
import sys
from sklearn.preprocessing import minmax_scale
from scipy import stats
import time
from concurrent.futures import ProcessPoolExecutor, as_completed


# In[4]:


df = pd.read_csv('fsl-mtc-sample.csv')
df = df.sample(n=2000)
df = df.dropna()


# In[5]:


# Selecting only numerical columns from the dataset
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)


# In[6]:


# Function to calculate all the properties give a pair of features from the dataset
def getSliderData(col1, col2, percent, bi_hist, xed):
    '''
    col1 = name of first feature
    col2 = name of second feature
    percent = Size of the sliding window, percent of total range of col1 to be considered
    bi_hist = 2D histogram for col1 and col2 with each cell measuring how many values go from bin1 to bin2
    xed = bin values for col1
    '''
    var_range = num_df[col1].max() - num_df[col1].min()
    # Sliding window size
    window_size = percent/100*var_range
    # Split the feature into 256 values, the sliding window is iterated over these points
    x_pts = np.linspace(num_df[col1].min(), num_df[col1].max(), 256)
    # Arrays to store different parallel coordinate features for each sliding window
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
    # calculate outliers for Col1, this returns the index of values which are outliers from num_df[col1]
    outlier_ids = np.where(np.absolute(stats.zscore(num_df[col1])) > 2)[0]
    ourliers = []
    # Iterating over each sliding window 
    for x in range(len(x_pts)):
        # Calculating which bins from 2D histogram are in the current sliding window
        xbin_ids = np.where(np.logical_and(xed>=x_pts[x], xed<=x_pts[x]+window_size))
        # This is the formula for convergence
        conv_data = bi_hist[xbin_ids,:]
        convergence.append((conv_data > 0).sum())
        # Get point index values in the current sliding window
        cur_pts = np.where((num_df[col1] >= x_pts[x]) & 
                    (num_df[col1] <= x_pts[x]+window_size))
        # Calculate number of outlier points in current sliding window
        ourliers.append(len(list(set(cur_pts[0]).intersection(outlier_ids))))
        p_vals.append(len(cur_pts[0])) # Ignore this for now
        # Only calculate pcp properties if current sliding window has more than 2 points
        if len(cur_pts[0]) > 10:
            data = num_df.iloc[cur_pts]
            matrix = data[[col1, col2]]
            # Calculating KL divergence for PCP Neighbor Retrieval Technique (PCP-NR)
            # Clear Grouping Calculation
            x_pts_pcpnr = list(matrix[col1])
            y_pts_pcpnr = list(matrix[col2])
            try:
                density_x = stats.gaussian_kde(x_pts_pcpnr)(x_pts_pcpnr)
                density_y = stats.gaussian_kde(y_pts_pcpnr)(y_pts_pcpnr)
                density_change.append(stats.entropy(density_x, density_y))
            except:
                density_change.append(0)
            
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
            # Calculating Corr, Var, and Skewness
            (cur_corr, _) = stats.pearsonr(matrix[col1], matrix[col2])
            cur_var = np.cov(matrix.T)[0,1]
            cur_skew = stats.skew(matrix)[0]
            # Calculating Neighborhood (aka parallelism (para))
            cur_para = matrix[col2] - matrix[col1]
            cur_para = minmax_scale(cur_para)
            para.append(1-stats.iqr(cur_para))
            # Separately assigning pos and neg corr/var/skewness
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


# In[8]:


# Calculating values for each sliding window size, and for every pair of variables

cols = list(num_df.columns)
matrix = []
weights = {
        'clear_grouping': 0.3,
        'split_up': 0.3,
        'density_change': 0.3,
        'neigh': 0.3,
        'fan': 0.3,
        'outliers': 0.3,
        'pos_corr': 0.3,
        'neg_corr': 0.3,
        'pos_var': 0.3,
        'neg_var': 0.3,
        'pos_skew': 0.3,
        'neg_skew': 0.3
    }


def parallel_work(task):
    i,col1,j = task
    #for i,col1 in enumerate(cols):
    #    for j in range(i+1,len(cols)):
    ret = []
    start = time.time()
    bi_hist, xed, _ = np.histogram2d(num_df[col1], num_df[cols[j]], bins=256)
    xed = xed[:-1]
    for percent in range(10,110,10):
        start = time.time()
        [pos_corr, 
         neg_corr, 
         pos_var, 
         neg_var, 
         pos_skew, 
         neg_skew, 
         fan, 
         neigh, 
         pt_bins, 
         p_vals, 
         clear_grouping, 
         density_change, 
         split_up, 
         outliers] = getSliderData(col1, cols[j], percent, bi_hist, xed)
        pos_corr_sum = pos_corr.sum()*weights['pos_corr']
        neg_corr_sum = neg_corr.sum()*weights['neg_corr']
        pos_var_sum = pos_var.sum()*weights['pos_var']
        neg_var_sum = neg_var.sum()*weights['neg_var']
        pos_skew_sum = pos_skew.sum()*weights['pos_skew']
        neg_skew_sum = neg_skew.sum()*weights['neg_skew']
        fan_sum = fan.sum()*weights['fan']
        neigh_sum = neigh.sum()*weights['neigh']
        clear_grouping_sum = clear_grouping.sum()*weights['clear_grouping']
        density_change_sum = density_change.sum()*weights['density_change']
        split_up_sum = split_up.sum()*weights['split_up']
        outliers_sum = outliers.sum()*weights['outliers']
        val = pos_corr_sum + neg_corr_sum + pos_var_sum + neg_var_sum + pos_skew_sum + neg_skew_sum + fan_sum + neigh_sum + clear_grouping_sum + density_change_sum + split_up_sum + outliers_sum
        #matrix.append({'col1': col1, 'col2': cols[j], 'val': val})
        ret.append({'col1': col1, 'col2': cols[j], 'val': val})
    print((time.time()-start)*len(cols)*len(cols)/2)
    #sys.exit() # remove this to run the full loop
    return ret


tasks = [[i,col1,j] for i,col1 in enumerate(cols) for j in range(i+1,len(cols))]
executor = ProcessPoolExecutor(max_workers=os.cpu_count())
futures = []
for task in tasks:
    futures.append(executor.submit(parallel_work, task))
for x in as_completed(futures):
    res = x.result()
    matrix.append(res)

# In[2]:


# The time above shows the estimated time we need to calculate all these properties for each window size. We need to reduce this time to minimum. 
# Some code improvements or parallelization will be helpful


# In[ ]:




