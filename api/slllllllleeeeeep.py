import random
import numpy as np
from sleepecg import load_classifier, stage , SleepRecord 
import random
data = [
    {'TimeStamp': '1690401880', 'HeartRate': '55'},
    {'TimeStamp': '1690410000', 'HeartRate': '60'},
    {'TimeStamp': '1690410120', 'HeartRate': '65'},
    {'TimeStamp': '1690410300', 'HeartRate': '62'},
    {'TimeStamp': '1690410600', 'HeartRate': '59'},
    {'TimeStamp': '1690410900', 'HeartRate': '58'},
    {'TimeStamp': '1690411200', 'HeartRate': '61'},
    {'TimeStamp': '1690411320', 'HeartRate': '56'},
    {'TimeStamp': '1690411380', 'HeartRate': '52'},
    {'TimeStamp': '1690411440', 'HeartRate': '50'},
    {'TimeStamp': '1690411500', 'HeartRate': '56'},
    {'TimeStamp': '1690411560', 'HeartRate': '58'},
    {'TimeStamp': '1690411620', 'HeartRate': '60'},
    {'TimeStamp': '1690411680', 'HeartRate': '65'},
    {'TimeStamp': '1690412740', 'HeartRate': '60'},
    {'TimeStamp': '1690412800', 'HeartRate': '62'},
    {'TimeStamp': '1690413800', 'HeartRate': '62'},
    {'TimeStamp': '1690467600', 'HeartRate': '62'}
]
clf = load_classifier("ws-gru-mesa", "SleepECG")

def generate_synthetic_r_peaks(timestamps, heart_rates):
    peak_times = []
    current_time = 0
    max_peaks = 0

    for i in range(len(timestamps) - 1):
        time_interval = timestamps[i + 1] - timestamps[i]
        n_peaks = int(time_interval / (60.0 / heart_rates[i]))
        max_peaks += n_peaks

        # Use list comprehension to generate peak times
        r_peak_intervals = [(60.0 / heart_rates[i]) + random.uniform(0.001, 0.01) for _ in range(n_peaks)]
        peak_times.extend(np.cumsum(r_peak_intervals) + current_time)

        # If we've generated enough peaks, stop
        if len(peak_times) >= max_peaks:
            break

        current_time += time_interval

    return np.array(peak_times)


def sleepanalyse(data , min_no_data = 1800 ,  min_treshhold = 1500 , sleep_stage_duration = 60) : 
    # Convert to NumPy arrays
    timestamps = [int(d['TimeStamp']) for d in data]
    heart_rates = [int(d['HeartRate']) for d in data]

    # Identify long intervals
    long_interval_indices = []
    for i in range(len(timestamps) - 1):
        time_interval = timestamps[i + 1] - timestamps[i]
        if time_interval > min_no_data:  # 30 minutes
            long_interval_indices.append(i)
            




    combined_stages_pred = np.empty((0, 3))
    start_idx = 0
    for end_idx in long_interval_indices:
        heartbeat_times_nparray = generate_synthetic_r_peaks(
            timestamps[start_idx:end_idx + 1], heart_rates[start_idx:end_idx + 1]
        )
            # Check if heartbeat_times_list has enough elements 
        if len(heartbeat_times_nparray) > min_treshhold: 
            rec = SleepRecord(
                sleep_stage_duration=sleep_stage_duration,
                heartbeat_times = heartbeat_times_nparray
            )
            stages_pred = stage(clf, rec, return_mode="prob")
            combined_stages_pred = np.vstack((combined_stages_pred ,stages_pred))
        else:
            print(f"Skipping segment starting at start index ({start_idx}) of data  because of not enough data.")
            time_interval = timestamps[end_idx + 1] - timestamps[end_idx]
            num_placeholder_blocks = int(time_interval / sleep_stage_duration)
            placeholder_array = np.array([0.0, 0.0, 0.0], dtype=np.float32)
            combined_stages_pred = np.vstack((combined_stages_pred ,[placeholder_array] * num_placeholder_blocks))
        
        # Add placeholder for the long interval
        #the place holder is [0,0,0,0]
        time_interval = timestamps[end_idx + 1] - timestamps[end_idx]
        num_placeholder_blocks = int(time_interval / sleep_stage_duration)
        placeholder_array = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        combined_stages_pred = np.vstack((combined_stages_pred,[placeholder_array] * num_placeholder_blocks))
        start_idx = end_idx + 1



    # Handle the last segment if needed
    if start_idx < len(timestamps) - 1:
        heartbeat_times_nparray = generate_synthetic_r_peaks(
            timestamps[start_idx:], heart_rates[start_idx:]
    )
        if len(heartbeat_times_nparray) > min_treshhold:
            rec = SleepRecord(
                sleep_stage_duration=sleep_stage_duration,
                heartbeat_times=heartbeat_times_nparray
            )
            stages_pred = stage(clf, rec, return_mode="prob")
            combined_stages_pred = np.vstack((combined_stages_pred , stages_pred ))
        else:
            print(f"Skipping the last segment because of not enough data.")
            time_interval = timestamps[-1] - timestamps[start_idx]
            num_placeholder_blocks = int(time_interval / sleep_stage_duration)
            placeholder_array = np.array([0.0, 0.0, 0.0], dtype=np.float32)
            combined_stages_pred = np.vstack((combined_stages_pred ,[placeholder_array] * num_placeholder_blocks ))



    return combined_stages_pred

