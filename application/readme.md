database file is just for connecting to the database which is possible in the server, for local development edit the database.py with the cloude or any other mysql databse 



from sqlalchemy import create_engine

engine = create_engine(
    "mysql+pymysql://username:password@host/databese?charset=utf8mb4"
        connect_args={
                           
                           # if there is
                                
                           
                       }

)
