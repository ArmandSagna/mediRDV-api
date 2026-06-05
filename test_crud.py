#!/usr/bin/env python3
import urllib.request
import json

# Test GET patients
print('=== GET /api/patients ===')
with urllib.request.urlopen('http://localhost:8000/api/patients') as resp:
    data = json.loads(resp.read())
    total = len(data.get('data', []))
    print('Total patients:', total)
    if data.get('data'):
        print('First 2 patients:')
        print(json.dumps(data['data'][:2], indent=2, ensure_ascii=False))

# Test POST create patient
print('\n=== POST /api/patients (Create) ===')
payload = json.dumps({
    'name': 'Jean Dupont',
    'email': 'jean@example.com',
    'phone': '221771234567',
    'location': 'Dakar',
    'status': 'active'
}).encode('utf-8')

req = urllib.request.Request(
    'http://localhost:8000/api/patients',
    data=payload,
    method='POST',
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(req) as resp:
    new_patient = json.loads(resp.read())
    patient_id = new_patient['data']['id']
    print(json.dumps(new_patient, indent=2, ensure_ascii=False))

# Test GET single patient
print('\n=== GET /api/patients/{} (Read) ==='.format(patient_id))
with urllib.request.urlopen('http://localhost:8000/api/patients/{}'.format(patient_id)) as resp:
    data = json.loads(resp.read())
    print(json.dumps(data, indent=2, ensure_ascii=False))

# Test PUT update patient
print('\n=== PUT /api/patients/{} (Update) ==='.format(patient_id))
payload = json.dumps({
    'name': 'Jean Dupont Updated',
    'status': 'inactive'
}).encode('utf-8')

req = urllib.request.Request(
    'http://localhost:8000/api/patients/{}'.format(patient_id),
    data=payload,
    method='PUT',
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())
    print(json.dumps(data, indent=2, ensure_ascii=False))

# Test DELETE patient
print('\n=== DELETE /api/patients/{} ==='.format(patient_id))
req = urllib.request.Request(
    'http://localhost:8000/api/patients/{}'.format(patient_id),
    method='DELETE'
)

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())
    print(json.dumps(data, indent=2, ensure_ascii=False))

print('\n✅ All CRUD tests completed successfully!')
