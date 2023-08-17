from sqlalchemy import create_engine



engine = create_engine("mysql+pymysql://xvbut0yxbmx0kyrtkkta:pscale_pw_ls2MOUHaVLNOutqlfRLWM3aJQQFNf5xFjyagS4CdHIg@aws.connect.psdb.cloud/gadget-test?charset=utf8mb4",
                       connect_args={
                           
                           "ssl": {
                                "ssl_ca": "/etc/ssl/cert.pem",
                                
                           
                       }})