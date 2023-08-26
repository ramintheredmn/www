in order to run the app after cloning the repo create a file named "apprun.py" with this contents :


#
    from application import app


    if __name__ == "__main__":
        app.run(debug=True)

#


this file will be ignored with commiting.
