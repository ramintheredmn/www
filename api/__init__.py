from flask import Flask
from flask_cors import CORS

# set static folder the build folder of next-build to serve files from that
app = Flask(__name__, static_folder='../client/out', static_url_path='/')
CORS(app)


app.config['SECRET_KEY'] = 'c9342b1cff6169aab6ab2019117ff994' # added the secret key to work with session method between requests
apiK = "salamp123salamp"




