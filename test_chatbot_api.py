import requests
import json

def test_chat():
    url = "http://localhost:8000/api/chat"
    payload = {"message": "Hello from tester"}
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        if response.status_code == 200:
            print("Successfully connected to the API!")
            print("Response:", response.json())
        else:
            print(f"Failed to connect. Status code: {response.status_code}")
            print("Error:", response.text)
    except Exception as e:
        print(f"Error: {e}")
        print("Note: Make sure the FastAPI server is running on localhost:8000")

if __name__ == "__main__":
    test_chat()
