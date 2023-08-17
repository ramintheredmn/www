from flask import Flask




app = Flask(__name__)


app.config['SECRET_KEY'] = 'c9342b1cff6169aab6ab2019117ff994' # added the secret key to work with session method between requests


from application import routs

