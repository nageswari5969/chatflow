import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c

def test_get_groups_unauthenticated(client):
    res = client.get('/api/groups')
    assert res.status_code == 401

def test_create_group_unauthenticated(client):
    res = client.post('/api/groups', json={'name': 'Test Group'})
    assert res.status_code == 401
