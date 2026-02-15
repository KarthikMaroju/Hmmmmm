from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
from openai import OpenAI
from pymongo import MongoClient
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
MONGO_URI = os.getenv('MONGO_URI')  # e.g., 'mongodb+srv://user:pass@cluster.mongodb.net/db'

client = MongoClient(MONGO_URI)
db = client['portfolio_db']
contacts = db['contacts']
chats = db['chats']

openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Basic auth for admin (hardcoded for simplicity; use secure in prod)
ADMIN_USER = 'admin'
ADMIN_PASS = 'password'

def check_auth(username, password):
    return username == ADMIN_USER and password == ADMIN_PASS

@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    data['timestamp'] = datetime.datetime.utcnow()
    contacts.insert_one(data)
    return jsonify({'status': 'success'})

@app.route('/chat', methods=['POST'])
def chat():
    message = request.json['message']
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}]
    )
    reply = response.choices[0].message.content
    chats.insert_one({'user': message, 'ai': reply, 'timestamp': datetime.datetime.utcnow()})
    return jsonify({'reply': reply})

@app.route('/admin', methods=['GET'])
def admin():
    auth = request.authorization
    if not auth or not check_auth(auth.username, auth.password):
        return 'Unauthorized', 401
    contact_msgs = list(contacts.find({}, {'_id': 0}))
    chat_logs = list(chats.find({}, {'_id': 0}))
    return render_template('dashboard.html', contacts=contact_msgs, chats=chat_logs)

if __name__ == '__main__':
    app.run(debug=True)
