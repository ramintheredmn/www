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



def sleepstaging (df , hr_weight = 1 , movement_weight = 0 , sd_weight = 0 , resting_hr_weight = 3  , window_size = 30 ,confidence_level = 0.95 ) :
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
        normalized_hr = (df['HeartRate'][i] - window['HeartRate'].min()) / (window['HeartRate'].max() - window['HeartRate'].min())
        normalized_movement = (df['Movement'][i] - window['Movement'].min()) / (window['Movement'].max() - window['Movement'].min())
        normalized_sd = (df['RollingSD'][i] - window['RollingSD'].min()) / (window['RollingSD'].max() - window['RollingSD'].min())
        resting_hr_distance = abs(df['HeartRate'][i] - resting_hr) / (df['HeartRate'].max() - df['HeartRate'].min())
        
        # Sleep Score
        sleep_score = hr_weight * (1 - normalized_hr)  + sd_weight * (1 - normalized_sd) + resting_hr_weight * (1 - resting_hr_distance)
        
        # Wake Score
        wake_score = hr_weight * normalized_hr + sd_weight * normalized_sd + resting_hr_weight * resting_hr_distance
        
        # scores to percentages
        df.at[i, 'SleepProbability'] = sleep_score / total_weight
        df.at[i, 'WakeProbability'] = wake_score / total_weight
    a = list(df['SleepProbability'])
    return list(df['SleepProbability'])


def binarysleep_with_denoise(df, threshold = 0.75 , window_size=20, outlier_weight=0.2):
    sleepstaging(df)
    df['BinarySleep'] = 0

    for i in range(len(df)):
        start_idx = max(0, i - window_size // 2)
        end_idx = min(len(df), i + window_size // 2)
        window = df.iloc[start_idx:end_idx]
        median = window['SleepProbability'].median()
        
        # Apply a threshold
        if df.at[i, 'SleepProbability'] > threshold:
            if df.at[i, 'SleepProbability'] >= median:
                df.at[i, 'BinarySleep'] = 1
            elif df.at[i, 'SleepProbability'] >= median - outlier_weight:
                df.at[i, 'BinarySleep'] = 1
        else:
            df.at[i, 'BinarySleep'] = 0

        return df['BinarySleep']


    



# # Plotting with matplot
# plt.figure(figsize=(10, 6))
# plt.plot(df['Time'], df['SleepProbability']*100, label='Sleep Probability (%)')
# #plt.plot(df['Time'], df['WakeProbability']*100, label='Wake Probability (%)')
# plt.plot(df['Time'], df['HeartRate'], label='Heart Rate')
# plt.legend(loc='upper right')
# plt.xlabel('Time')
# plt.ylabel('Probability (%)')
# plt.title('Sleep and Wake Probability over Time')
# plt.grid(True)
# plt.show()
