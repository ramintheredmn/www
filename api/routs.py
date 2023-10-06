
from flask import Flask, render_template, request, url_for, redirect, send_from_directory, jsonify, abort # importing this session object to access a variable between routs
from api.database import engine
from flask import session as data_session
from api.dataanalyze import MiBandActivitySample, distinct_userIdExtract_extract_from_table, calculating_moving_average, get_latest_timestamp,extract_selected_userid_data_withDates, extract_selected_userid_steps_withDates
from sqlalchemy import text
from datetime import datetime
from api import app, apiK
from sqlalchemy.orm import sessionmaker
from api.slllllllleeeeeep import sleepanalyse

@app.route('/')
def index():
	return app.send_static_file('index.html')


@app.route('/api/useridlist')
def test_next():

    user_ids_ = distinct_userIdExtract_extract_from_table()
    user_ids = [user_id_a['USER_ID'] for user_id_a in user_ids_] # appending all the recevied usesr_ids into a list (raw data : {USER_ID : "..."} ---> this list :["....", "...."])
    # api_key = request.headers.get('Authorization')
    # if not api_key or api_key.split(" ")[1] != apiK:
    #     abort(401)
    return jsonify({"user_ids" : user_ids})

Session = sessionmaker(bind=engine)
session_dta = Session()

#def insert_table(data):



# storing the post requests as dicts in data_ list
  # ceating a list of recevied post requests
    # {'UserID': '1234567890', 'HeartRates': 
    # [{'TimeStamp': '1690495920', 'HeartRate': '82'},
    #  {'TimeStamp': '1690496100', 'HeartRate': '62'}, 
    # {'TimeStamp': '1690496160', 'HeartRate': '73'}, 
    # {'TimeStamp': '1690496220', 'HeartRate': '72'}, 
    # {'TimeStamp': '1690496280', 'HeartRate': '76'}, 
    # {'TimeStamp': '1690496400', 'HeartRate': '70'}, 
    # {'TimeStamp': '1690496460', 'HeartRate': '118'}, 
    # {'TimeStamp': '1690496520', 'HeartRate': '84'}, 
    # {'TimeStamp': '1690496580', 'HeartRate': '94'}, 
    # {'TimeStamp': '1690496640', 'HeartRate': '102'}, 
    # {'TimeStamp': '1690496700', 'HeartRate': '80'}, 
    # {'TimeStamp': '1690496760', 'HeartRate': '63'}, 
    # {'TimeStamp': '1690496820', 'HeartRate': '67'}, 
    # {'TimeStamp': '1690496880', 'HeartRate': '66'}, 
    # {'TimeStamp': '1690496940', 'HeartRate': '81'}, 
    # {'TimeStamp': '1690497000', 'HeartRate': '68'}, 
    # {'TimeStamp': '1690497060', 'HeartRate': '70'}, 
    # {'TimeStamp': '1690497240', 'HeartRate': '70'}, 
    # {'TimeStamp': '1690497480', 'HeartRate': '74'}, 
    # {'TimeStamp': '1690497540', 'HeartRate': '72'}, 
    # {'TimeStamp': '1690497600', 'HeartRate': '65'}, 
    # {'TimeStamp': '1690497660', 'HeartRate': '64'}, 
    # {'TimeStamp': '1690497780', 'HeartRate': '68'}, 
    # {'TimeStamp': '1690497840', 'HeartRate': '67'}, 
    # {'TimeStamp': '1690497900', 'HeartRate': '69'}]}

    # this is the raw data that client sends

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
        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        
        
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        
        
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]

    except Exception as e:
        return jsonify({"error" : str(e)}), 500

    return jsonify({"heartrate": heart_rates, "timestamps": timestamps})


@app.route('/api/latest_timestamp/<int:userid>')
def lateTime(userid):
     maxTimestamp, minTimestamp = get_latest_timestamp(userid)

     return jsonify({'maxTimestamp' : datetime.fromtimestamp(int(maxTimestamp)+2.5*60*60).strftime('%Y-%m-%d %H:%M:%S'), 'minTimestamp': datetime.fromtimestamp(int(minTimestamp)+2.5*60*60).strftime('%Y-%m-%d %H:%M:%S')})


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



#route for sleep stage detecting
@app.route("/api/sleep/<int:userid>")
def slllllllleeeeeep(userid):

    try:
        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        data_dicts = extract_selected_userid_data_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]
        combined_data = [{'TimeStamp': str(timestamp), 'HeartRate': str(heart_rate)} for timestamp, heart_rate in zip(timestamps, heart_rates)]
        combined_stages_pred = sleepanalyse(combined_data)[1]
        eshah = len(combined_stages_pred.tolist())
        mytss = []
        first_timestamp = timestamps[0]
        for i in range(eshah):
            mytss.append(first_timestamp)
            first_timestamp+=30
            i= i+1


    except Exception as e:
        return jsonify({"error" : str(e)}), 500

    
    #return jsonify({"data": combined_data})
    return jsonify({"combined": combined_stages_pred.tolist(), "donkey": mytss})

@app.route('/api/steps/<int:userid>')
def steps(userid):
    try:
        dt_start = int(request.args.get('startdate')) - 2.5*60*60
        dt_end = int(request.args.get('enddate')) -2.5*60*60
        data_dicts = extract_selected_userid_steps_withDates(userid, dt_start, dt_end)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        steps = [data['STEPS'] for data in data_dicts]
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({"steps": steps, "timestamps": timestamps})
