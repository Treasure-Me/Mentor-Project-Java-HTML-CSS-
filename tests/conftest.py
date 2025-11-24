import pytest
import sys
import os

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture(scope='session')
def app():
    """Provide Flask app for testing"""
    from app import app as flask_app
    flask_app.config['TESTING'] = True
    return flask_app

@pytest.fixture
def client(app):
    """Provide test client for Flask app"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Provide CLI runner for Flask app"""
    return app.test_cli_runner()
