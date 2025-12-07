import json
import re

INPUT = r"c:\Users\shihy\Downloads\curriculum_maker\NCU-Course-Finder-DataFetcher-v2-master\data\dynamic\all.json"
OUTPUT = r"c:\Users\shihy\Downloads\curriculum_maker\scheduler-app\data\clean_courses.json"

# A-Z 對應中央的節次代號（你可自行調整）
# 假設 A=10, B=11 ... Z=35（可依中央實際節次表修正）
LETTER_PERIOD_MAP = {chr(ord('A') + i): 10 + i for i in range(26)}

def parse_time(cls):
    """
    把 classTimes 例如： ["1-2","1-3","1-A"] 解析成：
    [
      {"day":1,"period":2},
      {"day":1,"period":3},
      {"day":1,"period":10}
    ]
    """
    result = []
    for t in cls:
        if "-" not in t:
            continue

        day, period = t.split("-")

        # day 部分必定是數字
        day = int(day)

        # period 可能是數字或 A~Z
        if period.isdigit():
            period = int(period)
        else:
            # A B C → 轉成數字
            period = LETTER_PERIOD_MAP.get(period, None)

        if period is not None:
            result.append({"day": day, "period": period})

    return result


def main():
    with open(INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    colleges = {c["collegeId"]: c["collegeName"] for c in data["colleges"]}
    departments = {d["departmentId"]: d["departmentName"] for d in data["departments"]}

    clean = []

    for c in data["courses"]:
        times = parse_time(c.get("classTimes", []))

        # 取第一個學院 / 系所（有些是跨院，多的話你也可以改成 list）
        college_name = colleges.get(c["collegeIds"][0], None) if c.get("collegeIds") else None
        department_name = departments.get(c["departmentIds"][0], None) if c.get("departmentIds") else None

        clean.append({
            "serialNo": c.get("serialNo"),
            "classNo": c.get("classNo"),
            "title": c.get("title"),
            "credit": c.get("credit"),
            "teachers": c.get("teachers", []),
            "times": times,
            "courseType": c.get("courseType"),  # REQUIRED / ELECTIVE
            "limitCnt": c.get("limitCnt"),
            "admitCnt": c.get("admitCnt"),
            "waitCnt": c.get("waitCnt"),
            "college": college_name,
            "department": department_name,
        })

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(clean, f, ensure_ascii=False, indent=2)

    print("✔ 清洗完成！已輸出：", OUTPUT)


if __name__ == "__main__":
    main()
