#!/usr/bin/env python
# coding: utf-8

# In[1]:


from cgitb import lookup
import enum
import pandas as pd
import numpy as np
import os
import sys
from sklearn.preprocessing import minmax_scale
from scipy import stats
import time
from concurrent.futures import ProcessPoolExecutor, as_completed, wait
from tqdm import tqdm
import warnings
warnings.filterwarnings("ignore")


# In[81]:


# df = pd.read_csv('./data/fsl-mtc-sample.csv')
df = pd.read_csv('../data/viz-data-simplified-sample.csv')
# df = df.sample(n=2000, )
df = df.dropna()
# df.to_csv('../data/cars_sample.csv', index=False)

# In[5]:


numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
num_df = df.select_dtypes(include=numerics)


# In[6]:


num_bins = 20


# In[8]:


lookup_info = np.zeros((len(num_df.columns), len(num_df.columns), 10, 12, num_bins), dtype='float32')


# In[68]:


eps = 1e-9


# In[77]:


cols = num_df.columns

def getSliderData(col1, col2, percent, bi_hist, xed, col1_id, col2_id):
    '''
    col1 = name of first feature
    col2 = name of second feature
    percent = Size of the sliding window, percent of total range of col1 to be considered
    bi_hist = 2D histogram for col1 and col2 with each cell measuring how many values go from bin1 to bin2
    xed = bin values for col1
    '''
    global lookup_info, num_bins, num_df, eps
    var_range = num_df[col1].max() - num_df[col1].min()
    # Sliding window size
    window_size = percent/100*var_range
    percent_id = int(percent/10-1)
    # Split the feature into 256 values, the sliding window is iterated over these points
    x_pts = np.linspace(num_df[col1].min(), num_df[col1].max(), num_bins)
    # calculate outliers for Col1, this returns the index of values which are outliers from num_df[col1]
    outlier_ids = np.where(np.absolute(stats.zscore(num_df[col1])) > 2)[0]
    # Iterating over each sliding window 
    for x in range(len(x_pts)):
        # Calculating which bins from 2D histogram are in the current sliding window
        xbin_ids = np.where(np.logical_and(xed>=x_pts[x], xed<=x_pts[x]+window_size))
        # Get point index values in the current sliding window
        cur_pts = np.where((num_df[col1] >= x_pts[x]) & 
                    (num_df[col1] <= x_pts[x]+window_size))
        scaling_factor = len(cur_pts[0])/num_df.shape[0]
        # Calculate number of outlier points in current sliding window
        lookup_info[col1_id, col2_id, percent_id, 11, x] = len(list(set(cur_pts[0]).intersection(outlier_ids)))
        if len(xbin_ids[0]) > 0:
        # This is the formula for convergence
            conv_data = bi_hist[xbin_ids,:]
            lookup_info[col1_id, col2_id, percent_id, 6, x] = (conv_data > 0).sum()/(len(xbin_ids[0])*num_bins)
        # Only calculate pcp properties if current sliding window has more than 10 points
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
                lookup_info[col1_id, col2_id, percent_id, 9, x] = stats.entropy(density_x, density_y)
            except:
                pass
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
            if not np.isnan(dkl):
                lookup_info[col1_id, col2_id, percent_id, 8, x] = dkl
            # Calculating Corr, Var, and Skewness
            (cur_corr, _) = stats.pearsonr(matrix[col1], matrix[col2])
            cur_var = np.corrcoef(matrix.T)[0,1]
            cur_skew = stats.skew(matrix)[0]
            # Calculating Neighborhood (aka parallelism (para))
            max_distance = max(abs(matrix[col2].max()-matrix[col1].min()), abs(matrix[col1].max()-matrix[col2].min()))
            cur_para = (matrix[col2] - matrix[col1])/max_distance
            lookup_info[col1_id, col2_id, percent_id, 7, x] = (1-stats.iqr(cur_para))*scaling_factor
            # Separately assigning pos and neg corr/var/skewness
            if not np.isnan(cur_corr):
                if cur_corr > 0:
                    lookup_info[col1_id, col2_id, percent_id, 0, x] = cur_corr*scaling_factor
                else:
                    lookup_info[col1_id, col2_id, percent_id, 1, x] = -1*cur_corr*scaling_factor
            if not np.isnan(cur_var):
                if cur_var > 0:
                    lookup_info[col1_id, col2_id, percent_id, 2, x] = cur_var*scaling_factor
                else:
                    lookup_info[col1_id, col2_id, percent_id, 3, x] = -1*cur_var*scaling_factor
            if not np.isnan(cur_skew):
                if cur_skew > 0:
                    lookup_info[col1_id, col2_id, percent_id, 4, x] = cur_skew*scaling_factor
                else:
                    lookup_info[col1_id, col2_id, percent_id, 5, x] = -1*cur_skew*scaling_factor
    # return lookup_info[col1_id,col2_id,percent_id,i,:]


# In[3]:

# i,col1,j, col2, percent = 2, 'tot_req', 3, 'reads', 30
# bi_hist, xed, yed = np.histogram2d(num_df[col1], num_df[col2], bins=num_bins)
# xed = xed[:-1]
# getSliderData(col1, col2, percent, bi_hist, xed, i, j)



# In[84]:


def parallel_work(task):
    i,col1,j,col2 = task
    bi_hist, xed, _ = np.histogram2d(num_df[col1], num_df[cols[j]], bins=num_bins)
    xed = xed[:-1]
    for percent in range(10,110,20):
        getSliderData(col1, col2, percent, bi_hist, xed, i, j)
    print(i,j)
    

# In[86]:


def main():
    tasks = []
    global lookup_info
    for i,col1 in enumerate(cols):
        for j,col2 in enumerate(cols):
            if i!=j:
                tasks.append([i,col1,j,col2])
    executor = ProcessPoolExecutor(max_workers=os.cpu_count())
    futures = []
    for task in tasks:
        # futures.append(executor.submit(parallel_work, task))
        parallel_work(task)
    # wait(futures)


# In[86]:

if __name__ == '__main__':
    main()
    for prop_id in range(12):
        for p_id in range(10,110,20):
            prop_max_norm = lookup_info[:,:,int(p_id/10-1),prop_id,:].max()
            prop_min_norm = lookup_info[:,:,int(p_id/10-1),prop_id,:].min()
            lookup_info[:,:,int(p_id/10-1),prop_id,:] = (lookup_info[:,:,int(p_id/10-1),prop_id,:] - prop_min_norm) / (prop_max_norm - prop_min_norm + eps)
    lookup_info[:,:,:,10,:] = 1-lookup_info[:,:,:,8,:]
    np.save('../data/lookup_info_viz_data.npy', lookup_info)