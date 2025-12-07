import requests
import time
import urllib.parse

# Configuration
# Replace these with your actual values from the browser
JSESSIONID = "YOUR_JSESSIONID_HERE"  # e.g., CAE3A5B375C9DA267831989A12EA8C37
SCRIPT_SESSION_ID = "YOUR_SCRIPT_SESSION_ID_HERE" # e.g., BE52B2E1898A4DBD0D14B0F5E89A4FAA

# Target URL
URL = "https://cis.ncu.edu.tw/Course/ajax/call/plaincall/SelectCourseService.addCourseBySerialNo.dwr"

HEADERS = {
    "Accept": "*/*",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Connection": "keep-alive",
    "Content-Type": "text/plain",
    "Origin": "https://cis.ncu.edu.tw",
    "Referer": "https://cis.ncu.edu.tw/Course/main/sign/selectCourse?step=3",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Chromium";v="120", "Google Chrome";v="120", "Not_A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}

def register_course(serial_no, cookie_value, script_session_id):
    """
    Attempts to register for a course using the specific DWR protocol payload.
    """
    cookies = {
        "JSESSIONID": cookie_value
    }

    # DWR Payload
    # Note: batchId and callCount are protocol parameters
    data = (
        "callCount=1\n"
        "windowName=\n"
        "c0-scriptName=SelectCourseService\n"
        "c0-methodName=addCourseBySerialNo\n"
        "c0-id=0\n"
        f"c0-param0=number:{serial_no}\n"
        "c0-param1=string:\n"
        "batchId=5\n"
        "page=%2FCourse%2Fmain%2Fsign%2FselectCourse%3Fstep%3D3\n"
        "httpSessionId=\n"
        f"scriptSessionId={script_session_id}\n"
    )

    try:
        print(f"Adding course {serial_no}...")
        response = requests.post(URL, headers=HEADERS, cookies=cookies, data=data)
        response.raise_for_status()
        
        # DWR returns JavaScript code as response
        print(f"Response Status: {response.status_code}")
        print("Response Body Snippet:")
        print("-" * 20)
        print(response.text[:200]) # Print first 200 chars to see what happened
        print("-" * 20)

        if "handleCallback" in response.text:
             # Basic check for success (DWR callbacks usually mean the server processed it)
             # You might need to inspect the response text specific text for "Success" or "Full"
             if "加選成功" in response.text or "Success" in response.text:
                 print("Result: Likely SUCCESS!")
             else:
                 print("Result: Server processed request (Check response text for specific error message e.g., 額滿/衝堂)")
        elif "handleException" in response.text:
            print("Result: EXCEPTION/ERROR returned by server.")
        else:
            print("Result: Unknown response format.")

    except Exception as e:
        print(f"Error: {e}")

def main():
    print("=== NCU Auto-Register Script (DWR Version) ===")
    
    # 1. Get Session Info
    jsessionid = input(f"Enter JSESSIONID (default: {JSESSIONID}): ").strip() or JSESSIONID
    script_session = input(f"Enter scriptSessionId (check payload, default: {SCRIPT_SESSION_ID}): ").strip() or SCRIPT_SESSION_ID
    
    if jsessionid == "YOUR_JSESSIONID_HERE":
        print("Error: You must provide a valid JSESSIONID.")
        return

    # 2. Get Course Info
    while True:
        serial_input = input("\nEnter Course Serial No (e.g. 1052, 2001) or 'q' to quit: ").strip()
        if serial_input.lower() == 'q':
            break
        
        # Support comma separated list
        serials = [s.strip() for s in serial_input.split(',')]
        
        for serial in serials:
            if not serial.isdigit():
                print(f"Skipping invalid: {serial}")
                continue
                
            register_course(serial, jsessionid, script_session)
            # Sleep slightly between requests to be safe
            time.sleep(1)

if __name__ == "__main__":
    main()
