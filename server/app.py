import pandas as pd
from flask import Flask, request

app = Flask(__name__)

@app.route('/getpoints', methods=['POST'])
def getPoints():
    [end, start] = request.get_json()
    print(start, end)
    
    return "OK"

@app.route('/readData', methods=['GET'])
def readData():
    return num_df.to_json()

if __name__ == "__main__":
    df = pd.read_csv('data/penguins.csv')
    df = df.dropna()
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    num_df = df.select_dtypes(include=numerics)
    num_df.to_csv('penguins_num.csv', index=False)
    app.run(debug=True)