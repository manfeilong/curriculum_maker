
export interface CourseScore {
    difficulty: number;
    grading_leniency: number;
    homework_load: number;
    ai_related: number;
    art_literature_related: number;
    economics_related: number;
    engineering_related: number;
}

export interface RecommendationInfo {
    code: string;
    name: string;
    times: { day: number; sections: number[] }[];
    scores: CourseScore;
}

export const ELECTIVES_DATA: RecommendationInfo[] = [
    // === 資工專業選修 ===
    { code: "CE2009-*", name: "電子電路學", times: [{ day: 3, sections: [5, 6, 13] }], scores: { difficulty: 75, grading_leniency: 65, homework_load: 75, ai_related: 30, art_literature_related: 0, economics_related: 0, engineering_related: 90 } },
    { code: "CE2036-*", name: "資訊與社會服務Ⅱ", times: [{ day: 2, sections: [10, 11, 12] }], scores: { difficulty: 65, grading_leniency: 80, homework_load: 50, ai_related: 40, art_literature_related: 0, economics_related: 20, engineering_related: 50 } },
    { code: "CE3068-*", name: "雲端服務安全", times: [{ day: 1, sections: [5, 6, 7] }], scores: { difficulty: 70, grading_leniency: 68, homework_load: 65, ai_related: 60, art_literature_related: 0, economics_related: 10, engineering_related: 60 } },
    { code: "CE5033-*", name: "統計方法與資料採礦", times: [{ day: 2, sections: [6, 7, 8] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 80, ai_related: 95, art_literature_related: 0, economics_related: 30, engineering_related: 85 } },
    { code: "CE5065-*", name: "使用者界面設計和評鑑", times: [{ day: 3, sections: [7, 8, 9] }], scores: { difficulty: 70, grading_leniency: 75, homework_load: 70, ai_related: 60, art_literature_related: 40, economics_related: 10, engineering_related: 50 } },
    { code: "CE5066-*", name: "生物與醫學資訊之資訊探勘", times: [{ day: 3, sections: [2, 3, 4] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 75, ai_related: 95, art_literature_related: 10, economics_related: 10, engineering_related: 70 } },
    { code: "CE5081-*", name: "學習、合作與創造", times: [{ day: 2, sections: [5, 6, 7] }], scores: { difficulty: 65, grading_leniency: 80, homework_load: 70, ai_related: 60, art_literature_related: 50, economics_related: 10, engineering_related: 50 } },
    { code: "CE5084-*", name: "影音訊號處理實務", times: [{ day: 4, sections: [6, 7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 75, ai_related: 80, art_literature_related: 40, economics_related: 10, engineering_related: 90 } },
    { code: "CE5087-*", name: "科技風險管理", times: [{ day: 2, sections: [5, 6, 7] }], scores: { difficulty: 75, grading_leniency: 70, homework_load: 80, ai_related: 40, art_literature_related: 10, economics_related: 60, engineering_related: 70 } },
    { code: "CE5088-*", name: "深度強化學習", times: [{ day: 5, sections: [5, 6, 7] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 85, ai_related: 100, art_literature_related: 20, economics_related: 10, engineering_related: 90 } },
    { code: "CE6032-*", name: "電腦視覺", times: [{ day: 5, sections: [2, 3, 4] }], scores: { difficulty: 75, grading_leniency: 65, homework_load: 70, ai_related: 95, art_literature_related: 30, economics_related: 10, engineering_related: 85 } },
    { code: "CE6039-*", name: "資料庫系統", times: [{ day: 1, sections: [5, 6, 7] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 80, ai_related: 70, art_literature_related: 10, economics_related: 20, engineering_related: 90 } },
    { code: "CE6101-*", name: "智慧型網路服務工程", times: [{ day: 2, sections: [6, 7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 85, ai_related: 95, art_literature_related: 20, economics_related: 15, engineering_related: 85 } },
    { code: "CE6103-*", name: "智慧型語言學習系統", times: [{ day: 3, sections: [5, 6, 7] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 80, art_literature_related: 60, economics_related: 20, engineering_related: 70 } },
    { code: "CE6132-*", name: "高等分散式計算模型", times: [{ day: 1, sections: [2, 3, 4] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 80, ai_related: 60, art_literature_related: 10, economics_related: 15, engineering_related: 95 } },
    { code: "CE6137-*", name: "計算機結構", times: [{ day: 5, sections: [5, 6, 7] }], scores: { difficulty: 90, grading_leniency: 60, homework_load: 85, ai_related: 75, art_literature_related: 5, economics_related: 10, engineering_related: 100 } },
    { code: "CE6148-*", name: "混合現實的原理與應用", times: [{ day: 2, sections: [7, 8, 9] }], scores: { difficulty: 70, grading_leniency: 75, homework_load: 80, ai_related: 80, art_literature_related: 50, economics_related: 20, engineering_related: 85 } },
    { code: "CE6167-*", name: "隱私保護資料分析", times: [{ day: 4, sections: [5, 6, 7] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 75, ai_related: 85, art_literature_related: 10, economics_related: 15, engineering_related: 80 } },
    { code: "CE6168-*", name: "資訊安全與隱私概論", times: [{ day: 5, sections: [5, 6, 7] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 70, art_literature_related: 10, economics_related: 20, engineering_related: 85 } },
    { code: "CE7030-*", name: "無線感測網路協定", times: [{ day: 4, sections: [6, 7, 8] }], scores: { difficulty: 70, grading_leniency: 75, homework_load: 80, ai_related: 70, art_literature_related: 10, economics_related: 15, engineering_related: 90 } },
    { code: "CE7066-*", name: "社群媒體探勘", times: [{ day: 4, sections: [5, 6, 7] }], scores: { difficulty: 75, grading_leniency: 70, homework_load: 80, ai_related: 85, art_literature_related: 20, economics_related: 30, engineering_related: 70 } },
    { code: "CE7076-*", name: "生成式AI與基礎模型", times: [{ day: 3, sections: [5, 6] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 85, ai_related: 100, art_literature_related: 10, economics_related: 10, engineering_related: 90 } },
    { code: "CE8013-*", name: "AI與資訊安全 R&D", times: [{ day: 3, sections: [7, 8, 9] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 85, ai_related: 95, art_literature_related: 10, economics_related: 20, engineering_related: 85 } },

    // === CC 核心通識 ===
    { code: "CC0129-*", name: "中國文明變遷", times: [{ day: 1, sections: [7, 8] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 0, art_literature_related: 90, economics_related: 20, engineering_related: 0 } },
    { code: "CC0130-*", name: "台灣文明變遷", times: [{ day: 1, sections: [7, 8] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 0, art_literature_related: 90, economics_related: 20, engineering_related: 0 } },
    { code: "CC0136-*", name: "台灣電影史", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 95, economics_related: 10, engineering_related: 0 } },
    { code: "CC0137-*", name: "哲學概論", times: [{ day: 2, sections: [7, 8, 9] }], scores: { difficulty: 75, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "CC0204-*", name: "認識地球", times: [{ day: 4, sections: [10, 11] }], scores: { difficulty: 60, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 0, economics_related: 0, engineering_related: 60 } },
    { code: "CC0212-*", name: "神秘的宇宙", times: [{ day: 4, sections: [5, 6] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 0, economics_related: 0, engineering_related: 70 } },
    { code: "CC0215-*", name: "文化脈絡中的數學", times: [{ day: 2, sections: [7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 50, economics_related: 0, engineering_related: 80 } },
    { code: "CC0217-*", name: "普通心理學", times: [{ day: 3, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 10, art_literature_related: 30, economics_related: 0, engineering_related: 10 } },
    { code: "CC0219-*", name: "探索太空", times: [{ day: 4, sections: [7, 8] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 0, economics_related: 0, engineering_related: 70 } },
    { code: "CC0301-*", name: "工程與文明", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 40, economics_related: 0, engineering_related: 80 } },
    { code: "CC0310-*", name: "光電科技與生活", times: [{ day: 2, sections: [7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 0, economics_related: 0, engineering_related: 90 } },
    { code: "CC0314-*", name: "生活中的物理學", times: [{ day: 4, sections: [7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 0, economics_related: 0, engineering_related: 80 } },
    { code: "CC0327-*", name: "能源概論", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 0, economics_related: 30, engineering_related: 80 } },
    { code: "CC0328-*", name: "機器學習(通識)", times: [{ day: 4, sections: [7, 8, 9] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 100, art_literature_related: 0, economics_related: 0, engineering_related: 90 } },
    { code: "CC0414-*", name: "管理學", times: [{ day: 3, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 75, ai_related: 0, art_literature_related: 0, economics_related: 90, engineering_related: 0 } },
    { code: "CC0415-*", name: "性別社會學", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 0, art_literature_related: 40, economics_related: 40, engineering_related: 0 } },
    { code: "CC0416-*", name: "法律的世界", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 0, art_literature_related: 0, economics_related: 30, engineering_related: 0 } },
    { code: "CC0417-*", name: "社會學的想像", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 30, economics_related: 50, engineering_related: 0 } },
    { code: "CC0418-*", name: "當代政治分析", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 0, art_literature_related: 10, economics_related: 60, engineering_related: 0 } },
    { code: "CC0419-*", name: "生活經濟學", times: [{ day: 1, sections: [7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 0, economics_related: 95, engineering_related: 0 } },

    // === GS 一般通識 ===
    { code: "GS2064-*", name: "鋼琴音樂作品欣賞", times: [{ day: 2, sections: [7, 8] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "GS2137-*", name: "中國志怪敘事", times: [{ day: 4, sections: [5, 6] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "GS2152-*", name: "經典古典音樂賞析", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "GS2153-*", name: "西方古典音樂欣賞", times: [{ day: 2, sections: [9, 10] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "GS2156-*", name: "精神能力(SQ)", times: [{ day: 3, sections: [1, 2] }], scores: { difficulty: 75, grading_leniency: 80, homework_load: 65, ai_related: 0, art_literature_related: 85, economics_related: 0, engineering_related: 0 } },
    { code: "GS2240-*", name: "藝術欣賞與展覽實務", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 75, ai_related: 0, art_literature_related: 95, economics_related: 10, engineering_related: 0 } },
    { code: "GS2247-*", name: "世界音樂", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 95, economics_related: 0, engineering_related: 0 } },
    { code: "GS2456-*", name: "體驗客家", times: [{ day: 1, sections: [3, 4] }], scores: { difficulty: 60, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 80, economics_related: 0, engineering_related: 0 } },
    { code: "GS2522-*", name: "記憶心理學", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 10, art_literature_related: 40, economics_related: 0, engineering_related: 10 } },
    { code: "GS2603-*", name: "文化創意產業與生活", times: [{ day: 1, sections: [3, 4] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 70, ai_related: 0, art_literature_related: 90, economics_related: 40, engineering_related: 0 } },
    { code: "GS3024-*", name: "社會企業", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 75, ai_related: 0, art_literature_related: 20, economics_related: 85, engineering_related: 0 } },
    { code: "GS3061-*", name: "社會參與議題工作坊3", times: [{ day: 3, sections: [11, 12] }], scores: { difficulty: 70, grading_leniency: 85, homework_load: 80, ai_related: 0, art_literature_related: 40, economics_related: 20, engineering_related: 0 } },
    { code: "GS3065-*", name: "數位傳播素養", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 65, grading_leniency: 80, homework_load: 65, ai_related: 20, art_literature_related: 50, economics_related: 10, engineering_related: 10 } },
    { code: "GS3071-*", name: "融媒體專題製作", times: [{ day: 4, sections: [2, 3, 4] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 85, ai_related: 30, art_literature_related: 60, economics_related: 10, engineering_related: 20 } },
    { code: "GS3073-A", name: "AI人工智慧導論", times: [{ day: 1, sections: [6, 7, 8] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 95, art_literature_related: 0, economics_related: 10, engineering_related: 90 } },
    { code: "GS3073-B", name: "AI人工智慧導論", times: [{ day: 2, sections: [10, 11, 12] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 95, art_literature_related: 0, economics_related: 10, engineering_related: 90 } },
    { code: "GS3074-*", name: "國際組織", times: [{ day: 1, sections: [1, 2] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 0, art_literature_related: 10, economics_related: 50, engineering_related: 0 } },
    { code: "GS3080-*", name: "智慧財產權概論", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 75, grading_leniency: 70, homework_load: 70, ai_related: 10, art_literature_related: 0, economics_related: 60, engineering_related: 10 } },
    { code: "GS3081-*", name: "全球化都市與社會空間", times: [{ day: 1, sections: [7, 8] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 65, ai_related: 0, art_literature_related: 30, economics_related: 40, engineering_related: 0 } },
    { code: "GS3084-*", name: "智慧城市與交通", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 60, art_literature_related: 0, economics_related: 20, engineering_related: 70 } },
    { code: "GS3087-*", name: "刑法概論", times: [{ day: 1, sections: [7, 8] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 75, ai_related: 0, art_literature_related: 0, economics_related: 10, engineering_related: 0 } },
    { code: "GS3088-*", name: "社會參與議題工作坊1", times: [{ day: 4, sections: [10, 11] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 80, ai_related: 0, art_literature_related: 40, economics_related: 20, engineering_related: 0 } },
    { code: "GS3090-*", name: "社會參與實作", times: [{ day: 5, sections: [10, 11] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 85, ai_related: 0, art_literature_related: 40, economics_related: 20, engineering_related: 0 } },
    { code: "GS3095-*", name: "資訊社會與法律", times: [{ day: 4, sections: [10, 11] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 30, art_literature_related: 0, economics_related: 10, engineering_related: 10 } },
    { code: "GS3096-*", name: "人工智慧與公共治理", times: [{ day: 1, sections: [10, 11] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 70, art_literature_related: 0, economics_related: 30, engineering_related: 40 } },
    { code: "GS3097-*", name: "消費社會學", times: [{ day: 1, sections: [3, 4] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 65, ai_related: 0, art_literature_related: 20, economics_related: 60, engineering_related: 0 } },
    { code: "GS3098-*", name: "國際科技政治", times: [{ day: 3, sections: [5, 6] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 10, art_literature_related: 0, economics_related: 50, engineering_related: 30 } },
    { code: "GS3099-*", name: "科技政策理論與實踐", times: [{ day: 3, sections: [7, 8] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 75, ai_related: 10, art_literature_related: 0, economics_related: 40, engineering_related: 30 } },
    { code: "GS3101-*", name: "地緣政治", times: [{ day: 2, sections: [7, 8] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 0, art_literature_related: 10, economics_related: 50, engineering_related: 0 } },
    { code: "GS3102-*", name: "國際政治經濟學", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 80, ai_related: 0, art_literature_related: 0, economics_related: 90, engineering_related: 0 } },
    { code: "GS3103-*", name: "國際太空政治", times: [{ day: 1, sections: [3, 4] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 65, ai_related: 10, art_literature_related: 0, economics_related: 30, engineering_related: 30 } },
    { code: "GS3104-*", name: "東北亞地緣政治", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 0, art_literature_related: 10, economics_related: 50, engineering_related: 0 } },
    { code: "GS3150-*", name: "生命教育", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 80, economics_related: 0, engineering_related: 0 } },
    { code: "GS3225-*", name: "戰爭與和平", times: [{ day: 1, sections: [3, 4] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 60, economics_related: 20, engineering_related: 0 } },
    { code: "GS3509-*", name: "媒體素養", times: [{ day: 4, sections: [3, 4] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 60, economics_related: 10, engineering_related: 0 } },
    { code: "GS3510-*", name: "大眾傳播與生活", times: [{ day: 4, sections: [7, 8] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 60, economics_related: 10, engineering_related: 0 } },
    { code: "GS3552-*", name: "資料蒐集與報告寫作", times: [{ day: 4, sections: [9, 10] }], scores: { difficulty: 60, grading_leniency: 85, homework_load: 75, ai_related: 10, art_literature_related: 20, economics_related: 0, engineering_related: 10 } },
    { code: "GS3639-*", name: "移民與社會", times: [{ day: 2, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 70, ai_related: 0, art_literature_related: 60, economics_related: 10, engineering_related: 0 } },
    { code: "GS3901-*", name: "創造力之理論與技巧", times: [{ day: 4, sections: [9, 10] }], scores: { difficulty: 60, grading_leniency: 90, homework_load: 60, ai_related: 0, art_literature_related: 80, economics_related: 0, engineering_related: 0 } },
    { code: "GS3902-*", name: "創造力與多元智慧", times: [{ day: 4, sections: [11, 12] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 0, art_literature_related: 70, economics_related: 0, engineering_related: 0 } },
    { code: "GS3905-*", name: "影像紀錄製作基礎", times: [{ day: 5, sections: [1, 2] }], scores: { difficulty: 75, grading_leniency: 80, homework_load: 85, ai_related: 0, art_literature_related: 90, economics_related: 0, engineering_related: 10 } },
    { code: "GS4110-*", name: "通識地球物理", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 70, ai_related: 10, art_literature_related: 0, economics_related: 0, engineering_related: 60 } },
    { code: "GS4413-*", name: "全球氣候變遷", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 70, grading_leniency: 80, homework_load: 65, ai_related: 0, art_literature_related: 0, economics_related: 20, engineering_related: 50 } },
    { code: "GS4452-*", name: "精準醫療與智慧醫療", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 75, ai_related: 60, art_literature_related: 0, economics_related: 10, engineering_related: 80 } },
    { code: "GS4457-*", name: "半導體入門", times: [{ day: 3, sections: [7, 8] }], scores: { difficulty: 80, grading_leniency: 70, homework_load: 80, ai_related: 20, art_literature_related: 0, economics_related: 0, engineering_related: 95 } },
    { code: "GS4458-*", name: "生成式AI導論", times: [{ day: 3, sections: [8, 9, 10] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 100, art_literature_related: 10, economics_related: 10, engineering_related: 90 } },
    { code: "GS4502-A", name: "運算思維(文客)", times: [{ day: 5, sections: [1, 2] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 80, ai_related: 40, art_literature_related: 0, economics_related: 0, engineering_related: 90 } },
    { code: "GS4502-B", name: "運算思維(文客)", times: [{ day: 5, sections: [3, 4] }], scores: { difficulty: 75, grading_leniency: 75, homework_load: 80, ai_related: 40, art_literature_related: 0, economics_related: 0, engineering_related: 90 } },
    { code: "GS4513-*", name: "定量思考", times: [{ day: 2, sections: [10, 11] }], scores: { difficulty: 75, grading_leniency: 70, homework_load: 75, ai_related: 20, art_literature_related: 0, economics_related: 30, engineering_related: 60 } },
    { code: "GS4518-*", name: "自然語言處理", times: [{ day: 1, sections: [2, 3, 4] }], scores: { difficulty: 90, grading_leniency: 70, homework_load: 85, ai_related: 100, art_literature_related: 0, economics_related: 0, engineering_related: 95 } },
    { code: "GS4519-A", name: "機器學習概論", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 85, grading_leniency: 75, homework_load: 80, ai_related: 100, art_literature_related: 0, economics_related: 0, engineering_related: 95 } },
    { code: "GS4519-B", name: "機器學習概論", times: [{ day: 3, sections: [3, 4] }], scores: { difficulty: 85, grading_leniency: 75, homework_load: 80, ai_related: 100, art_literature_related: 0, economics_related: 0, engineering_related: 95 } },
    { code: "GS4519-C", name: "機器學習概論", times: [{ day: 4, sections: [7, 8] }], scores: { difficulty: 85, grading_leniency: 75, homework_load: 80, ai_related: 100, art_literature_related: 0, economics_related: 0, engineering_related: 95 } },
    { code: "GS4521-*", name: "AI與商業運用", times: [{ day: 1, sections: [8, 9] }], scores: { difficulty: 75, grading_leniency: 80, homework_load: 75, ai_related: 90, art_literature_related: 0, economics_related: 80, engineering_related: 70 } },
    { code: "GS4524-*", name: "AI跨領域專題", times: [{ day: 2, sections: [10, 11, 12] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 85, ai_related: 95, art_literature_related: 0, economics_related: 20, engineering_related: 90 } },
    { code: "GS4525-*", name: "AI社會影響力評估", times: [{ day: 1, sections: [5, 6] }], scores: { difficulty: 70, grading_leniency: 85, homework_load: 70, ai_related: 80, art_literature_related: 20, economics_related: 60, engineering_related: 40 } },
    { code: "GS4538-*", name: "Linux與邊緣運算", times: [{ day: 3, sections: [5, 6, 7] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 85, ai_related: 50, art_literature_related: 0, economics_related: 0, engineering_related: 100 } },
    { code: "GS4539-*", name: "資料庫管理與程式", times: [{ day: 2, sections: [7, 8, 9] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 50, art_literature_related: 0, economics_related: 10, engineering_related: 95 } },
    { code: "GS4541-*", name: "數據分析智慧", times: [{ day: 1, sections: [5, 6, 7] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 90, art_literature_related: 0, economics_related: 10, engineering_related: 90 } },
    { code: "GS4715-*", name: "創意與創業", times: [{ day: 3, sections: [7, 8] }], scores: { difficulty: 65, grading_leniency: 85, homework_load: 65, ai_related: 10, art_literature_related: 30, economics_related: 90, engineering_related: 10 } },
    { code: "GS4719-A", name: "程式設計-Python", times: [{ day: 1, sections: [2, 3, 4] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 80, art_literature_related: 0, economics_related: 0, engineering_related: 100 } },
    { code: "GS4719-B", name: "程式設計-Python", times: [{ day: 2, sections: [5, 6, 7] }], scores: { difficulty: 80, grading_leniency: 75, homework_load: 80, ai_related: 80, art_literature_related: 0, economics_related: 0, engineering_related: 100 } },
    { code: "GS3077-*", name: "行政法", times: [{ day: 4, sections: [6, 7, 8] }], scores: { difficulty: 85, grading_leniency: 70, homework_load: 80, ai_related: 0, art_literature_related: 0, economics_related: 20, engineering_related: 0 } }
];

export const REQUIRED_DEPT_PRESETS: Record<string, { code: string; name: string; times: { day: number; sections: number[] }[] }[]> = {
    // We can map these if needed, but for now we focus on electives
    "CE2A": [
        { code: "CE3001-*", name: "計算機組織", times: [{ day: 4, sections: [2, 3, 4] }] },
        { code: "CE2004-A", name: "程式語言", times: [{ day: 1, sections: [7, 8, 9] }] },
        { code: "CE3005-A", name: "演算法", times: [{ day: 3, sections: [2, 3, 4] }] },
        { code: "CE3002-A", name: "作業系統", times: [{ day: 3, sections: [6, 7, 8] }] }
    ],
    // ... add others if needed
};
