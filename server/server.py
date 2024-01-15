from flask_cors import CORS
from flask import Flask, request
from model.workflows import *
from controller.workflow import workFlow
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(workFlow, url_prefix='/workflow')


@app.route("/")
def Home():
    return "DHGWorkflow"


@app.after_request
def apply_caching(response):
    if request.method == 'OPTIONS':
        response.status = 200
    return response


if __name__ == '__main__':
    app.run(port=os.getenv('PORT'))
