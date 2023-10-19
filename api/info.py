import numpy as np
import pandas as pd 
### the enterence is an pandas data frame like this :df = pd.DataFrame({"TimeStamp": timestamps, "HeartRate": heart_rates, "Movement": steps})
def infocal (df):
    # Filter for the last day
    last_day_data = df[df['TimeStamp'] >= (df['TimeStamp'].max() - 24 * 3600)]

    # Calculate the mean heart rate for the last day
    total_mean_heart_rate_last_day = last_day_data['HeartRate'].mean()
    
    # Filter for the last month
    last_month_data = df[df['TimeStamp'] >= (df['TimeStamp'].max() - 30 * 24 * 3600)]

    # Calculate the mean heart rate for the last month
    total_mean_heart_rate_last_month = last_month_data['HeartRate'].mean()

    # Filter for the last week
    last_week_data = df[df['TimeStamp'] >= (df['TimeStamp'].max() - 7 * 24 * 3600)]

    # Calculate the mean heart rate for the last week
    total_mean_heart_rate_last_week = last_week_data['HeartRate'].mean()

    # Convert the TimeStamp column to datetime
    last_week_data['TimeStamp'] = pd.to_datetime(last_week_data['TimeStamp'], unit='s')

    # Filter for nighttime hours (9 pm to 9 am)
    nighttime_data = last_week_data[(last_week_data['TimeStamp'].dt.hour >= 21) | (last_week_data['TimeStamp'].dt.hour < 9)]

    # Filter for daytime hours (9 am to 9 pm)
    daytime_data = last_week_data[(last_week_data['TimeStamp'].dt.hour >= 9) & (last_week_data['TimeStamp'].dt.hour < 21)]

    # Calculate the mean heart rate for nighttime hours
    nightly_mean_heart_rate_last_week = nighttime_data['HeartRate'].mean()

    # Calculate the mean heart rate for daytime hours
    daily_mean_heart_rate_last_week = daytime_data['HeartRate'].mean()

    return total_mean_heart_rate_last_day , total_mean_heart_rate_last_month , total_mean_heart_rate_last_week , nightly_mean_heart_rate_last_week ,daily_mean_heart_rate_last_week
