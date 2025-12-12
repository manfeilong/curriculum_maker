import time
import requests
import sys

# Try to import selenium, provide helpful error if missing
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    print("Error: Missing dependencies.")
    print("Please run: pip install selenium webdriver-manager requests")
    sys.exit(1)

# Target URL for the actual registration (same as auto_register.py)
REGISTER_URL = "https://cis.ncu.edu.tw/Course/ajax/call/plaincall/SelectCourseService.addCourseBySerialNo.dwr"

HEADERS = {
    "Accept": "*/*",
    "Accept-Language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "Connection": "keep-alive",
    "Content-Type": "text/plain",
    "Origin": "https://cis.ncu.edu.tw",
    "Referer": "https://cis.ncu.edu.tw/Course/main/sign/selectCourse?step=3",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    # Additional headers will be managed by requests session or explicitly passed
}

def get_session_info():
    """
    Launches a browser, waits for user to log in and navigate to the course selection page,
    then extracts JSESSIONID and scriptSessionId.
    """
    print("\n[1/3] Launching Browser...")
    print("      Please log in to the NCU Portal.")
    print("      THEN navigate to 'Course Selection' (選課系統).")
    print("      The script will automatically detect when you are in the right place.")
    
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Do not use headless, user needs to login
    options.add_experimental_option('excludeSwitches', ['enable-logging']) # Suppress generic devtools flags
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    found_info = None
    last_print_time = 0

    try:
        driver.get("https://cis.ncu.edu.tw/Course/main/news/news")
        
        while True:
            try:
                # Heartbeat log every 3 seconds
                if time.time() - last_print_time > 3:
                     sys.stdout.write(".")
                     sys.stdout.flush()
                     last_print_time = time.time()

                # CHECK MAIN FRAME (TOP) FIRST
                # User reported DWR can be found in Top
                try:
                    is_dwr_ready = driver.execute_script("return (typeof dwr !== 'undefined') && (typeof dwr.engine !== 'undefined');")
                    if is_dwr_ready:
                        script_session_id = driver.execute_script("return dwr.engine._scriptSessionId;")
                        cookies = driver.get_cookies()
                        jsessionid = next((c['value'] for c in cookies if c['name'] == 'JSESSIONID'), None)
                        
                        if script_session_id and jsessionid:
                            print("\n\n[2/3] Success! Session Detected (in Main Frame).")
                            print(f"      JSESSIONID: {jsessionid[:6]}...")
                            print(f"      scriptSessionId: {script_session_id[:6]}...")
                            found_info = {
                                "JSESSIONID": jsessionid,
                                "scriptSessionId": script_session_id
                            }
                            break
                except:
                    pass

                # If not found in Top, search through ALL frames
                possible_frames = driver.find_elements(By.TAG_NAME, "frame") + driver.find_elements(By.TAG_NAME, "iframe")
                
                for frame in possible_frames:
                    try:
                        driver.switch_to.frame(frame)
                        
                        # Check for DWR
                        is_dwr_ready = driver.execute_script("return (typeof dwr !== 'undefined') && (typeof dwr.engine !== 'undefined');")
                        
                        if is_dwr_ready:
                            script_session_id = driver.execute_script("return dwr.engine._scriptSessionId;")
                            
                            # Get Cookies from this context
                            cookies = driver.get_cookies()
                            jsessionid = next((c['value'] for c in cookies if c['name'] == 'JSESSIONID'), None)
                            
                            if script_session_id and jsessionid:
                                print("\n\n[2/3] Success! Session Detected.")
                                print(f"      Frame found: {frame.get_attribute('name') or 'unknown'}")
                                print(f"      JSESSIONID: {jsessionid[:6]}...")
                                print(f"      scriptSessionId: {script_session_id[:6]}...")
                                found_info = {
                                    "JSESSIONID": jsessionid,
                                    "scriptSessionId": script_session_id
                                }
                                break 
                    except Exception:
                        pass
                    finally:
                        driver.switch_to.default_content()
                
                if found_info:
                    break
                
                time.sleep(1)
            except Exception as e:
                # If window is closed or other major error
                # print(f"Error checking: {e}")
                time.sleep(1)
                
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nBrowser closed or error: {e}")
    finally:
        print("[*] Closing Browser...")
        try:
            driver.quit()
        except:
            pass
        
    return found_info

def register_course(serial_no, cookie_value, script_session_id):
    """
    Performs the registration request.
    """
    cookies = {
        "JSESSIONID": cookie_value
    }

    data = (
        "callCount=1\n"
        "windowName=\n"
        "c0-scriptName=SelectCourseService\n"
        "c0-methodName=addCourseBySerialNo\n"
        "c0-id=0\n"
        f"c0-param0=number:{serial_no}\n"
        "c0-param1=string:\n"
        "batchId=5\n"
        "page=%2FCourse%2Fmain%2Fsign%2FselectCourse%3Fstep%3D4\n"
        "httpSessionId=\n"
        f"scriptSessionId={script_session_id}\n"
    )

    try:
        print(f"\n[3/3] Registering Course: {serial_no}...")
        response = requests.post(REGISTER_URL, headers=HEADERS, cookies=cookies, data=data)
        response.raise_for_status()
        
        # Simple parsing of the DWR response
        text = response.text
        if "加選成功" in text or "Success" in text:
             print(f"      ✅ RESULT: SUCCESS! ({serial_no})")
        elif "此課程代碼不存在" in text:
             print(f"      ❌ RESULT: Course Not Found ({serial_no})")
        else:
             # Try to extract the error message
             # Usually in handleException or a specific alert
             print(f"      ⚠️  RESULT: Check Status. Response snippet:")
             print(f"          {text[:100]}...")

    except Exception as e:
        print(f"      ❌ ERROR: {e}")

import json
import argparse

def main():
    parser = argparse.ArgumentParser(description='NCU Auto Register Helper')
    parser.add_argument('--json', action='store_true', help='Output session info as JSON and exit')
    args = parser.parse_args()

    if not args.json:
        print("=========================================")
        print("   NCU Auto-Register w/ Login helper")
        print("=========================================")
    
    session_info = get_session_info()
    
    if not session_info:
        if args.json:
            print(json.dumps({"error": "Failed to retrieve session info"}))
        else:
            print("Failed to retrieve session info. Exiting.")
        return

    if args.json:
        # Output ONLY JSON for the backend to parse
        print(json.dumps(session_info))
        return

    jsessionid = session_info['JSESSIONID']
    script_session_id = session_info['scriptSessionId']
    
    while True:
        user_input = input("\nEnter Course Serial No (e.g. 1001, 2002) or 'q' to quit: ").strip()
        if user_input.lower() == 'q':
            break
            
        serials = [s.strip() for s in user_input.split(',') if s.strip()]
        
        for serial in serials:
            register_course(serial, jsessionid, script_session_id)
            time.sleep(0.5)

if __name__ == "__main__":
    main()
