import requests
from bs4 import BeautifulSoup
import csv
import time

BASE_URL = "https://cis.ncu.edu.tw/Course/main/query/byKeywords"
SEMESTER = "1142"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (NCU course crawler for personal use)"
})

# 把 HTML 轉成一個 dict
def parse_course_html(html: str, serial_no: str):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="t7")
    if table is None:
        return None

    # 想要的欄位對應
    mapping = {
        "Semester": "semester",
        "Department": "department",
        "Serial Number": "serial_no",
        "Course Code": "course_code",
        "Instructor": "instructor",
        "Course Name(Chinese)": "name_zh",
        "Course Name(English)": "name_en",
        "Educational System": "edu_system",
        "Credit": "credit",
        "Teaching goal": "teaching_goal",
        "Teaching content": "teaching_content",
        "Textbooks/References": "textbooks",
        "Self-compiled Textbook/References Proportion": "self_compiled_ratio",
        "Way of Instruction": "instruction_way",
        "Grading": "grading",
        "Office Hour": "office_hour",
        "Teaching Weeks": "teaching_weeks",
        "Flexible learning week description": "flex_learning",
        "Course Domain": "course_domain",
    }

    data = {v: "" for v in mapping.values()}
    data["serial_no"] = serial_no  # 至少保底有這個

    # 只看最外層的 tr，避免吃到最後面那張核心能力的小表
    for tr in table.find_all("tr", recursive=False):
        th = tr.find("th")
        tds = tr.find_all("td", recursive=False)
        if not th or not tds:
            continue

        label = th.get_text(strip=True)
        value_td = tds[0]
        value_text = value_td.get_text("\n", strip=True)  # <br> 變換行

        if label in mapping:
            key = mapping[label]
            data[key] = value_text

    return data


def fetch_one_course(serial_no: int):
    params = {
        "serialNo": str(serial_no),
        "outline": str(serial_no),
        "semester": SEMESTER,
    }
    r = session.get(BASE_URL, params=params, timeout=10)
    r.raise_for_status()
    html = r.text

    # 有些可能沒有課，簡單判斷一下
    if "查無" in html or "無此課程" in html:
        print(f"⚠️ {serial_no} 查無課程")
        return None

    return parse_course_html(html, str(serial_no))


def main():
    results = []

    for s in range(52001, 52051):  # 52001 ~ 52050
        print(f"➡️ 抓取 {s} ...")
        try:
            data = fetch_one_course(s)
            if data:
                results.append(data)
        except Exception as e:
            print(f"❌ {s} 失敗: {e}")
        time.sleep(0.5)  # 禮貌一點，避免打太兇

    # 要輸出的欄位（順序你可以自己調整）
    fieldnames = [
        "serial_no",
        "semester",
        "department",
        "course_code",
        "name_zh",
        "name_en",
        "instructor",
        "edu_system",
        "credit",
        "teaching_goal",
        "teaching_content",
        "textbooks",
        "self_compiled_ratio",
        "instruction_way",
        "grading",
        "office_hour",
        "teaching_weeks",
        "flex_learning",
        "course_domain",
    ]

    with open("ncu_1142_52001_52050.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in results:
            writer.writerow(row)

    print("🎉 完成，輸出：ncu_1142_52001_52050.csv")


if __name__ == "__main__":
    main()
