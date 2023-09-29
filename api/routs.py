
from flask import Flask, render_template, request, url_for, redirect, send_from_directory, jsonify, session, abort # importing this session object to access a variable between routs
from api.database import engine
from api.dataanalyze import MiBandActivitySample, distinct_userIdExtract_extract_from_table, calculating_moving_average, extract_selectedUser_data, get_latest_timestamp,extract_selected_userid_data_withDates
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
    

@app.route('/api/user_id', methods=['POST'])  # a seprate route just for getting the choosen user id 
def user_id():
    selected_user_id = None
    if request.method == 'POST':
        
        session['selected_user_id'] = request.json # using the session object in order to access the selected user id between requests
        selected_user_id = session['selected_user_id']

    else:
        session['selected_user_id'] = None

    
    return jsonify({"selected_user_id": selected_user_id})

@app.route('/api/window_size', methods=['POST']) # a seprate route just for getting the window size
def window_size():
    session['window_size'] = 5
    if request.method == 'POST':
        interval = session.get('interval')
        selected_user_id = session.get('selected_user_id')
        window_sizee = request.form.get('window_size')
        session['window_size'] = window_sizee

        if not selected_user_id or not interval:
            return jsonify({"error": "Please choose user id and time interval first"})

    return jsonify({"window_size": window_sizee})

@app.route('/api/latest_timestamp')
def lateTime():
     user_id = request.args.get('userid')
     maxTimestamp, minTimestamp = get_latest_timestamp(user_id)

     return jsonify({'maxTimestamp' : datetime.fromtimestamp(int(maxTimestamp)+2.5*60*60).strftime('%Y-%m-%d %H:%M:%S'), 'minTimestamp': datetime.fromtimestamp(int(minTimestamp)+2.5*60*60).strftime('%Y-%m-%d %H:%M:%S')})






@app.route('/api/heartrate/<int:userid>/<int:time>')
def get_heartrate(userid, time):
    
    try:
        data_dicts = extract_selectedUser_data(userid, time)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]
        session['heartrate'] = heart_rates
        session['selected'] = userid
    except Exception as e:
        return jsonify({"error" : str(e)}), 500

    return jsonify({"heartrate": heart_rates, "timestamps": timestamps})

@app.route('/api/windowsize/<int:userid>/<int:windowsize>/<int:time>')
def getMa(windowsize,userid,time):
    try:
        data_dicts = extract_selectedUser_data(userid, time)
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
        data_dicts = extract_selectedUser_data(userid, 43200)
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
        data_dicts = extract_selectedUser_data(userid, 43200)
        timestamps = [(int(data['TIMESTAMP'])) for data in data_dicts]
        steps = [data['STEPS'] for data in data_dicts]
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({"steps": steps, "timestamps": timestamps})






@app.route('/api/time_interval')
def get_data():

# to get interval from front  
    
    interval = request.args.get('interval') # java script will send this
    selected_user_id = session.get('selected_user_id')
    selected_user_id = request.args.get('userid')
    entered_window_size = request.args.get('windowsize')
    if  selected_user_id == None:
        return jsonify({"error" : "User id not selected"}), 400   # using flask jasinify to send real json to javasctrpt
   
    time_intervals = {      # this dictionary is used to choose the time interval bc the database stores tinestamps which are in seconds menha kardane 3600 will result in the last hour (60 *60)
        
        'hour': 3600,
        'day' : 86400,
        'month' : 2592000
    }

    if interval not in time_intervals:
        return jsonify({"error": "Invalid time interval"}), 400
    
    time = time_intervals[interval] # passing the key 'interval' recevied from js to get its value in second
    #tehran = pytz.timezone('Asia/Tehran')

    try:
        data_dicts = extract_selectedUser_data(selected_user_id, time)
        timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP']) + 2.5*60*60).strftime('%Y-%m-%d %H:%M:%S') for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]
        steps = [data['STEPS'] for data in data_dicts]
        window_sizee = 5
        if 'window_size' in session:
            
            window_sizee = session['window_size']
        elif entered_window_size:
             window_sizee = entered_window_size
        else:
            window_sizee = 5
        
        heart_rates_MA= calculating_moving_average(heart_rates,int(window_sizee))
        
    except Exception as e:
        return jsonify({"error" : str(e)}), 500


    return jsonify({"timestamps": timestamps, "heart_rates": heart_rates, "heart_rates_MA": heart_rates_MA, "steps": steps})


@app.route('/api/calenderTimeinterval')
def calTime():
         

    selected_user_id = session.get('selected_user_id')
    selected_user_id = request.args.get('userid')
    entered_window_size = request.args.get('windowsize')
    start_date = datetime.fromisoformat(request.args.get('startdate')).timestamp()
    end_date = datetime.fromisoformat(request.args.get('enddate')).timestamp()
    if  selected_user_id == None:
        return jsonify({"error" : "User id not selected"}), 400   # using flask jasinify to send real json to javasctrpt
   

    #tehran = pytz.timezone('Asia/Tehran')

    try:
        data_dicts = extract_selected_userid_data_withDates(selected_user_id, startDate=start_date, endDate=end_date)
        timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP']) + 2.5*60*60).strftime('%Y-%m-%d %H:%M:%S') for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]
        window_sizee = 5
        if 'window_size' in session:
            
            window_sizee = session['window_size']
        elif entered_window_size:
             window_sizee = entered_window_size
        else:
            window_sizee = 5
        
        heart_rates_MA= calculating_moving_average(heart_rates,int(window_sizee))
        
    except Exception as e:
        return jsonify({"error" : str(e)}), 500


    return jsonify({"timestamps": timestamps, "heart_rates": heart_rates, "heart_rates_MA": heart_rates_MA})
     
