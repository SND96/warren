from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Lesson, db
from wiki_retriever import answer_question_mult

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lessons.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/answer', methods=['POST'])
def get_answer():
    print("get_answer called")
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    answer = answer_question_mult(question)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='127.0.0.1', port=5001)