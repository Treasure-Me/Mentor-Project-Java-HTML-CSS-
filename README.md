# Project: Matrix Multiplier Mayhem - A Puzzle Game
**Core Concept**: Players must arrange and multiply matrices to transform "data streams" into desired outputs. It's like a circuit/pipeline puzzle but with matrix operations.


# Warning
- Do not under any circumstances touch the javascript file (game.js) and if ever you feel you should use AI to help you, be mindful of the changes you make to the html templates and consider both your CSS and Javascript, since your javascript remains the same every change you make should conform to it. Do not worry, you dont need to know any javascript. This just serves as a warning.

# 📚 Matrix Basics Crash Course

## What is a Matrix?
A matrix is a grid of numbers arranged in rows and columns. Example:

```text
[1, 2]
[3, 4]  ← This is a 2x2 matrix (2 rows, 2 columns)
```

## Matrix Dimensions
- 2x2 matrix: 2 rows, 2 columns → [[a, b], [c, d]]

- 2x3 matrix: 2 rows, 3 columns → [[a, b, c], [d, e, f]]

- 3x2 matrix: 3 rows, 2 columns → [[a, b], [c, d], [e, f]]

## Matrix Multiplication Rules
Two matrices can only be multiplied if:

```text
Columns of first matrix = Rows of second matrix
```

- 2x2 × 2x2 → ✅ Valid (2=2)

- 2x3 × 3x2 → ✅ Valid (3=3)

- 2x2 × 3x2 → ❌ Invalid (2≠3)

## 🎯 Implementation Guide
### Step 1: Understand the Math
- Watch this Matrix [Multiplication Visualization](https://www.youtube.com/watch?v=XkY2DOUCWMU)

- Practice with pen and paper first

- Start with 2x2 matrices, then generalize

## Step 2: Test Your Understanding

```python
# Test case 1: Identity matrix
A = [[1, 2], [3, 4]]
I = [[1, 0], [0, 1]]
# A × I should equal A

# Test case 2: Simple multiplication  
A = [[1, 2], [3, 4]]
B = [[2, 0], [0, 2]]
# A × B should equal [[2, 4], [6, 8]]
```

## Step 3: Implementation Order
1. multiply_matrices - Core algorithm

2. is_matrix_equal - Testing helper

3. generate_random_matrix - Game content

4. _init_levels - Game design

5. find_matrix_inverse - Bonus challenge

## Step 4: Debugging Tips

```python
# Add debug prints to see what's happening
print(f"Multiplying: {A} × {B}")
print(f"Dimensions: {len(A)}x{len(A[0])} × {len(B)}x{len(B[0])}")
print(f"Result: {result}")
```

## Game Design
### The "Story"
- They are "Data Flow Engineers" who need to process raw data streams through transformation matrices to achieve target outputs.

## Game Mechanics
### Level 1-3: Learn the basics

- Given input matrix A and target output C

- Must find the correct transformation matrix B such that A × B = C

### Level 4-6: Multiple transformations

- Input A must go through TWO transformations: A × B × C = Target

- Players place matrices in the correct order

### Level 7+: The Inverse Challenge

- Given output C and transformation B, find the original input A (introducing matrix inverses)

## Test Setup

### 1. Install Test Dependencies
```bash
pip install -r requirements-test.txt
```
### 2. Run Test Commands

#### Run All Tests with Coverage
```bash
pytest --cov=matrix_game --cov-report=html
```
#### Run Specific Test Categories:

#### Backend Algorithm Tests

```bash
pytest test_matrix_operations.py -v
```

#### Flask Application Tests:

```bash
pytest test_flask_app.py -v
```

#### Frontend UI Tests (requires ChromeDriver)

```bash
pytest test_frontend_ui.py -v --selenium
```

#### Integration Tests

```bash
pytest test_integration.py -v --integration
```

#### Run with Coverage Report

```bash
pytest --cov=matrix_game --cov-report=term-missing
```

## Prerequisites

- Python 3.8+
- Chrome browser (for Selenium tests)
- ChromeDriver installed and in PATH
