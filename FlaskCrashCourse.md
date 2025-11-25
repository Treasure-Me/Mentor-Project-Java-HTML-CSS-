# Flask Crash Course for Python Developers

## 🚀 What is Flask?
Flask is a micro web framework for Python - think of it as a toolkit for building web applications. If you know Python, you already know 80% of Flask!

## 📦 Basic Flask Setup
### Installation

```bash
pip install flask
```

### Minimal Flask App (app.py)

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

Run it:

```bash
python app.py
```
Visit: http://localhost:5000


## 🎯 Core Flask Concepts
### 1. Routes - URL Endpoints

```python
from flask import Flask
app = Flask(__name__)

# Basic route
@app.route('/')
def home():
    return "Home Page"

# Route with parameters
@app.route('/user/<username>')
def show_user(username):
    return f"Hello, {username}!"

# Route with type constraints
@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f"Post #{post_id}"

# Multiple HTTP methods
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return "Logging in..."
    else:
        return "Show login form"
```
### 2. Rendering HTML Templates

```python
from flask import render_template

@app.route('/')
def home():
    return render_template('index.html', title='Home Page', user='John')

@app.route('/matrix-game')
def game():
    level_data = {
        'number': 1,
        'input_matrix': [[1, 2], [3, 4]],
        'target_matrix': [[7, 10], [15, 22]]
    }
    return render_template('game.html', level=level_data)
```

### 3. Handling Request Data

```python
from flask import request

# GET parameters: /search?q=matrix
@app.route('/search')
def search():
    query = request.args.get('q', '')  # Second arg is default
    return f"Searching for: {query}"

# POST form data
@app.route('/submit', methods=['POST'])
def submit():
    username = request.form.get('username')
    password = request.form.get('password')
    return f"User: {username}"

# JSON data from AJAX/fetch
@app.route('/api/solve', methods=['POST'])
def api_solve():
    data = request.get_json()  # Get JSON from request body
    matrices = data.get('matrices', [])
    return {"result": "processed"}
```

### 4. Sending JSON Responses

```python
from flask import jsonify

@app.route('/api/levels')
def api_levels():
    levels = [
        {"id": 1, "name": "Beginner"},
        {"id": 2, "name": "Intermediate"}
    ]
    return jsonify(levels)  # Automatically sets Content-Type: application/json

@app.route('/api/check-solution')
def check_solution():
    return jsonify({
        "correct": True,
        "message": "Good job!",
        "score": 100
    })
```

### 5. Sessions - Remembering Data

```python
from flask import session

app.secret_key = 'your-secret-key-here'  # Required for sessions

@app.route('/login', methods=['POST'])
def login():
    session['user_id'] = 123
    session['username'] = 'john_doe'
    return "Logged in"

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return "Please log in"
    return f"Hello, {session['username']}"

@app.route('/logout')
def logout():
    session.clear()  # Remove all session data
    return "Logged out"
```