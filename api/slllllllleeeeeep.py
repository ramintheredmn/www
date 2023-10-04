import random
import numpy as np
from sleepecg import load_classifier, stage , SleepRecord
import random
data = [
    {'TimeStamp': '1690409880', 'HeartRate': '55'},
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
    {'TimeStamp': '1690413800', 'HeartRate': '62'}
]

def generate_synthetic_r_peaks(timestamps, heart_rates):
    peak_count = 0
    current_time = 0  # in unix seconds, relative to the start of recording
    max_peaks = 0 
    for i in range(len(timestamps) - 1):
        time_interval = timestamps[i + 1] - timestamps[i]
        n_peaks = int(time_interval / (60.0 / heart_rates[i]))
        max_peaks += n_peaks

        for j in range(n_peaks):
            if peak_count >= max_peaks:
                return
            r_peak_interval = (60.0 / heart_rates[i]) + random.uniform(0.001, 0.01)  # Add a small random
            current_time += r_peak_interval
            yield current_time  # Yield the R-peak time as needed
            peak_count += 1


def sleepanalyse(data , min_treshhold = 1500 , sleep_stage_duration = 60 , m_nodata = 1800 , sleep_classification_mode = "ws-gru-mesa") : 
    clf = load_classifier(sleep_classification_mode , "SleepECG")
    stages_mode = {
    "ws-gru-mesa": np.array([0,0,0]),
    "wrn-gru-mesa": np.array([0,0,0,0]),
    "wrn-gru-mesa-weighted": np.array([0,0,0,0]),
    "wake-rem-light-n3": np.array([0,0,0,0,0]),
    "wake-rem-n1-n2-n3": np.array([0,0,0,0,0,0]) ,
    }
    placeholder_array = stages_mode.get(sleep_classification_mode , "Invalid option chosen")
    
    # Convert to NumPy arrays
    timestamps = [int(d['TimeStamp']) for d in data]
    heart_rates = [int(d['HeartRate']) for d in data]

    # Identify long intervals
    long_interval_indices = []
    for i in range(len(timestamps) - 1):
        time_interval = timestamps[i + 1] - timestamps[i]
        if time_interval > m_nodata:  # 30 minutes
            long_interval_indices.append(i)
            


    combined_stages_pred = []
    aggregated_heartbeat_times = []
    start_idx = 0
    for end_idx in long_interval_indices:
        heartbeat_times_list = list(generate_synthetic_r_peaks(
            timestamps[start_idx:end_idx + 1], heart_rates[start_idx:end_idx + 1]
        ))
        aggregated_heartbeat_times.extend(heartbeat_times_list)
            # Check if heartbeat_times_list has enough elements 
        if len(heartbeat_times_list) > min_treshhold: 
            rec = SleepRecord(
                sleep_stage_duration=sleep_stage_duration,
                heartbeat_times=heartbeat_times_list
            )

            stages_pred = stage(clf, rec, return_mode="prob")
            combined_stages_pred.extend(stages_pred)
        else:
            print(f"Skipping segment starting at index {start_idx} because of not enough data.")
            time_interval = timestamps[end_idx + 1] - timestamps[end_idx]
            num_placeholder_blocks = int((time_interval / 60)*2)

            combined_stages_pred.extend([placeholder_array] * num_placeholder_blocks)
        
        # Add placeholder for the long interval

        time_interval = timestamps[end_idx + 1] - timestamps[end_idx]
        num_placeholder_blocks = int((time_interval / 60)*2)

        combined_stages_pred.extend([placeholder_array] * num_placeholder_blocks)
        start_idx = end_idx + 1



    # Handle the last segment if needed
    if start_idx < len(timestamps) - 1:
        heartbeat_times_list = list(generate_synthetic_r_peaks(
            timestamps[start_idx:], heart_rates[start_idx:]
    ))
        if len(heartbeat_times_list) > min_treshhold:
            rec = SleepRecord(
                sleep_stage_duration=sleep_stage_duration,
                heartbeat_times=heartbeat_times_list
            )
            stages_pred = stage(clf, rec, return_mode="prob")
            combined_stages_pred.extend(stages_pred)
        else:
            print(f"Skipping the last segment because of not enough data.")
            time_interval = timestamps[-1] - timestamps[start_idx]
            num_placeholder_blocks = int((time_interval / 60)*2)

            combined_stages_pred.extend([placeholder_array] * num_placeholder_blocks)


    # Convert to a NumPy array for easier modiy later if needed
    combined_stages_pred = np.array(combined_stages_pred)


    return combined_stages_pred


def sleep_rigid_number(data, threshold=0.7, window_size=5, smoothing=True):
    if data.shape[1] == 3:
        if smoothing:
            data[:, 1] = np.convolve(data[:, 1], np.ones(window_size) / window_size, mode='same')
            data[:, 2] = np.convolve(data[:, 2], np.ones(window_size) / window_size, mode='same')
        
        result = np.zeros(data.shape[0], dtype=int)

        # 1 is sleep 2 is wake
        for i in range(data.shape[0]):
            
            if data[i, 1] >= threshold:
                result[i] = 1
            if data[i, 2] >= threshold:
                result[i] = 2

        return result
    if data.shape[1] == 4 :
        if smoothing :
            data[: , 1] = np.convolve(data[:, 1], np.ones(window_size) / window_size, mode='same')
            data[: , 2] = np.convolve(data[:, 2], np.ones(window_size) / window_size, mode='same')
            data[: , 3] = np.convolve(data[:, 3], np.ones(window_size) / window_size, mode='same')
        result = np.zeros(data.shape[0], dtype=int)

        # 1 is nrem , 2 is rem  , 3 is wake
        for i in range(data.shape[0]):
            
            if data[i, 1] >= threshold:
                result[i] = 1
            if data[i, 2] >= threshold:
                result[i] = 2
            if  data[i ,3] >= threshold :
                result[i] = 3
    else :
        print("!Wrong data format")


