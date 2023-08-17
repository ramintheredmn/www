from application import app

app.app_context().push()
if __name__ == "__main__":
    app.run(debug=True)
    app.app_context().push()
