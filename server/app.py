import pandas as pd
from flask import Flask, request
import json
import numpy as np

app = Flask(__name__)

@app.route('/getpoints', methods=['POST'])
def getPoints():
    [end, start] = request.get_json()
    cur_pts = np.where((num_df.bill_length_mm >= start) & 
                            (num_df.bill_length_mm <= end)
                           )
    subset = num_df.iloc[cur_pts]
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