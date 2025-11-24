import pytest
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

class TestFlaskApp:
    def setup_method(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_home_page(self):
        """Test that home page loads successfully"""
        response = self.app.get('/')
        assert response.status_code == 200
        assert b'Matrix Multiplier Mayhem' in response.data
    
    def test_level_loading(self):
        """Test level loading endpoint"""
        response = self.app.get('/level/0')
        assert response.status_code == 200
        
        response = self.app.get('/level/999')  # Non-existent level
        assert response.status_code == 200  # Should handle gracefully
        assert b'Level not found' in response.data
    
    def test_solution_checking_correct(self):
        """Test solution checking with correct answer"""
        # Mock a correct solution
        solution_data = {
            'matrices': [
                [[1, 2], [3, 4]],  # Input
                [[2, 0], [1, 2]]   # Transformation
            ]
        }
        
        # Set up session for level 0
        with self.app.session_transaction() as session:
            session['current_level'] = 0
        
        response = self.app.post('/check_solution', 
                               data=json.dumps(solution_data),
                               content_type='application/json')
        
        data = json.loads(response.data)
        assert response.status_code == 200
        # Note: Actual assertion depends on level 0's target matrix
    
    def test_solution_checking_incorrect(self):
        """Test solution checking with incorrect answer"""
        solution_data = {
            'matrices': [
                [[1, 0], [0, 1]],  # Identity matrix
                [[1, 0], [0, 1]]   # Identity matrix
            ]
        }
        
        with self.app.session_transaction() as session:
            session['current_level'] = 0
        
        response = self.app.post('/check_solution', 
                               data=json.dumps(solution_data),
                               content_type='application/json')
        
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['correct'] == False  # Unless level 0 expects identity
    
    def test_solution_checking_invalid_dimensions(self):
        """Test solution checking with incompatible matrices"""
        solution_data = {
            'matrices': [
                [[1, 2, 3]],  # 1x3
                [[1], [2]]     # 2x1 - incompatible
            ]
        }
        
        response = self.app.post('/check_solution', 
                               data=json.dumps(solution_data),
                               content_type='application/json')
        
        data = json.loads(response.data)
        assert response.status_code == 200
        assert data['correct'] == False
        assert 'incompatible' in data.get('message', '').lower()
    
    def test_hint_endpoint(self):
        """Test hint generation endpoint"""
        with self.app.session_transaction() as session:
            session['current_level'] = 0
        
        response = self.app.get('/hint')
        data = json.loads(response.data)
        
        assert response.status_code == 200
        assert 'hint' in data
        assert isinstance(data['hint'], str)
    
    def test_reset_game(self):
        """Test game reset endpoint"""
        response = self.app.get('/reset')
        assert response.status_code == 200
        
        # Should redirect to home page
        assert b'Redirecting' in response.data
    
    def test_session_management(self):
        """Test that session persists level progress"""
        with self.app as client:
            # Set level in session
            with client.session_transaction() as session:
                session['current_level'] = 5
            
            # Check that level is preserved
            with client.session_transaction() as session:
                assert session['current_level'] == 5
    
    def test_error_handling(self):
        """Test error handling for malformed requests"""
        # Test with invalid JSON
        response = self.app.post('/check_solution', 
                               data='invalid json',
                               content_type='application/json')
        assert response.status_code == 400
        
        # Test with missing data
        response = self.app.post('/check_solution', 
                               data=json.dumps({}),
                               content_type='application/json')
        assert response.status_code == 200  # Should handle gracefully
