# Matrix Multiplier Mayhem - Project Instructions

## 🎯 Project Overview

You'll build a web-based matrix multiplication puzzle game where players drag and drop matrices to solve transformation challenges. The frontend JavaScript is already complete - your focus is on the Python backend algorithms and Flask server.

## 📁 Project Structure

```
matrix_game/
├── app.py (YOUR WORK - Flask routes)
├── matrix_lib.py (YOUR WORK - Matrix algorithms)
├── templates/ (YOUR WORK - HTML layout)
│   ├── index.html
│   ├── level_select.html  
│   └── game_board.html
├── static/
│   ├── style.css (YOUR WORK - Optional styling)
│   └── game.js (COMPLETE - Don't modify!)
└── tests/
    ├── test_matrix_operations.py
    └── test_flask_app.py
```

## 🚀 Phase 1: Backend Foundation (Week 1)

### Step 1.1: Implement Basic Matrix Operations (matrix_lib.py)

```python

# Complete these core functions:

def multiply_matrices(self, A, B):
    """
    Multiply two matrices A and B
    Returns: Result matrix or None if dimensions incompatible
    """
    # TODO: Implement matrix multiplication algorithm
    pass

def is_matrix_equal(self, A, B, tolerance=1e-6):
    """
    Check if two matrices are equal (within floating-point tolerance)
    """
    # TODO: Implement matrix comparison
    pass

def generate_available_matrices(self, level_id):
    """
    Generate a list of matrices players can use for each level
    """
    # TODO: Create appropriate matrices for each difficulty level
    pass

```

### Step 1.2: Create Game Levels (matrix_lib.py)

```python
def _init_levels(self):
    """
    Design 8 progressively challenging levels:
    - Levels 1-3: 2x2 matrix multiplication
    - Levels 4-6: 3x3 matrices and multiple transformations  
    - Levels 7-8: Complex challenges with inverses/larger matrices
    """
    return [
        {
            "name": "Level 1: Identity Challenge",
            "input": [[1, 2], [3, 4]],
            "target": [[1, 2], [3, 4]],  # A × I = A
            "hint": "What matrix doesn't change the input?"
        },
        # TODO: Design 7 more creative levels
    ]

```

### Step 1.3: Test Your Algorithms

```bash
# Run the matrix operation tests
pytest tests/test_matrix_operations.py -v
```

## 🌐 Phase 2: Flask Server (Week 1-2)

### Step 2.1: Complete Flask Routes (app.py)

```python
@app.route('/check_solution', methods=['POST'])
def check_solution():
    """
    Validate the player's matrix sequence
    Expected JSON: {'matrices': [A, B, C, ...]}
    """
    # TODO: 
    # 1. Get matrices from request.json
    # 2. Multiply them in sequence using your matrix_lib
    # 3. Compare result with level target
    # 4. Return JSON with {'correct': True/False, 'message': '...'}
    pass

@app.route('/level/<int:level_id>')
def load_level(level_id):
    """
    Serve the game board with level data
    """
    # TODO:
    # 1. Get level data from matrix_lib
    # 2. Pass level info to template
    # 3. Include available matrices for the level
    pass
```

#### NB: I have already implemented some of the above for you but I left it as is in this guide to help you understand what is being done and how it is done.

### Step 2.2: Add Session Management

```python
# Track player progress across levels
session['current_level'] = level_id
session['completed_levels'] = [0, 1, 2]  # Track which levels are completed
```

### Step 2.3: Test Flask Routes

```bash
# Run the Flask application tests
pytest tests/test_flask_app.py -v
```
## NB: Make sure your server (app.py) is running before your run your front-end tests since they will fail if you run without it.
## 🎨 Phase 3: Frontend Integration (Week 2)

### Step 3.1: Complete HTML Templates

```templates/game_board.html:```

```html
<!-- Ensure these elements exist for JavaScript to work -->
<div id="input-matrix">{% for row in level.input %}...{% endfor %}</div>
<div id="target-matrix">{% for row in level.target %}...{% endfor %}</div>
<div id="matrix-palette"><!-- Available matrices will appear here --></div>
<button id="verify-btn">Verify Solution</button>
<div id="feedback"><!-- Messages will appear here --></div>
```

### Step 3.2: Style the Game (static/style.css)

```css
/* Make it look professional */
.matrix-cell { /* Style matrix cells */ }
.draggable-matrix { /* Style draggable elements */ }
.feedback-correct { /* Success messages */ }
```

### Step 3.3: Test Full Integration

```bash
# Start the Flask server
python app.py

# Manual testing checklist:
# ✅ Home page loads
# ✅ Level selection works  
# ✅ Can drag matrices
# ✅ Verify button sends data to backend
# ✅ Correct solutions are recognized
# ✅ Hints are helpful
# ✅ Progress is saved between levels
```

## 🧪 Phase 4: Testing & Polish (Week 3)

### Step 4.1: Write Comprehensive Tests

```python
# tests/test_matrix_operations.py
def test_matrix_multiplication():
    # Test various matrix dimensions
    # Test edge cases (zero matrices, identity, incompatible)
    pass

def test_solution_validation():
    # Test correct/incorrect solutions
    # Test multiple matrix sequences
    pass
```

### Step 4.2: Add Error Handling

```python
# Handle these edge cases:
- Empty matrix sequences
- Incompatible dimensions  
- Invalid JSON data
- Non-existent levels
```

### Step 4.3: Game Balance & UX

- Test level difficulty progression
- Ensure hints are actually helpful
- Verify the game is fun and educational

## 🎯 Success Criteria
### Your game should have:

### Functional Requirements:
✅ 8 playable levels with increasing difficulty

✅ Correct matrix multiplication for all test cases

✅ Working drag-and-drop interface (JavaScript handles this)

✅ Solution verification with helpful feedback

✅ Progress tracking across levels

✅ Helpful hint system

### Technical Requirements:
✅ All matrix algorithms implemented in Python

✅ Flask server handles all game logic

✅ Clean, readable code with good comments

✅ Comprehensive test coverage

✅ Error handling for edge cases

### Code Quality:
✅ Functions are well-documented

✅ Code follows Python style guide (PEP 8)

✅ Meaningful variable names

✅ Proper separation of concerns

## 🆘 When You Get Stuck
### Common Issues & Solutions:
- Matrices won't drag? → Check if HTML elements have correct CSS classes

- Verify button does nothing? → Check browser console for JavaScript errors

- "Internal Server Error"? → Check Flask debug output in terminal

- Solutions always wrong? → Debug your multiply_matrices function

- Progress not saving? → Verify session management in Flask

### Debugging Tools:

```python
# Add debug prints
print(f"Matrix A: {A}")
print(f"Matrix B: {B}") 
print(f"Result: {result}")

# Use Flask debugger
@app.route('/debug')
def debug():
    return jsonify({
        'session': dict(session),
        'levels': game.levels
    })
```

## 📋 Final Submission Checklist
- All 8 levels are playable and logically progressive

- Matrix multiplication works for all test cases

- Solution verification is accurate

- Game tracks progress correctly

- All Flask routes work as expected

- Tests pass with good coverage

- Code is clean and well-commented

- Game is actually fun to play!

## 🎮 Bonus Challenges (If you finish early)
1. Add a level editor - Let players create their own puzzles

2. Implement matrix inverses - For advanced levels

3. Add animations - Show the matrix transformation process

4. Create a scoring system - Based on moves and time

5. Add sound effects - For better game feel

### **Remember:** The JavaScript frontend is already complete. Your job is to make the Python backend so good that the frontend has something great to talk to! 🚀
