import http.client
import json
import time

# 1. Capture Lead
email = "test_flow" + str(int(time.time())) + "@wowlabz.com"
lead_data = {
    "name": "Flow Test User",
    "businessEmail": email
}

conn = http.client.HTTPConnection("localhost", 5000)
headers = {'Content-Type': 'application/json'}

print(f"Step 1: Capturing lead {email}...")
conn.request("POST", "/api/leads", json.dumps(lead_data), headers)
res1 = conn.getresponse()
body1 = res1.read().decode()
print(f"Capture Status: {res1.status}, Response: {body1}")

# Wait a bit for background sheet task
print("Waiting 3s for sheet sync...")
time.sleep(3)

# 2. Submit Score
score_data = {
    "name": "Flow Test User",
    "businessEmail": email,
    "totalScore": 95,
    "maturityLabel": "STANDARDISED",
    "isAbandoned": False,
    "scores": {
        "governance": 20,
        "adoption": 20,
        "collection": 20,
        "integration": 15,
        "compliance": 20
    },
    "classification": {
        "description": "A mature digital framework with high levels of integration and reliability.",
        "bullets": ["Integrated systems", "Reliable governance", "Real-time reporting"]
    }
}

print(f"\nStep 2: Submitting score for {email}...")
conn.request("POST", "/api/leads/score", json.dumps(score_data), headers)
res2 = conn.getresponse()
body2 = res2.read().decode()
print(f"Score Status: {res2.status}, Response: {body2}")

conn.close()
print("\nDone!")
