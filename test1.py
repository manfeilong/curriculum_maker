import json

# ==========================================
# 1. 資料庫建立
# ==========================================

# 必修課時間表
REQUIRED_INFO = {
    # --- 大二資工 (CE) ---
    "CE2A": [
        {"code": "CE3001-*", "name": "計算機組織", "credits": 3, "times": [{"day": 4, "sections": [2, 3, 4]}]},
        {"code": "CE2004-A", "name": "程式語言",   "credits": 3, "times": [{"day": 1, "sections": [7, 8, 9]}]},
        {"code": "CE3005-A", "name": "演算法",     "credits": 3, "times": [{"day": 3, "sections": [2, 3, 4]}]},
        {"code": "CE3002-A", "name": "作業系統",   "credits": 3, "times": [{"day": 3, "sections": [6, 7, 8]}]}
    ],
    "CE2B": [
        {"code": "CE3001-*", "name": "計算機組織", "credits": 3, "times": [{"day": 4, "sections": [2, 3, 4]}]},
        {"code": "CE2004-B", "name": "程式語言",   "credits": 3, "times": [{"day": 1, "sections": [7, 8, 9]}]},
        {"code": "CE3005-B", "name": "演算法",     "credits": 3, "times": [{"day": 2, "sections": [6, 7, 8]}]},
        {"code": "CE3002-B", "name": "作業系統",   "credits": 3, "times": [{"day": 5, "sections": [2, 3, 4]}]}
    ],
    # --- 大二電機 (EE) ---
    "EE2A": [
        {"code": "EE3009-*", "name": "信號與系統",     "credits": 3, "times": [{"day": 1, "sections": [3, 4]}, {"day": 4, "sections": [6]}]}, 
        {"code": "EE2009-A", "name": "電子學 II",      "credits": 3, "times": [{"day": 1, "sections": [5]}, {"day": 3, "sections": [5, 6]}]},
        {"code": "EE2015-A", "name": "電磁學 II",      "credits": 3, "times": [{"day": 1, "sections": [6]}, {"day": 3, "sections": [3, 4]}]},
        {"code": "EE2028-A", "name": "電子電路實驗II", "credits": 1, "times": [{"day": 1, "sections": [7, 8, 9]}]}
    ],
    "EE2B": [
        {"code": "EE3009-*", "name": "信號與系統",     "credits": 3, "times": [{"day": 1, "sections": [3, 4]}, {"day": 4, "sections": [6]}]},
        {"code": "EE2009-B", "name": "電子學 II",      "credits": 3, "times": [{"day": 1, "sections": [5]}, {"day": 3, "sections": [5, 6]}]},
        {"code": "EE2015-B", "name": "電磁學 II",      "credits": 3, "times": [{"day": 1, "sections": [6]}, {"day": 3, "sections": [3, 4]}]},
        {"code": "EE2028-B", "name": "電子電路實驗II", "credits": 1, "times": [{"day": 5, "sections": [2, 3, 4]}]}
    ],
    # --- 大三 (無必修) ---
    "CE3A": [], "CE3B": [], "EE3A": [], "EE3B": []
}

# 選修課資料 (包含 CE專業, CC核心通識, GS一般通識)
ELECTIVES_DATA = [
    # === 資工專業選修 ===
    {"code": "CE2009-*", "name": "電子電路學", "times": [{"day": 3, "sections": [5, 6, 13]}], "scores": {"difficulty": 75, "grading_leniency": 65, "homework_load": 75, "ai_related": 30, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
    {"code": "CE2036-*", "name": "資訊與社會服務Ⅱ", "times": [{"day": 2, "sections": [10, 11, 12]}], "scores": {"difficulty": 65, "grading_leniency": 80, "homework_load": 50, "ai_related": 40, "art_literature_related": 0, "economics_related": 20, "engineering_related": 50}},
    {"code": "CE3068-*", "name": "雲端服務安全", "times": [{"day": 1, "sections": [5, 6, 7]}], "scores": {"difficulty": 70, "grading_leniency": 68, "homework_load": 65, "ai_related": 60, "art_literature_related": 0, "economics_related": 10, "engineering_related": 60}},
    {"code": "CE5033-*", "name": "統計方法與資料採礦", "times": [{"day": 2, "sections": [6, 7, 8]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 80, "ai_related": 95, "art_literature_related": 0, "economics_related": 30, "engineering_related": 85}},
    {"code": "CE5065-*", "name": "使用者界面設計和評鑑", "times": [{"day": 3, "sections": [7, 8, 9]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 70, "ai_related": 60, "art_literature_related": 40, "economics_related": 10, "engineering_related": 50}},
    {"code": "CE5066-*", "name": "生物與醫學資訊之資訊探勘", "times": [{"day": 3, "sections": [2, 3, 4]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 75, "ai_related": 95, "art_literature_related": 10, "economics_related": 10, "engineering_related": 70}},
    {"code": "CE5081-*", "name": "學習、合作與創造", "times": [{"day": 2, "sections": [5, 6, 7]}], "scores": {"difficulty": 65, "grading_leniency": 80, "homework_load": 70, "ai_related": 60, "art_literature_related": 50, "economics_related": 10, "engineering_related": 50}},
    {"code": "CE5084-*", "name": "影音訊號處理實務", "times": [{"day": 4, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 75, "ai_related": 80, "art_literature_related": 40, "economics_related": 10, "engineering_related": 90}},
    {"code": "CE5087-*", "name": "科技風險管理", "times": [{"day": 2, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 80, "ai_related": 40, "art_literature_related": 10, "economics_related": 60, "engineering_related": 70}},
    {"code": "CE5088-*", "name": "深度強化學習", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 85, "ai_related": 100, "art_literature_related": 20, "economics_related": 10, "engineering_related": 90}},
    {"code": "CE6032-*", "name": "電腦視覺", "times": [{"day": 5, "sections": [2, 3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 65, "homework_load": 70, "ai_related": 95, "art_literature_related": 30, "economics_related": 10, "engineering_related": 85}},
    {"code": "CE6039-*", "name": "資料庫系統", "times": [{"day": 1, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 80, "ai_related": 70, "art_literature_related": 10, "economics_related": 20, "engineering_related": 90}},
    {"code": "CE6101-*", "name": "智慧型網路服務工程", "times": [{"day": 2, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 85, "ai_related": 95, "art_literature_related": 20, "economics_related": 15, "engineering_related": 85}},
    {"code": "CE6103-*", "name": "智慧型語言學習系統", "times": [{"day": 3, "sections": [5, 6, 7]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 80, "art_literature_related": 60, "economics_related": 20, "engineering_related": 70}},
    {"code": "CE6132-*", "name": "高等分散式計算模型", "times": [{"day": 1, "sections": [2, 3, 4]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 80, "ai_related": 60, "art_literature_related": 10, "economics_related": 15, "engineering_related": 95}},
    {"code": "CE6137-*", "name": "計算機結構", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 90, "grading_leniency": 60, "homework_load": 85, "ai_related": 75, "art_literature_related": 5, "economics_related": 10, "engineering_related": 100}},
    {"code": "CE6148-*", "name": "混合現實的原理與應用", "times": [{"day": 2, "sections": [7, 8, 9]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 80, "ai_related": 80, "art_literature_related": 50, "economics_related": 20, "engineering_related": 85}},
    {"code": "CE6167-*", "name": "隱私保護資料分析", "times": [{"day": 4, "sections": [5, 6, 7]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 75, "ai_related": 85, "art_literature_related": 10, "economics_related": 15, "engineering_related": 80}},
    {"code": "CE6168-*", "name": "資訊安全與隱私概論", "times": [{"day": 5, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 70, "art_literature_related": 10, "economics_related": 20, "engineering_related": 85}},
    {"code": "CE7030-*", "name": "無線感測網路協定", "times": [{"day": 4, "sections": [6, 7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 75, "homework_load": 80, "ai_related": 70, "art_literature_related": 10, "economics_related": 15, "engineering_related": 90}},
    {"code": "CE7066-*", "name": "社群媒體探勘", "times": [{"day": 4, "sections": [5, 6, 7]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 80, "ai_related": 85, "art_literature_related": 20, "economics_related": 30, "engineering_related": 70}},
    {"code": "CE7076-*", "name": "生成式AI與基礎模型", "times": [{"day": 3, "sections": [5, 6]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 85, "ai_related": 100, "art_literature_related": 10, "economics_related": 10, "engineering_related": 90}},
    {"code": "CE8013-*", "name": "AI與資訊安全 R&D", "times": [{"day": 3, "sections": [7, 8, 9]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 85, "ai_related": 95, "art_literature_related": 10, "economics_related": 20, "engineering_related": 85}},

    # === CC 核心通識 (依您提供的圖片新增) ===
    {"code": "CC0129-*", "name": "中國文明變遷", "times": [{"day": 1, "sections": [7, 8]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 0, "art_literature_related": 90, "economics_related": 20, "engineering_related": 0}},
    {"code": "CC0130-*", "name": "台灣文明變遷", "times": [{"day": 1, "sections": [7, 8]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 0, "art_literature_related": 90, "economics_related": 20, "engineering_related": 0}},
    {"code": "CC0136-*", "name": "台灣電影史", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 95, "economics_related": 10, "engineering_related": 0}},
    {"code": "CC0137-*", "name": "哲學概論", "times": [{"day": 2, "sections": [7, 8, 9]}], "scores": {"difficulty": 75, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "CC0204-*", "name": "認識地球", "times": [{"day": 4, "sections": [10, 11]}], "scores": {"difficulty": 60, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 0, "economics_related": 0, "engineering_related": 60}},
    {"code": "CC0212-*", "name": "神秘的宇宙", "times": [{"day": 4, "sections": [5, 6]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 0, "economics_related": 0, "engineering_related": 70}},
    {"code": "CC0215-*", "name": "文化脈絡中的數學", "times": [{"day": 2, "sections": [7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 50, "economics_related": 0, "engineering_related": 80}},
    {"code": "CC0217-*", "name": "普通心理學", "times": [{"day": 3, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 10, "art_literature_related": 30, "economics_related": 0, "engineering_related": 10}},
    {"code": "CC0219-*", "name": "探索太空", "times": [{"day": 4, "sections": [7, 8]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 0, "economics_related": 0, "engineering_related": 70}},
    {"code": "CC0301-*", "name": "工程與文明", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 40, "economics_related": 0, "engineering_related": 80}},
    {"code": "CC0310-*", "name": "光電科技與生活", "times": [{"day": 2, "sections": [7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
    {"code": "CC0314-*", "name": "生活中的物理學", "times": [{"day": 4, "sections": [7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 0, "economics_related": 0, "engineering_related": 80}},
    {"code": "CC0327-*", "name": "能源概論", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 0, "economics_related": 30, "engineering_related": 80}},
    {"code": "CC0328-*", "name": "機器學習(通識)", "times": [{"day": 4, "sections": [7, 8, 9]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 100, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
    {"code": "CC0414-*", "name": "管理學", "times": [{"day": 3, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 75, "ai_related": 0, "art_literature_related": 0, "economics_related": 90, "engineering_related": 0}},
    {"code": "CC0415-*", "name": "性別社會學", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 0, "art_literature_related": 40, "economics_related": 40, "engineering_related": 0}},
    {"code": "CC0416-*", "name": "法律的世界", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 0, "art_literature_related": 0, "economics_related": 30, "engineering_related": 0}},
    {"code": "CC0417-*", "name": "社會學的想像", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 30, "economics_related": 50, "engineering_related": 0}},
    {"code": "CC0418-*", "name": "當代政治分析", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 0, "art_literature_related": 10, "economics_related": 60, "engineering_related": 0}},
    {"code": "CC0419-*", "name": "生活經濟學", "times": [{"day": 1, "sections": [7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 0, "economics_related": 95, "engineering_related": 0}},

    # === GS 一般通識 (含最新加入) ===
    {"code": "GS2064-*", "name": "鋼琴音樂作品欣賞", "times": [{"day": 2, "sections": [7, 8]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2137-*", "name": "中國志怪敘事", "times": [{"day": 4, "sections": [5, 6]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2152-*", "name": "經典古典音樂賞析", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2153-*", "name": "西方古典音樂欣賞", "times": [{"day": 2, "sections": [9, 10]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2156-*", "name": "精神能力(SQ)", "times": [{"day": 3, "sections": [1, 2]}], "scores": {"difficulty": 75, "grading_leniency": 80, "homework_load": 65, "ai_related": 0, "art_literature_related": 85, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2240-*", "name": "藝術欣賞與展覽實務", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 75, "ai_related": 0, "art_literature_related": 95, "economics_related": 10, "engineering_related": 0}},
    {"code": "GS2247-*", "name": "世界音樂", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 95, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2456-*", "name": "體驗客家", "times": [{"day": 1, "sections": [3, 4]}], "scores": {"difficulty": 60, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 80, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS2522-*", "name": "記憶心理學", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 10, "art_literature_related": 40, "economics_related": 0, "engineering_related": 10}},
    {"code": "GS2603-*", "name": "文化創意產業與生活", "times": [{"day": 1, "sections": [3, 4]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 70, "ai_related": 0, "art_literature_related": 90, "economics_related": 40, "engineering_related": 0}},
    {"code": "GS3024-*", "name": "社會企業", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 75, "ai_related": 0, "art_literature_related": 20, "economics_related": 85, "engineering_related": 0}},
    {"code": "GS3061-*", "name": "社會參與議題工作坊3", "times": [{"day": 3, "sections": [11, 12]}], "scores": {"difficulty": 70, "grading_leniency": 85, "homework_load": 80, "ai_related": 0, "art_literature_related": 40, "economics_related": 20, "engineering_related": 0}},
    {"code": "GS3065-*", "name": "數位傳播素養", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 65, "grading_leniency": 80, "homework_load": 65, "ai_related": 20, "art_literature_related": 50, "economics_related": 10, "engineering_related": 10}},
    {"code": "GS3071-*", "name": "融媒體專題製作", "times": [{"day": 4, "sections": [2, 3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 85, "ai_related": 30, "art_literature_related": 60, "economics_related": 10, "engineering_related": 20}},
    {"code": "GS3073-A", "name": "AI人工智慧導論", "times": [{"day": 1, "sections": [6, 7, 8]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 95, "art_literature_related": 0, "economics_related": 10, "engineering_related": 90}},
    {"code": "GS3073-B", "name": "AI人工智慧導論", "times": [{"day": 2, "sections": [10, 11, 12]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 95, "art_literature_related": 0, "economics_related": 10, "engineering_related": 90}},
    {"code": "GS3074-*", "name": "國際組織", "times": [{"day": 1, "sections": [1, 2]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 0, "art_literature_related": 10, "economics_related": 50, "engineering_related": 0}},
    {"code": "GS3080-*", "name": "智慧財產權概論", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 70, "ai_related": 10, "art_literature_related": 0, "economics_related": 60, "engineering_related": 10}},
    {"code": "GS3081-*", "name": "全球化都市與社會空間", "times": [{"day": 1, "sections": [7, 8]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 65, "ai_related": 0, "art_literature_related": 30, "economics_related": 40, "engineering_related": 0}},
    {"code": "GS3084-*", "name": "智慧城市與交通", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 60, "art_literature_related": 0, "economics_related": 20, "engineering_related": 70}},
    {"code": "GS3087-*", "name": "刑法概論", "times": [{"day": 1, "sections": [7, 8]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 75, "ai_related": 0, "art_literature_related": 0, "economics_related": 10, "engineering_related": 0}},
    {"code": "GS3088-*", "name": "社會參與議題工作坊1", "times": [{"day": 4, "sections": [10, 11]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 80, "ai_related": 0, "art_literature_related": 40, "economics_related": 20, "engineering_related": 0}},
    {"code": "GS3090-*", "name": "社會參與實作", "times": [{"day": 5, "sections": [10, 11]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 85, "ai_related": 0, "art_literature_related": 40, "economics_related": 20, "engineering_related": 0}},
    {"code": "GS3095-*", "name": "資訊社會與法律", "times": [{"day": 4, "sections": [10, 11]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 30, "art_literature_related": 0, "economics_related": 10, "engineering_related": 10}},
    {"code": "GS3096-*", "name": "人工智慧與公共治理", "times": [{"day": 1, "sections": [10, 11]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 70, "art_literature_related": 0, "economics_related": 30, "engineering_related": 40}},
    {"code": "GS3097-*", "name": "消費社會學", "times": [{"day": 1, "sections": [3, 4]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 65, "ai_related": 0, "art_literature_related": 20, "economics_related": 60, "engineering_related": 0}},
    {"code": "GS3098-*", "name": "國際科技政治", "times": [{"day": 3, "sections": [5, 6]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 10, "art_literature_related": 0, "economics_related": 50, "engineering_related": 30}},
    {"code": "GS3099-*", "name": "科技政策理論與實踐", "times": [{"day": 3, "sections": [7, 8]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 75, "ai_related": 10, "art_literature_related": 0, "economics_related": 40, "engineering_related": 30}},
    {"code": "GS3101-*", "name": "地緣政治", "times": [{"day": 2, "sections": [7, 8]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 0, "art_literature_related": 10, "economics_related": 50, "engineering_related": 0}},
    {"code": "GS3102-*", "name": "國際政治經濟學", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 80, "ai_related": 0, "art_literature_related": 0, "economics_related": 90, "engineering_related": 0}},
    {"code": "GS3103-*", "name": "國際太空政治", "times": [{"day": 1, "sections": [3, 4]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 65, "ai_related": 10, "art_literature_related": 0, "economics_related": 30, "engineering_related": 30}},
    {"code": "GS3104-*", "name": "東北亞地緣政治", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 0, "art_literature_related": 10, "economics_related": 50, "engineering_related": 0}},
    {"code": "GS3150-*", "name": "生命教育", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 80, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS3225-*", "name": "戰爭與和平", "times": [{"day": 1, "sections": [3, 4]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 60, "economics_related": 20, "engineering_related": 0}},
    {"code": "GS3509-*", "name": "媒體素養", "times": [{"day": 4, "sections": [3, 4]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 60, "economics_related": 10, "engineering_related": 0}},
    {"code": "GS3510-*", "name": "大眾傳播與生活", "times": [{"day": 4, "sections": [7, 8]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 60, "economics_related": 10, "engineering_related": 0}},
    {"code": "GS3552-*", "name": "資料蒐集與報告寫作", "times": [{"day": 4, "sections": [9, 10]}], "scores": {"difficulty": 60, "grading_leniency": 85, "homework_load": 75, "ai_related": 10, "art_literature_related": 20, "economics_related": 0, "engineering_related": 10}},
    {"code": "GS3639-*", "name": "移民與社會", "times": [{"day": 2, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 70, "ai_related": 0, "art_literature_related": 60, "economics_related": 10, "engineering_related": 0}},
    {"code": "GS3901-*", "name": "創造力之理論與技巧", "times": [{"day": 4, "sections": [9, 10]}], "scores": {"difficulty": 60, "grading_leniency": 90, "homework_load": 60, "ai_related": 0, "art_literature_related": 80, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS3902-*", "name": "創造力與多元智慧", "times": [{"day": 4, "sections": [11, 12]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 0, "art_literature_related": 70, "economics_related": 0, "engineering_related": 0}},
    {"code": "GS3905-*", "name": "影像紀錄製作基礎", "times": [{"day": 5, "sections": [1, 2]}], "scores": {"difficulty": 75, "grading_leniency": 80, "homework_load": 85, "ai_related": 0, "art_literature_related": 90, "economics_related": 0, "engineering_related": 10}},
    {"code": "GS4110-*", "name": "通識地球物理", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 70, "ai_related": 10, "art_literature_related": 0, "economics_related": 0, "engineering_related": 60}},
    {"code": "GS4413-*", "name": "全球氣候變遷", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 70, "grading_leniency": 80, "homework_load": 65, "ai_related": 0, "art_literature_related": 0, "economics_related": 20, "engineering_related": 50}},
    {"code": "GS4452-*", "name": "精準醫療與智慧醫療", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 75, "ai_related": 60, "art_literature_related": 0, "economics_related": 10, "engineering_related": 80}},
    {"code": "GS4457-*", "name": "半導體入門", "times": [{"day": 3, "sections": [7, 8]}], "scores": {"difficulty": 80, "grading_leniency": 70, "homework_load": 80, "ai_related": 20, "art_literature_related": 0, "economics_related": 0, "engineering_related": 95}},
    {"code": "GS4458-*", "name": "生成式AI導論", "times": [{"day": 3, "sections": [8, 9, 10]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 100, "art_literature_related": 10, "economics_related": 10, "engineering_related": 90}},
    {"code": "GS4502-A", "name": "運算思維(文客)", "times": [{"day": 5, "sections": [1, 2]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 80, "ai_related": 40, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
    {"code": "GS4502-B", "name": "運算思維(文客)", "times": [{"day": 5, "sections": [3, 4]}], "scores": {"difficulty": 75, "grading_leniency": 75, "homework_load": 80, "ai_related": 40, "art_literature_related": 0, "economics_related": 0, "engineering_related": 90}},
    {"code": "GS4513-*", "name": "定量思考", "times": [{"day": 2, "sections": [10, 11]}], "scores": {"difficulty": 75, "grading_leniency": 70, "homework_load": 75, "ai_related": 20, "art_literature_related": 0, "economics_related": 30, "engineering_related": 60}},
    {"code": "GS4518-*", "name": "自然語言處理", "times": [{"day": 1, "sections": [2, 3, 4]}], "scores": {"difficulty": 90, "grading_leniency": 70, "homework_load": 85, "ai_related": 100, "art_literature_related": 0, "economics_related": 0, "engineering_related": 95}},
    {"code": "GS4519-A", "name": "機器學習概論", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 85, "grading_leniency": 75, "homework_load": 80, "ai_related": 100, "art_literature_related": 0, "economics_related": 0, "engineering_related": 95}},
    {"code": "GS4519-B", "name": "機器學習概論", "times": [{"day": 3, "sections": [3, 4]}], "scores": {"difficulty": 85, "grading_leniency": 75, "homework_load": 80, "ai_related": 100, "art_literature_related": 0, "economics_related": 0, "engineering_related": 95}},
    {"code": "GS4519-C", "name": "機器學習概論", "times": [{"day": 4, "sections": [7, 8]}], "scores": {"difficulty": 85, "grading_leniency": 75, "homework_load": 80, "ai_related": 100, "art_literature_related": 0, "economics_related": 0, "engineering_related": 95}},
    {"code": "GS4521-*", "name": "AI與商業運用", "times": [{"day": 1, "sections": [8, 9]}], "scores": {"difficulty": 75, "grading_leniency": 80, "homework_load": 75, "ai_related": 90, "art_literature_related": 0, "economics_related": 80, "engineering_related": 70}},
    {"code": "GS4524-*", "name": "AI跨領域專題", "times": [{"day": 2, "sections": [10, 11, 12]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 85, "ai_related": 95, "art_literature_related": 0, "economics_related": 20, "engineering_related": 90}},
    {"code": "GS4525-*", "name": "AI社會影響力評估", "times": [{"day": 1, "sections": [5, 6]}], "scores": {"difficulty": 70, "grading_leniency": 85, "homework_load": 70, "ai_related": 80, "art_literature_related": 20, "economics_related": 60, "engineering_related": 40}},
    {"code": "GS4538-*", "name": "Linux與邊緣運算", "times": [{"day": 3, "sections": [5, 6, 7]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 85, "ai_related": 50, "art_literature_related": 0, "economics_related": 0, "engineering_related": 100}},
    {"code": "GS4539-*", "name": "資料庫管理與程式", "times": [{"day": 2, "sections": [7, 8, 9]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 50, "art_literature_related": 0, "economics_related": 10, "engineering_related": 95}},
    {"code": "GS4541-*", "name": "數據分析智慧", "times": [{"day": 1, "sections": [5, 6, 7]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 90, "art_literature_related": 0, "economics_related": 10, "engineering_related": 90}},
    {"code": "GS4715-*", "name": "創意與創業", "times": [{"day": 3, "sections": [7, 8]}], "scores": {"difficulty": 65, "grading_leniency": 85, "homework_load": 65, "ai_related": 10, "art_literature_related": 30, "economics_related": 90, "engineering_related": 10}},
    {"code": "GS4719-A", "name": "程式設計-Python", "times": [{"day": 1, "sections": [2, 3, 4]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 80, "art_literature_related": 0, "economics_related": 0, "engineering_related": 100}},
    {"code": "GS4719-B", "name": "程式設計-Python", "times": [{"day": 2, "sections": [5, 6, 7]}], "scores": {"difficulty": 80, "grading_leniency": 75, "homework_load": 80, "ai_related": 80, "art_literature_related": 0, "economics_related": 0, "engineering_related": 100}},
    {"code": "GS3077-*", "name": "行政法", "times": [{"day": 4, "sections": [6, 7, 8]}], "scores": {"difficulty": 85, "grading_leniency": 70, "homework_load": 80, "ai_related": 0, "art_literature_related": 0, "economics_related": 20, "engineering_related": 0}}
]

# ==========================================
# 2. 核心功能
# ==========================================

def get_credits(course):
    """取得學分: 若資料無設定，預設為節數"""
    if "credits" in course:
        return course["credits"]
    total_sections = 0
    for t in course["times"]:
        total_sections += len(t["sections"])
    return total_sections

def format_time_str(time_list):
    """時間格式化"""
    days_map = ["", "一", "二", "三", "四", "五", "六", "日"]
    result = []
    for t in time_list:
        day_str = days_map[t['day']]
        sections_str = ",".join(map(str, t['sections']))
        result.append(f"({day_str}){sections_str}")
    return " ".join(result)

def check_conflict(course_times, occupied_slots):
    """檢查衝堂"""
    for t in course_times:
        day = t["day"]
        for sec in t["sections"]:
            if (day, sec) in occupied_slots:
                return True
    return False

def check_conflict_and_occupy(schedule_matrix, course, occupied_slots):
    """排課專用：檢查衝堂並更新狀態"""
    if check_conflict(course["times"], occupied_slots):
        return False
    
    # 無衝突，更新佔用
    for t in course["times"]:
        day = t["day"]
        for sec in t["sections"]:
            occupied_slots.add((day, sec))
            if 1 <= sec <= 13 and 1 <= day <= 5:
                schedule_matrix[sec-1][day-1] = course["name"][:7] # 簡稱
    return True

def calculate_score(course, prefs):
    """計算課程推薦分數"""
    raw = course["scores"]
    score = 0
    score += raw.get("grading_leniency", 0) * prefs["sweet"]
    score += raw.get("ai_related", 0)       * prefs["ai"]
    score += raw.get("engineering_related", 0) * prefs["tech"]
    score += raw.get("art_literature_related", 0) * prefs["art"]
    score += raw.get("economics_related", 0) * prefs["money"]
    score += raw.get("difficulty", 0) * prefs["diff"] 
    score += raw.get("homework_load", 0) * -0.3 # 固定扣分項
    return score

def get_occupied_slots_and_courses(class_type):
    """取得必修資訊"""
    occupied = set()
    required_courses = REQUIRED_INFO.get(class_type, [])
    for course in required_courses:
        for t in course["times"]:
            for section in t["sections"]:
                occupied.add((t["day"], section))
    return occupied, required_courses

def print_matrix(matrix):
    """輸出矩陣課表"""
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    print("\n" + "="*70)
    print(f"{'節次':<4} | {'週一':<10} | {'週二':<10} | {'週三':<10} | {'週四':<10} | {'週五':<10}|")
    print("-" * 70)
    for i, row in enumerate(matrix, 1):
        row_str = " | ".join([f"{cell:<10}" if cell else " "*10 for cell in row])
        print(f"{i:<4} | {row_str}|")
    print("="*70 + "\n")

# ==========================================
# 3. 主程式
# ==========================================

if __name__ == "__main__":
    print("=== 資工/電機系 智慧選課系統 (支援大二/大三) ===")
    
    # 1. 輸入班級
    while True:
        print("請輸入班級代號 (ex: CE2A, CE3B, EE2A, EE3B):")
        user_class = input("輸入: ").upper()
        if user_class in REQUIRED_INFO: break
        print("輸入錯誤，請重試。")
    
    # 2. 輸入學分 (防呆: 必須 > 15)
    while True:
        try:
            target_credits = int(input("請輸入本學期目標學分 : "))
            if target_credits > 15:
                break
            print("學分過低！請輸入大於 15 的學分。")
        except:
            print("請輸入有效的數字。")

    print("\n請輸入權重 (0-10):")
    try:
        w_sweet = float(input("   甜度 (Sweetness): "))
        w_ai    = float(input("   AI 人工智慧: "))
        w_tech  = float(input("   工程/硬體: "))
        w_art   = float(input("   文藝/人文: "))
        w_money = float(input("   商業/經濟: "))
        w_diff  = float(input("   硬課偏好 (想學硬的填高分): "))
    except:
        w_sweet, w_ai, w_tech, w_art, w_money, w_diff = 0,0,0,0,0,0

    prefs = {"sweet": w_sweet, "ai": w_ai, "tech": w_tech, "art": w_art, "money": w_money, "diff": w_diff}

    # 取得必修與初始佔用
    mandatory_slots, mandatory_courses = get_occupied_slots_and_courses(user_class)

    # ----------------------------------------------------
    # 功能 A: 推薦選修課程 TOP 10 (保留輸出)
    # ----------------------------------------------------
    print(f"\n【推薦選修課程 TOP 10】 (依您的權重排序，排除必修衝堂)")
    print("-" * 80)
    print(f"{'排名':<4} {'課號':<10} {'課程名稱':<20} {'時間':<12} {'分數':<6}")
    print("-" * 80)
    
    # 計算所有選修課分數
    all_scored_electives = []
    for course in ELECTIVES_DATA:
        # 排除與必修衝堂的
        if not check_conflict(course["times"], mandatory_slots):
            s = calculate_score(course, prefs)
            all_scored_electives.append((s, course))
            
    # 排序
    all_scored_electives.sort(key=lambda x: x[0], reverse=True)
    
    # 輸出前10名
    for i, (score, course) in enumerate(all_scored_electives[:10], 1):
        t_str = format_time_str(course["times"])
        print(f"{i:<4} {course['code']:<10} {course['name']:<20} {t_str:<12} {score:.1f}")
    
    # ----------------------------------------------------
    # 功能 B: 自動排課 (Scheduler)
    # ----------------------------------------------------
    print(f"\n\n[系統] 正在規劃最佳課表 (目標: {target_credits} 學分)...")
    
    # 初始化
    schedule_matrix = [["" for _ in range(5)] for _ in range(13)]
    occupied_slots = set() # 重新記錄排課用的佔用
    final_selected = []
    current_credits = 0
    
    # 1. 先排入必修
    for course in mandatory_courses:
        check_conflict_and_occupy(schedule_matrix, course, occupied_slots)
        final_selected.append(course)
        current_credits += get_credits(course)
        
    # 2. 貪婪排入選修 (使用剛剛算好分數並排序的清單)
    for score, course in all_scored_electives:
        if current_credits >= target_credits:
            break
        
        # 檢查是否與「已選選修」衝堂 (必修已在 occupied_slots 中)
        if check_conflict_and_occupy(schedule_matrix, course, occupied_slots):
            final_selected.append(course)
            current_credits += get_credits(course)

    # 3. 輸出矩陣與結果
    print_matrix(schedule_matrix)
    
    print(f"【最終定案課表】 總學分: {current_credits} / {target_credits}")
    print("-" * 65)
    print(f"{'類型':<6} {'課號':<10} {'課程名稱':<20} {'學分':<5} {'時間'}")
    print("-" * 65)
    
    # 分類顯示
    # 必修
    if not mandatory_courses:
        print(f"{'必修':<6} (無必修課程)")
    for c in mandatory_courses:
        t_str = format_time_str(c["times"])
        print(f"{'必修':<6} {c['code']:<10} {c['name']:<20} {get_credits(c):<5} {t_str}")
    
    # 選修 (從 final_selected 中過濾出不在 mandatory_courses 的)
    mandatory_codes = [c['code'] for c in mandatory_courses]
    for c in final_selected:
        if c['code'] not in mandatory_codes:
            t_str = format_time_str(c["times"])
            print(f"{'選修':<6} {c['code']:<10} {c['name']:<20} {get_credits(c):<5} {t_str}")