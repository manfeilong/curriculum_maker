import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs
import time
import csv

# 1️⃣ 你查好課表後，那一頁的網址貼在這裡
SEARCH_URL = "https://portal.ncu.edu.tw/system/cs?token=0fddbGMazk9rBjl4SdaUdqkPLKF"

# 2️⃣ syllabus 的 base URL
DETAIL_BASE = "https://cis.ncu.edu.tw/Course/main/query/byKeywords"
SEMESTER = "1142"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (course-crawler for personal use)"
})


def get_all_serials_from_search():
    """從查詢結果頁抓出所有 serialNo"""
    print("📥 取得查詢結果頁...")
    r = session.get(SEARCH_URL)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")
    serials = set()

    # 結果頁每一個課程通常會有一個連到 syllabus 的連結
    # 其 href 會包含 serialNo=xxxxx
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "serialNo=" in href:
            full = urljoin(DETAIL_BASE, href)
            qs = parse_qs(urlparse(full).query)
            if "serialNo" in qs:
                serial = qs["serialNo"][0]
                serials.add(serial)

    print(f"✅ 找到 {len(serials)} 個 serialNo")
    return sorted(serials)


def fetch_course_detail(serial_no):
    """抓取單一課程的 syllabus，回傳整理後的 dict"""
    params = {
        "serialNo": serial_no,
        "outline": serial_no,
        "semester": SEMESTER,
    }
    url = DETAIL_BASE
    r = session.get(url, params=params, timeout=10)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    # 這個頁面大部分是純文字，我們直接抓全部文字再拆行
    lines = soup.get_text("\n", strip=True).splitlines()

    data = {
        "serialNo": serial_no,
        "semester": "",
        "department": "",
        "course_code": "",
        "instructor": "",
        "name_zh": "",
        "name_en": "",
        "credit": "",
        "teaching_goal": "",
        "teaching_content": "",
        "grading": "",
    }

    # 很醜但實用的 parse：看每一行的開頭關鍵字
    buffer_goal = []
    buffer_content = []
    in_goal = False
    in_content = False

    for line in lines:
        if line.startswith("Semester "):
            data["semester"] = line.replace("Semester", "").strip()
        elif line.startswith("Department "):
            data["department"] = line.replace("Department", "").strip()
        elif line.startswith("Serial Number "):
            # 這行其實可以略過，用我們自己傳入的就好
            pass
        elif line.startswith("Course Code "):
            data["course_code"] = line.replace("Course Code", "").strip()
        elif line.startswith("Instructor "):
            data["instructor"] = line.replace("Instructor", "").strip()
        elif line.startswith("Course Name(Chinese)"):
            data["name_zh"] = line.replace("Course Name(Chinese)", "").strip()
        elif line.startswith("Course Name(English)"):
            data["name_en"] = line.replace("Course Name(English)", "").strip()
        elif line.startswith("Credit "):
            data["credit"] = line.replace("Credit", "").strip()
        elif line.startswith("Teaching goal"):
            in_goal = True
            in_content = False
            buffer_goal.append(line.replace("Teaching goal", "").strip())
        elif line.startswith("Teaching content"):
            in_goal = False
            in_content = True
            buffer_content.append(line.replace("Teaching content", "").strip())
        elif line.startswith("Grading "):
            in_goal = False
            in_content = False
            data["grading"] = line.replace("Grading", "").strip()
        else:
            # 多行目標 / 多行教學內容
            if in_goal:
                buffer_goal.append(line.strip())
            if in_content:
                buffer_content.append(line.strip())

    data["teaching_goal"] = "\n".join(x for x in buffer_goal if x)
    data["teaching_content"] = "\n".join(x for x in buffer_content if x)

    return data


def main():
    serials = get_all_serials_from_search()

    results = []
    for i, s in enumerate(serials, start=1):
        print(f"({i}/{len(serials)}) 抓取課程 {s} ...")
        try:
            info = fetch_course_detail(s)
            results.append(info)
        except Exception as e:
            print(f"⚠️ 抓 {s} 失敗：{e}")
        time.sleep(0.5)  # 禮貌一點，不要打太快

    # 存成 CSV（你也可以改成 JSON）
    fieldnames = [
        "serialNo",
        "semester",
        "department",
        "course_code",
        "instructor",
        "name_zh",
        "name_en",
        "credit",
        "teaching_goal",
        "teaching_content",
        "grading",
    ]
    with open("ncu_courses_1142.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print("🎉 完成，資料已存到 ncu_courses_1142.csv")


if __name__ == "__main__":
    main()
