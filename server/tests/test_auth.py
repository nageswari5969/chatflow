import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/chatflow_test'
    with app.test_client() as c:
        yield c

def test_sync_without_token(client):
    res = client.post('/api/auth/sync')
    assert res.status_code == 401

def test_me_without_token(client):
    res = client.get('/api/auth/me')
    assert res.status_code == 401
