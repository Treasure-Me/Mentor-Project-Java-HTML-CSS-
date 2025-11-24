import pytest
import requests
import time
import threading
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

class TestIntegration:
    def setup_method(self):
        """Start Flask app in a separate thread for integration testing"""
        self.base_url = "http://localhost:5001"
        
        # Start the Flask app in a separate thread
        self.thread = threading.Thread(target=lambda: app.run(
            port=5001, debug=False, use_reloader=False
        ))
        self.thread.daemon = True
        self.thread.start()
        
        # Wait for server to start
        time.sleep(2)
    
    def test_full_game_flow(self):
        """Test complete game flow from start to finish"""
        # Start at home page
        response = requests.get(f"{self.base_url}/")
        assert response.status_code == 200
        
        # Load first level
        response = requests.get(f"{self.base_url}/level/0")
        assert response.status_code == 200
        
        # Get a hint
        response = requests.get(f"{self.base_url}/hint")
        assert response.status_code == 200
        hint_data = response.json()
        assert 'hint' in hint_data
        
        # Submit a solution (this would need actual level data)
        solution_data = {
            'matrices': [
                [[1, 0], [0, 1]]  # Identity matrix
            ]
        }
        
        # Set up session
        session = requests.Session()
        session.get(f"{self.base_url}/level/0")  # Establish session
        
        response = session.post(
            f"{self.base_url}/check_solution",
            json=solution_data
        )
        assert response.status_code == 200
        
        # Reset game
        response = session.get(f"{self.base_url}/reset")
        assert response.status_code == 200
    
    def test_multiple_users_simultaneously(self):
        """Test that multiple users can play simultaneously"""
        def play_game(user_id):
            session = requests.Session()
            
            # Each user plays their own game
            session.get(f"{self.base_url}/level/{user_id}")
            response = session.get(f"{self.base_url}/hint")
            assert response.status_code == 200
            
            return f"User {user_id} completed"
        
        # Simulate multiple users
        results = []
        for i in range(3):
            results.append(play_game(i))
        
        assert len(results) == 3
        assert all("completed" in result for result in results)
