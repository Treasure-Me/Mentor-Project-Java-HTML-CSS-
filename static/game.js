// Matrix Multiplier Mayhem - Game Logic
class MatrixGame {
    constructor() {
        this.currentLevel = 0;
        this.selectedMatrix = null;
        this.placedMatrices = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLevel(this.currentLevel);
        this.generateMatrixPalette();
    }

    setupEventListeners() {
        // Drag and drop events
        document.addEventListener('dragstart', this.handleDragStart.bind(this));
        document.addEventListener('dragover', this.handleDragOver.bind(this));
        document.addEventListener('drop', this.handleDrop.bind(this));

        // Button events
        document.getElementById('verify-btn').addEventListener('click', this.verifySolution.bind(this));
        document.getElementById('hint-btn').addEventListener('click', this.getHint.bind(this));
        document.getElementById('reset-btn').addEventListener('click', this.resetLevel.bind(this));
        document.getElementById('next-level-btn').addEventListener('click', this.nextLevel.bind(this));
        
        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadLevel(parseInt(e.target.dataset.level)));
        });
    }

    handleDragStart(e) {
        if (e.target.classList.contains('draggable-matrix')) {
            this.selectedMatrix = JSON.parse(e.target.dataset.matrix);
            e.dataTransfer.setData('text/plain', e.target.id);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        if (e.target.classList.contains('matrix-slot')) {
            e.target.classList.add('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        if (e.target.classList.contains('matrix-slot')) {
            e.target.classList.remove('drag-over');
            
            const matrixId = e.dataTransfer.getData('text/plain');
            const matrixElement = document.getElementById(matrixId);
            
            if (matrixElement) {
                // Clear previous content
                e.target.innerHTML = '';
                
                // Create visual representation of the matrix
                const matrixVisual = this.createMatrixVisual(this.selectedMatrix);
                e.target.appendChild(matrixVisual);
                
                // Store the placed matrix
                this.placedMatrices.push({
                    slot: e.target.id,
                    matrix: this.selectedMatrix
                });
                
                // Update preview
                this.updateResultPreview();
            }
        }
    }

    createMatrixVisual(matrix) {
        const container = document.createElement('div');
        container.className = 'matrix-visual';
        
        matrix.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            
            row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'matrix-cell';
                cellDiv.textContent = cell;
                rowDiv.appendChild(cellDiv);
            });
            
            container.appendChild(rowDiv);
        });
        
        return container;
    }

    generateMatrixPalette() {
        const palette = document.getElementById('matrix-palette');
        palette.innerHTML = '';

        // Generate some sample matrices for the palette
        const sampleMatrices = [
            [[1, 0], [0, 1]],  // Identity 2x2
            [[2, 0], [0, 2]],  // Scale 2x2
            [[0, 1], [1, 0]],  // Swap 2x2
            [[1, 2], [3, 4]],  // Sample 2x2
            [[1, 0, 0], [0, 1, 0], [0, 0, 1]]  // Identity 3x3
        ];

        sampleMatrices.forEach((matrix, index) => {
            const matrixElement = document.createElement('div');
            matrixElement.className = 'draggable-matrix';
            matrixElement.id = `matrix-${index}`;
            matrixElement.draggable = true;
            matrixElement.dataset.matrix = JSON.stringify(matrix);
            
            matrixElement.appendChild(this.createMatrixVisual(matrix));
            palette.appendChild(matrixElement);
        });
    }

    async loadLevel(levelId) {
        try {
            const response = await fetch(`/level/${levelId}`);
            if (response.ok) {
                this.currentLevel = levelId;
                document.getElementById('level-number').textContent = levelId + 1;
                
                // Reset game state
                this.placedMatrices = [];
                document.querySelectorAll('.matrix-slot').forEach(slot => {
                    slot.innerHTML = 'Drag Matrix Here';
                });
                
                this.updateResultPreview();
                this.hideFeedback();
            }
        } catch (error) {
            console.error('Error loading level:', error);
        }
    }

    updateResultPreview() {
        // TODO: Calculate and display the current result based on placed matrices
        // This would involve multiplying the input matrix with placed matrices
        const preview = document.getElementById('result-preview');
        
        if (this.placedMatrices.length > 0) {
            preview.textContent = 'Matrices placed! Click Verify to check solution.';
            preview.className = 'preview-active';
        } else {
            preview.textContent = 'Drag matrices to transformation slots';
            preview.className = 'preview-inactive';
        }
    }

    async verifySolution() {
        try {
            const matrices = this.placedMatrices.map(pm => pm.matrix);
            
            const response = await fetch('/check_solution', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    matrices: matrices,
                    level: this.currentLevel
                })
            });
            
            const result = await response.json();
            this.showFeedback(result.correct, result.message);
            
            if (result.correct) {
                document.getElementById('next-level-btn').style.display = 'block';
            }
        } catch (error) {
            console.error('Error verifying solution:', error);
            this.showFeedback(false, 'Error verifying solution. Please try again.');
        }
    }

    async getHint() {
        try {
            const response = await fetch('/hint');
            const data = await response.json();
            this.showFeedback('hint', data.hint);
        } catch (error) {
            console.error('Error getting hint:', error);
        }
    }

    showFeedback(type, message) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback feedback-${type}`;
        feedback.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideFeedback();
        }, 5000);
    }

    hideFeedback() {
        document.getElementById('feedback').style.display = 'none';
    }

    resetLevel() {
        this.loadLevel(this.currentLevel);
    }

    nextLevel() {
        this.loadLevel(this.currentLevel + 1);
    }

    // Matrix multiplication utility (client-side for preview)
    multiplyMatrices(a, b) {
        if (!a || !b || a[0].length !== b.length) {
            return null;
        }
        
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matrixGame = new MatrixGame();
});

// Utility functions for matrix operations
const MatrixUtils = {
    // Format matrix for display
    formatMatrix(matrix) {
        return matrix.map(row => `[${row.join(', ')}]`).join('\n');
    },
    
    // Validate matrix dimensions for multiplication
    canMultiply(a, b) {
        return a && b && a[0].length === b.length;
    },
    
    // Generate random matrix
    generateRandomMatrix(rows, cols, min = -5, max = 5) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => 
                Math.floor(Math.random() * (max - min + 1)) + min
            )
        );
    }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatrixGame, MatrixUtils };
}
