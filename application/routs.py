import traceback
from flask import Flask, render_template, request, url_for, redirect, send_from_directory, jsonify, session # importing this session object to access a variable between routs
from application.database import engine, MiBandActivitySample, distinct_userIdExtract_extract_from_table, calculating_moving_average, extract_selectedUser_data
from sqlalchemy import text
from datetime import datetime
from application import app
from sqlalchemy.orm import sessionmaker
import pytz
import json



@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')




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

@app.route('/receive', methods=['POST'])
def receive():

    try:
        received_data = request.get_json() # recived data will be stored in received_data at first

        if not received_data:
            return 'No data received', 400

        data_ = [received_data]  # directly appending the dictionary to the list

        for info in data_:  
            USER_ID = info['UserID']
            HeartRate = info['HeartRates']
            for hr in HeartRate:
                # converting the timestamp to integer then formating it to normal tehran datetime
                ### update : due to the database pervious records which were in timestamp this conversion will occur in sending data to front
                ts = int(hr['TimeStamp'])
                H_R = int(hr['HeartRate'])  # converting the heart rate to integer
                #check the exictence of a timestamp
                existing_sample = session_dta.query(MiBandActivitySample).filter_by(USER_ID=USER_ID, TIMESTAMP=ts).first()

                # if it doesn't exist, add new record
                if existing_sample is None:
                    sample = MiBandActivitySample(USER_ID=USER_ID, TIMESTAMP=ts, HEART_RATE=H_R)
                    session_dta.add(sample)

        session_dta.commit()
        return 'Data received', 200

    except Exception as e:
        session_dta.rollback() # Rollback the changes on error
        return f'An error occurred while processing the data: {str(e)}', 500
    
    # data extraction from table, whenever the func is called





# routing to chart page
# @app.route('/chart', methods=['GET'])
# def default_chart():
#     return redirect('/chart/5')

@app.route('/chart', methods=['GET', 'POST'])
def chart():
    #get all unique user_ids
    # window_size=5
    user_ids_ = distinct_userIdExtract_extract_from_table() # calling the funtion to send the user_ids to front in order to select one by user
    user_ids = [user_id_a['USER_ID'] for user_id_a in user_ids_] # appending all the recevied usesr_ids into a list (raw data : {USER_ID : "..."} ---> this list :["....", "...."])
    # dict_res1 = calculating_moving_average(dict_res, window_size)
    #user_ids = list(set([data['USER_ID'] for data in dict_res])) # appending all the user ids to a list
    user_ids.sort(reverse=False) #sorting 
    
    tehran = pytz.timezone('Asia/Tehran')
    meanHR = None
    # If a specific user_id was chosen, filter the data for that user_id
    # global selected_user_id
    # selected_user_id = None
    # time = 3600
    asgar = "Please select User ID, then select a time interval"
    
    if request.method == 'POST':
        
        session['selected_user_id'] = request.form['user_id'] # using the session object in order to access the selected user id between requests
        asgar = "you selected the user id : ", session['selected_user_id']
        
        #selected_user_id = request.form.get('user_id')
        # list_of_last_hour_data_dicts = extract_selectedUser_data(selected_user_id, time)    
        
        # timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP'])).astimezone(tehran).strftime('%Y-%m-%d %H:%M:%S') for data in list_of_last_hour_data_dicts]
        # heart_rates = [data['HEART_RATE'] for data in list_of_last_hour_data_dicts]
    #heart_rates_mo = [data['ROLLING_MEAN'] for data in filtered_data]
    else:
        session['selected_user_id'] = None
    #     heart_rates_mo=[]
    # if heart_rates: #ramin, added a numpy func for mean
        
    #     NHR = np.array([heart_rates])
    #     meanHR = NHR.mean()
    
    return render_template('chart.html', title='chart', selected_user_id=session.get('selected_user_id'), user_ids=user_ids, post_s=asgar)

# this route is for receving requests from server by using the new route don't need for refreshing the /chart page to send new requests( here requests are time intervals which will be use to extract less data from table)
@app.route('/time_interval')
def get_data():

# to get interval from frot    
    interval = request.args.get('interval') # java script will send this
    selected_user_id = session.get('selected_user_id')

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
    tehran = pytz.timezone('Asia/Tehran')

    try:
        data_dicts = extract_selectedUser_data(selected_user_id, time) 
        timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP'])).astimezone(tehran).strftime('%Y-%m-%d %H:%M:%S') for data in data_dicts]
        heart_rates = [data['HEART_RATE'] for data in data_dicts]
        heart_rates_MA= calculating_moving_average(heart_rates,5)

    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    # if interval == 'hour':
    #     time = 3600
    #     list_of_last_hour_data_dicts = extract_selectedUser_data(selected_user_id, time)    
        
    #     timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP'])).astimezone(tehran).strftime('%Y-%m-%d %H:%M:%S') for data in list_of_last_hour_data_dicts]
    #     heart_rates = [data['HEART_RATE'] for data in list_of_last_hour_data_dicts]
    # elif interval == 'day':
    #     time = 86400
    #     list_of_last_hour_data_dicts = extract_selectedUser_data(selected_user_id, time)    
        
    #     timestamps = [datetime.fromtimestamp(int(data['TIMESTAMP'])).astimezone(tehran).strftime('%Y-%m-%d %H:%M:%S') for data in list_of_last_hour_data_dicts]
    #     heart_rates = [data['HEART_RATE'] for data in list_of_last_hour_data_dicts]
        # Fetch data for last day
        # Equivalent of "SELECT ... WHERE `timestamp` >= (SELECT MAX(`timestamp`) - 86400 FROM ...)"

    # ... handle other intervals

    return jsonify({"timestamps": timestamps, "heart_rates": heart_rates, "heart_rates_MA": heart_rates_MA})


@app.route('/data/<int:a>/<username>', methods=['GET'])
def heartrateraw(a, username):
    dict_user_data = None
   
    select = username
    dict_res = distinct_userIdExtract_extract_from_table()
    dict_user_data = extract_selectedUser_data(select, time=a)

    return render_template('data.html', title='raw data', data=dict_res, dict_user_data=dict_user_data)
    



@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@app.route('/signup', methods=['GET', 'PSOT'])
def signup():
    return render_template('login.html')
