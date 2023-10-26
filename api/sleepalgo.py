import pandas as pd
import numpy as np
from scipy import stats

def khiar(df):
    window_size=5
    # Calculate the rolling mean
    df['RollingMean'] = df['HeartRate'].rolling(window=window_size).mean()
    # Calculate the rolling standard error of the mean
    df["rolling_sem"] = df['HeartRate'].rolling(window=window_size).std() / np.sqrt(window_size)
    margin_of_error = df["rolling_sem"] * stats.t.ppf((1 + 0.95) / 2, window_size - 1)
    # Calculate the lower and upper bounds of the rolling confidence interval
    df['LowerCI'] = df['RollingMean'] - margin_of_error
    df['UpperCI'] = df['RollingMean'] + margin_of_error
    df['RollingSD'] = df['HeartRate'].rolling(window=window_size, center=True).std()  # Calculating rolling standard deviation
    df['MovementRollingMean'] = df['Movement'].rolling(window=window_size, center=True).mean()  



def sleepstaging (df , hr_weight = 3 , movement_weight = 5 , sd_weight = 0.5 , resting_hr_weight = 2  , window_size = 50 ) :
    """"
    function for detecting sleep and wake based on heart rate .
    the function uses score based system to score each pair of heart rate and timestamp with percent .
    values have been normalaized .

    """
    df['RollingSD'] = df['HeartRate'].rolling(window=window_size, center=True).std()
    total_weight = hr_weight + movement_weight + sd_weight + resting_hr_weight
    resting_hr = 60  # change this for sure
    # Iterate through each data point
    for i in range(len(df)):
        # start and end indices for the window centered around the current data point
        start_idx = max(0, i - window_size // 2)
        end_idx = min(len(df), i + window_size // 2)
        window = df.iloc[start_idx:end_idx]
        
        # Normalize the features
        movement_range = window['Movement'].max() - window['Movement'].min()
        if movement_range == 0:
            normalized_movement = 1
        else:
            normalized_movement = 1 - (df['Movement'][i] - window['Movement'].min()) / movement_range        
        # Normalize the features
        normalized_hr = (df['HeartRate'][i] - window['HeartRate'].min()) / (window['HeartRate'].max() - window['HeartRate'].min())
        normalized_sd = (df['RollingSD'][i] - window['RollingSD'].min()) / (window['RollingSD'].max() - window['RollingSD'].min())
        resting_hr_distance = (resting_hr - df['HeartRate'][i]) / (df['HeartRate'].max() - df['HeartRate'].min())
        resting_hr_distance = max(0, min(1, resting_hr_distance))  # Clamping to [0, 1] range
        
        # Sleep Score
        sleep_score = movement_weight * normalized_movement + hr_weight * (1 - normalized_hr) + sd_weight * (1 - normalized_sd) + resting_hr_weight * resting_hr_distance
              
        # Wake Score
        wake_score = hr_weight * normalized_hr + sd_weight * normalized_sd + resting_hr_weight * resting_hr_distance
        
        # scores to percentages
        df.at[i, 'SleepProbability'] = sleep_score / total_weight
        df.at[i, 'WakeProbability'] = 100 - (sleep_score / total_weight)
    
    return list(df['SleepProbability'])


def binarysleep_with_denoise(df, threshold=0.15, window_size=10):
    df['BinarySleep'] = 0
    df.loc[df['SleepProbability'] >= threshold, 'BinarySleep'] = 1
    df['BinarySleep'] = df['BinarySleep'].rolling(window=window_size, center=True, min_periods=1).mean()
    df['BinarySleep'] = (df['BinarySleep'] >= 0.5).astype(int)
    return df['BinarySleep']
