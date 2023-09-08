from api.database import engine
from sqlalchemy import Column, Integer, String, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
import numpy as np
import pandas as pd
from sqlalchemy import func  

def get_latest_timestamp(user_id):
    query = text('''
        SELECT MAX(TIMESTAMP) AS maxTimestamp, MIN(TIMESTAMP) AS minTimestamp
        FROM MI_BAND_ACTIVITY_SAMPLE
        WHERE USER_ID = :user_id;
    ''')
    

    with engine.connect() as conn:
        result = conn.execute(query, {'user_id': user_id}).fetchone()
        

    return result



Base = declarative_base()


class MiBandActivitySample(Base):     #a class inheriting declarative_base() in order to interact with database with python syntax
    __tablename__ = 'MI_BAND_ACTIVITY_SAMPLE'

    id = Column(Integer, primary_key=True)
    USER_ID = Column(String(50))
    TIMESTAMP = Column(DateTime)
    HEART_RATE = Column(Integer)

def distinct_userIdExtract_extract_from_table():  # function to extract userids from table
    
    with engine.connect() as conn:   # connection to the database
        resultall = conn.execute(text('select distinct USER_ID from MI_BAND_ACTIVITY_SAMPLE'))  # executing the sql command which returns the whole table ## update this time not the whole table just user id column without duplicate
        res = resultall.all()
        dict_userid = []       
        for every_res in res:
            dict_userid.append(every_res._asdict())  # using _asdict method to convert row object to dictionary
    return dict_userid

# function to extract selected user_is's heart_rate data from table more efficeint than last time with this just a part of table comes from database
def extract_selectedUser_data(user_id, time):

# sql query in order to execute data from table with respect to user_id and time interval text() function identifies :user_id and :time as variables and should be passed in execute function as dictionary

    query = text('''
        select distinct TIMESTAMP, HEART_RATE 
        from MI_BAND_ACTIVITY_SAMPLE 
        where USER_ID = :user_id
        and TIMESTAMP >= (
                 select max(TIMESTAMP) - :time
                 from MI_BAND_ACTIVITY_SAMPLE
                 where USER_ID = :user_id
        );
    ''')
    with engine.connect() as conn:
        # if startdate and enddate:
        #     resultall = conn.execute(query_2, {'user_id': user_id, 'start_date': startdate, 'end_date': enddate})
        # else:
        resultall = conn.execute(query, {'user_id':user_id, 'time':time})

        res = resultall.fetchall()
        
        dict_data = [row._asdict() for row in res]

    return dict_data

def extract_selected_userid_data_withDates (userid, startDate, endDate):

    query_2 = text('''
        SELECT DISTINCT TIMESTAMP, HEART_RATE 
        FROM MI_BAND_ACTIVITY_SAMPLE 
        WHERE USER_ID = :user_id
        AND TIMESTAMP BETWEEN :start_date AND :end_date;
    ''')
    with engine.connect() as conn:

        resultall = conn.execute(query_2, {'user_id':userid, 'start_date': startDate, 'end_date':endDate})
        res = resultall.fetchall()
        
        dict_data = [row._asdict() for row in res]

    return dict_data
    



# function for moving average  
def calculating_moving_average(heart_rates, window_size):  # ramin, added the window size variable
    df_heartrates = pd.DataFrame(heart_rates)
    heart_rates_ma = df_heartrates.rolling(window=window_size).mean()
    heart_rates_ma.iloc[:window_size-1, 0] = heart_rates[:window_size-1]
    #heart_rates_ma[:window_size-1] = heart_rates[:window_size-1]
    heart_rates_MA=heart_rates_ma.values.tolist()
    return heart_rates_MA