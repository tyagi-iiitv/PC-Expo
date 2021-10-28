import pandas as pd
from flask import Flask

app = Flask(__name__)

@app.route('/readData', methods=['GET'])
def readData():
    return num_df.to_json()

if __name__ == "__main__":
    df = pd.read_csv('data/penguins.csv')
    df = df.dropna()
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    num_df = df.select_dtypes(include=numerics)
    app.run(debug=True)