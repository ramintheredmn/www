
from flask import Flask, render_template, request, url_for, redirect, send_from_directory, jsonify, abort # importing this session object to access a variable between routs
from api.database import engine
from flask import session as data_session
from api.dataanalyze import koldata, MiBandActivitySample, distinct_userIdExtract_extract_from_table, calculating_moving_average, get_latest_timestamp,extract_selected_userid_data_withDates, extract_selected_userid_steps_withDates, Userinfo
from sqlalchemy import text
from datetime import datetime
from api import app, apiK
from sqlalchemy.orm import sessionmaker
import pandas as pd
import math
from api.sleepalgo import khiar, sleepstaging, binarysleep_with_denoise
from api.info import infocal


@app.route('/')
def index():
	return app.send_static_file('index.html')


@app.route('/api/useridlist')
def test_next():

    user_ids_ = distinct_userIdExtract_extract_from_table()
    user_ids = [user_id_a['USER_ID'] for user_id_a in user_ids_] # appending all the recevied usesr_ids into a list (raw data : {USER_ID : "..."} ---> this list :["....", "...."])

    return jsonify({"user_ids" : user_ids})

Session = sessionmaker(bind=engine)
session_dta = Session()



@app.route('/receive', methods=['GET', 'POST'])
def receive():
    try:
        received_data = request.get_json()

        if not received_data:
            return 'No data received', 400

        data_ = [received_data]

        for info in data_:
            USER_ID = info['UserID']
            HeartRate = info['HeartRates']
            
            for hr in HeartRate:
                ts = str(hr['TimeStamp'])
                H_R = str(hr['HeartRate'])
                s = str(hr['Steps'])
                
                existing_sample = session_dta.query(MiBandActivitySample).filter_by(USER_ID=USER_ID, TIMESTAMP=ts).first()

                if existing_sample is None:
                    sample = MiBandActivitySample(USER_ID=USER_ID, TIMESTAMP=ts, HEART_RATE=H_R, STEPS=s)
                    session_dta.add(sample)
        
        session_dta.commit()
        return 'Data received', 200

    except Exception as e:
        
        session_dta.rollback()
        return f'An error occurred while processing the data: {str(e)}', 500
    




@app.route('/api/heartrate/<int:userid>')
def get_heartrate(userid):
    
    try:
        STRrangedate = request.args.get('rangedate')
        modifiedRangedatestr = STRrangedate[1:-1]
        rangedate = str(modifiedRangedatestr).split(',')
        print(rangedate, " | ", type(rangedate), len(rangedate))
        if len(rangedate) == 2:

            dt_start = math.floor(int(rangedate[0])/1000)

            dt_end = math.floor(int(rangedate[1])/1000)
        else:
            return jsonify({"error" : "رنج وارد کنید"})        
        
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        
        if not data_dicts:
            return jsonify({"error": "در این بازه زمانی داده ای وجود ندارد"})
        
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]

    except Exception as e:
        return jsonify({"error" : str(e)}), 500
        print(str(e))

    return jsonify({"heartrate": heart_rates, "timestamps": timestamps})


@app.route('/api/latest_timestamp/<int:userid>')
def lateTime(userid):
    try:
        maxTimestamp, minTimestamp = get_latest_timestamp(userid)
        print(maxTimestamp, minTimestamp)
    except Exception as e:
        print(str(e))

    return jsonify({'maxTimestamp' : (int(maxTimestamp)*1000) ,'minTimestamp': (int(minTimestamp)*1000)})


@app.route('/api/windowsize/<int:userid>/<int:windowsize>')
def getMa(windowsize, userid):
    try:
        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]

        ma = calculating_moving_average(heart_rates, int(windowsize))

    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    return jsonify({"ma": ma, 'timestampMA': timestamps})



@app.route('/api/sleep/<int:userid>')
def sleep(userid):
    try:

        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        steps = [int(data['STEPS']) for data in data_dicts]
        heart_rates = [int(data['HEART_RATE']) for data in data_dicts]

        df = pd.DataFrame({"TimeStamp": timestamps, "HeartRate": heart_rates, "Movement": steps})
        _ , _ , _ , nightly_mean_heart_rate_last_week ,_ = infocal(df)

        khiar(df)
        a = sleepstaging(df , resting_hr_weight = nightly_mean_heart_rate_last_week)
        b = binarysleep_with_denoise(df)
        prob_sleep = [0 if math.isnan(x) else x for x in a]
        binary_sleep = [3 if math.isnan(x) else x for x in b]
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return ({"timestamps": timestamps, "sleepP": prob_sleep , "sleepB" :binary_sleep })   
###Reza Test
@app.route('/api/info/<int:userid>')
def info(userid):
    try:
        dt_end = int(datetime.now().timestamp())    
        #subtracking 2592000 to get last 30 days timestamp (30*24*60*60)
        dt_start = dt_end - 2592000
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        steps = [int(data['STEPS']) for data in data_dicts]
        heart_rates = [int(data['HEART_RATE']) for data in data_dicts]

        df = pd.DataFrame({"TimeStamp": timestamps, "HeartRate": heart_rates, "Movement": steps})
        total_mean_heart_rate_last_day , total_mean_heart_rate_last_month , total_mean_heart_rate_last_week , nightly_mean_heart_rate_last_week ,daily_mean_heart_rate_last_week = infocal(df)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return ({"total_mean_heart_rate_last_day": total_mean_heart_rate_last_day, "total_mean_heart_rate_last_month": total_mean_heart_rate_last_month , "total_mean_heart_rate_last_week": total_mean_heart_rate_last_week , "nightly_mean_heart_rate_last_week" : nightly_mean_heart_rate_last_week ,"daily_mean_heart_rate_last_week":daily_mean_heart_rate_last_week} )
###Reza Test End
@app.route('/api/steps/<int:userid>')
def steps(userid):
    try:
        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        steps = [int(data['STEPS']) for data in data_dicts]
        raw_step_agg = []
        step_agg = [0 if x<150 else x for x in raw_step_agg]
        step_agg_timestamps = []

        i = 0
        while i < len(steps):
            agg_sum = sum(steps[i:i+60])
            
            step_agg.append(agg_sum)
            step_agg_timestamps.append(timestamps[i])
            
            i += 60
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({"steps": steps, "timestamps": timestamps, "hourstep": step_agg, "hourtamp": step_agg_timestamps})


@app.route('/api/recuserinfo', methods=['POST'])
def user_infoo():
    
    try:
        received_data = request.get_json()
        print(received_data)
        if not received_data:
            return 'No data received', 400

        data_ = [received_data]

        for info in data_:
            USER_ID = str(info['userid'])
            NAME = info['username']
            LASTNAME = info['lastname']
            GENDER = 1 if info['type'] == "male" else 2 if info['type'] == 'female' else 3
            DATEOFBIRTH = int((datetime.fromisoformat(str(info['dob']).rstrip("Z"))).timestamp() * 1000)
            BLOODGROUP = info['bloodGroup']
            WEIGHT = info['weight']
            HEIGHT = info['height']
            MEDICATIONS = info['medicines']
            

                
            existing_sample = session_dta.query(Userinfo).filter_by(USER_ID=USER_ID).first()
            print(DATEOFBIRTH)
            if existing_sample is None:
                sample = Userinfo(USER_ID=USER_ID, 
                                    NAME = NAME,
                                    LASTNAME = LASTNAME,
                                    GENDER = GENDER,
                                    DATEOFBIRTH = DATEOFBIRTH,
                                    BLOODGROUP = BLOODGROUP,
                                    WEIGHT = WEIGHT,
                                    HEIGHT = HEIGHT,
                                    MEDICATIONS = MEDICATIONS)
                session_dta.add(sample)
        
        session_dta.commit()
        return 'Data received', 200

    except Exception as e:
        print(e)
        session_dta.rollback()
        return f'An error occurred while processing the data: {str(e)}', 500
    