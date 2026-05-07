import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c

def test_get_chats_unauthenticated(client):
    res = client.get('/api/chats')
    assert res.status_code == 401

def test_send_message_unauthenticated(client):
    res = client.post('/api/chats/fake_id/messages', json={'content': 'Hello'})
    assert res.status_code == 401
