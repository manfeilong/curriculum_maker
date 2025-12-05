import json

# ==========================================
# 1. 資料庫建立 (必修課表 & 選修課資料)
# ==========================================

# 必修課時間表
REQUIRED_INFO = {
    "common": [
        {"code": "CE3001-*", "name": "計算機組織", "times": [{"day": 4, "sections": [2, 3, 4]}]}
    ],
    "2A": [
        {"code": "CE2004-A", "name": "程式語言", "times": [{"day": 1, "sections": [7, 8, 9]}]},
        {"code": "CE3005-A", "name": "演算法",   "times": [{"day": 3, "sections": [2, 3, 4]}]},
        {"code": "CE3002-A", "name": "作業系統", "times": [{"day": 3, "sections": [6, 7, 8]}]}
    ],
    "2B": [
        {"code": "CE2004-B", "name": "程式語言", "times": [{"day": 1, "sections": [7, 8, 9]}]},
        {"code": "CE3005-B", "name": "演算法",   "times": [{"day": 2, "sections": [6, 7, 8]}]},
        {"code": "CE3002-B", "name": "作業系統", "times": [{"day": 5, "sections": [2, 3, 4]}]}
    ]
}

# 選修課資料
ELECTIVES_DATA = [
  {"course_id": "52009", "code": "CE2009-*", "name": "電子電路學", "times": [{"day": 3, "sections": [5, 6, 13]}], "scores": {"difficulty": 75, "grading_leniency": 65, "homework_load": 75, "ai_related": 30, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
  {"course_id": "52012", "code": "CE2036-*", "name": "資訊與社會服務Ⅱ", "times": [{"day": 2, "sections": [10, 11, 12]}], "scores": {"difficulty": 65, "grading_leniency": 80, "homework_load": 50, "ai_related": 40, "art_literature_related": 0, "economics_related": 20, "engineering_related": 50}},
  {"course_id": "52019", "code": "CE3068-*", "name": "雲端服務安全", "times": [{"day": 1, "sections": [5, 6, 7]}], "scores": {"difficulty": 70, "grading_leniency": 68, "homework_load": 65, "ai_related": 60, "art_literature_related": 0, "economics_related": 10, "engineering_related": 60}},
  {"course_id": "52027", "code": "CE5033-*", "name": "統計方法與資料採礦", "times": [{"day": 2, "sections": [6, 7, 8]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 80, "ai_related": 95, "art_literature_related": 0, "economics_related": 30, "engineering_related": 85}},
  {"course_id": "52029", "code": "CE5065-*", "name": "使用者界面設計和評鑑", "times": [{"day": 3, "sections": [7, 8, 9]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 70, "ai_related": 60, "art_literature_related": 40, "economics_related": 10, "engineering_related": 50}},
  {"course_id": "52030", "code": "CE5066-*", "name": "生物與醫學資訊之資訊探勘", "times": [{"day": 3, "sections": [2, 3, 4]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 75, "ai_related": 95, "art_literature_related": 10, "economics_related": 10, "engineering_related": 70}},
  {"course_id": "52031", "code": "CE5081-*", "name": "學習、合作與創造", "times": [{"day": 2, "sections": [5, 6, 7]}], "scores": {"difficulty": 65, "grading_leniency": 80, "homework_load": 70, "ai_related": 60, "art_literature_related": 50, "economics_related": 10, "engineering_related": 50}},
  {"course_id": "52032", "code": "CE5084-*", "name": "影音訊號處理實務", "times": [{"day": 4, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 75, "ai_related": 80, "art_literature_related": 40, "economics_related": 10, "engineering_related": 90}},
  {"course_id": "52033", "code": "CE5087-*", "name": "科技風險管理", "times": [{"day": 2, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 80, "ai_related": 40, "art_literature_related": 10, "economics_related": 60, "engineering_related": 70}},
  {"course_id": "52034", "code": "CE5088-*", "name": "深度強化學習", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 85, "ai_related": 100, "art_literature_related": 20, "economics_related": 10, "engineering_related": 90}},
  {"course_id": "52038", "code": "CE6032-*", "name": "電腦視覺", "times": [{"day": 5, "sections": [2, 3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 65, "homework_load": 70, "ai_related": 95, "art_literature_related": 30, "economics_related": 10, "engineering_related": 85}},
  {"course_id": "52039", "code": "CE6039-*", "name": "資料庫系統", "times": [{"day": 1, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 80, "ai_related": 70, "art_literature_related": 10, "economics_related": 20, "engineering_related": 90}},
  {"course_id": "52040", "code": "CE6101-*", "name": "智慧型網路服務工程", "times": [{"day": 2, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 85, "ai_related": 95, "art_literature_related": 20, "economics_related": 15, "engineering_related": 85}},
  {"course_id": "52041", "code": "CE6103-*", "name": "智慧型語言學習系統", "times": [{"day": 3, "sections": [5, 6, 7]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 80, "art_literature_related": 60, "economics_related": 20, "engineering_related": 70}},
  {"course_id": "52042", "code": "CE6132-*", "name": "高等分散式計算模型", "times": [{"day": 1, "sections": [2, 3, 4]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 80, "ai_related": 60, "art_literature_related": 10, "economics_related": 15, "engineering_related": 95}},
  {"course_id": "52043", "code": "CE6137-*", "name": "計算機結構", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 90, "grading_leniency": 60, "homework_load": 85, "ai_related": 75, "art_literature_related": 5, "economics_related": 10, "engineering_related": 100}},
  {"course_id": "52045", "code": "CE6148-*", "name": "混合現實的原理與應用", "times": [{"day": 2, "sections": [7, 8, 9]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 80, "ai_related": 80, "art_literature_related": 50, "economics_related": 20, "engineering_related": 85}},
  {"course_id": "52048", "code": "CE6167-*", "name": "隱私保護資料分析", "times": [{"day": 4, "sections": [5, 6, 7]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 75, "ai_related": 85, "art_literature_related": 10, "economics_related": 15, "engineering_related": 80}},
  {"course_id": "52049", "code": "CE6168-*", "name": "資訊安全與隱私概論", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 70, "art_literature_related": 10, "economics_related": 20, "engineering_related": 85}},
  {"course_id": "52050", "code": "CE7030-*", "name": "無線感測網路協定與應用", "times": [{"day": 4, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 80, "ai_related": 70, "art_literature_related": 10, "economics_related": 15, "engineering_related": 90}},
  {"course_id": "52051", "code": "CE7066-*", "name": "社群媒體探勘", "times": [{"day": 4, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 80, "ai_related": 85, "art_literature_related": 20, "economics_related": 30, "engineering_related": 70}},
  {"course_id": "52056", "code": "CE7076-*", "name": "生成式人工智慧與基礎模型", "times": [{"day": 3, "sections": [5, 6]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 85, "ai_related": 100, "art_literature_related": 10, "economics_related": 10, "engineering_related": 90}},
  {"course_id": "52057", "code": "CE8013-*", "name": "AI與資訊安全 R&D", "times": [{"day": 3, "sections": [7, 8, 9]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 85, "ai_related": 95, "art_literature_related": 10, "economics_related": 20, "engineering_related": 85}}
]

# ==========================================
# 2. 核心工具函數
# ==========================================

def format_time_str(time_list):
    """將時間轉為易讀格式, ex: (三)5-7"""
    days_map = ["", "一", "二", "三", "四", "五", "六", "日"]
    result = []
    for t in time_list:
        day_str = days_map[t['day']]
        sections_str = ",".join(map(str, t['sections']))
        result.append(f"({day_str}){sections_str}")
    return " ".join(result)

def get_occupied_slots_and_courses(class_type):
    """取得該班級必修課資訊與佔用時段"""
    occupied = set()
    required_courses = []

    # 共同必修
    for course in REQUIRED_INFO["common"]:
        required_courses.append(course)
        for time_block in course["times"]:
            for section in time_block["sections"]:
                occupied.add((time_block["day"], section))
    
    # 分班必修
    if class_type in REQUIRED_INFO:
        for course in REQUIRED_INFO[class_type]:
            required_courses.append(course)
            for time_block in course["times"]:
                for section in time_block["sections"]:
                    occupied.add((time_block["day"], section))
                    
    return occupied, required_courses

def check_conflict(course_times, occupied_slots):
    """檢查衝堂"""
    for time_block in course_times:
        day = time_block["day"]
        for section in time_block["sections"]:
            if (day, section) in occupied_slots:
                return True
    return False

def calculate_recommendations(occupied_slots, preferences):
    """計算推薦分數"""
    results = []
    # 這裡的 FACTOR_DIFFICULTY 已經移除，改由 preferences["diff"] 控制
    FACTOR_HOMEWORK = -0.3 # 唯一的固定負面因子 (作業量)

    for course in ELECTIVES_DATA:
        if check_conflict(course["times"], occupied_slots):
            continue
        
        raw = course["scores"]
        score = 0
        
        # 1. 六大指標加權
        score += raw.get("grading_leniency", 0) * preferences["sweet"]
        score += raw.get("ai_related", 0)       * preferences["ai"]
        score += raw.get("engineering_related", 0) * preferences["tech"]
        score += raw.get("art_literature_related", 0) * preferences["art"]
        score += raw.get("economics_related", 0) * preferences["money"]
        score += raw.get("difficulty", 0) * preferences["diff"] # 新增: 難易度偏好
        
        # 2. 扣分項
        score += raw.get("homework_load", 0) * FACTOR_HOMEWORK

        results.append({
            "code": course["code"],
            "name": course["name"],
            "time_str": format_time_str(course["times"]),
            "score": score,
            "details": raw
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:10]

# ==========================================
# 3. 使用者介面
# ==========================================

def main():
    print("=== 資工系大二下 選修課推薦系統 ===")
    
    # 1. 輸入班級
    while True:
        user_class = input("請輸入班級 (2A 或 2B): ").upper()
        if user_class in ["2A", "2B"]:
            break
        print("輸入錯誤，請輸入 2A 或 2B")

    # 顯示必修
    occupied_slots, required_courses = get_occupied_slots_and_courses(user_class)
    print(f"\n[{user_class} 班 必修課程表]")
    print("-" * 50)
    print(f"{'課號':<12} {'課程名稱':<15} {'上課時間'}")
    print("-" * 50)
    for rc in required_courses:
        time_str = format_time_str(rc["times"])
        print(f"{rc['code']:<12} {rc['name']:<15} {time_str}")
    print("-" * 50)
    print("系統已自動排除與上述時間衝突的選修課。\n")

    # 2. 輸入權重 (新增第 6 項)
    print("請輸入推薦指標權重 (0~10):")
    try:
        w_sweet = float(input("1. 甜度 (給分大方): "))
        w_ai    = float(input("2. AI 人工智慧: "))
        w_tech  = float(input("3. 硬體/工程實務: "))
        w_art   = float(input("4. 藝術/人文: "))
        w_money = float(input("5. 經濟/商業: "))
        w_diff  = float(input("6. 學習難易程度 (分數越高代表您越偏好*挑戰/硬課*，想輕鬆請填 0): "))
    except ValueError:
        print("輸入錯誤，使用預設值 0")
        w_sweet, w_ai, w_tech, w_art, w_money, w_diff = 0, 0, 0, 0, 0, 0

    prefs = {
        "sweet": w_sweet, 
        "ai": w_ai, 
        "tech": w_tech, 
        "art": w_art, 
        "money": w_money,
        "diff": w_diff
    }

    # 3. 計算並顯示
    recommendations = calculate_recommendations(occupied_slots, prefs)

    print(f"\n=== 推薦選修課程 TOP 10 ===")
    print(f"權重: 甜度={w_sweet}, AI={w_ai}, 工程={w_tech}, 文藝={w_art}, 經濟={w_money}, 難度偏好={w_diff}")
    print("-" * 85)
    print(f"{'排名':<4} {'課號':<10} {'課程名稱':<20} {'時間':<12} {'推薦分':<8} {'亮點'}")
    print("-" * 85)

    if not recommendations:
        print("無符合課程。")

    for i, item in enumerate(recommendations, 1):
        d = item['details']
        tags = []
        if d['grading_leniency'] >= 80: tags.append("很甜")
        if d['ai_related'] >= 90: tags.append("AI強")
        if d['engineering_related'] >= 90: tags.append("工程強")
        if d['difficulty'] >= 80: tags.append("硬課")     # 標示硬課
        elif d['difficulty'] <= 70: tags.append("負擔輕") # 標示涼課
        if d['art_literature_related'] >= 50: tags.append("文藝")
        if d['economics_related'] >= 40: tags.append("商管")
        
        tag_str = ",".join(tags)
        print(f"{i:<4} {item['code']:<10} {item['name']:<20} {item['time_str']:<12} {item['score']:<8.1f} {tag_str}")

if __name__ == "__main__":
    main()