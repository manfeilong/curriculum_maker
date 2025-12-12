import { Course, getCourses } from './course-data';
import { UserPreferences } from './gemini';
import { ELECTIVES_DATA, RecommendationInfo } from './recommendation-data';

function hasConflict(course: Course, currentSchedule: Course[]): boolean {
    for (const existing of currentSchedule) {
        for (const t1 of course.times) {
            for (const t2 of existing.times) {
                if (t1.day === t2.day && t1.period === t2.period) {
                    return true;
                }
            }
        }
    }
    return false;
}

function calculateScore(recCourse: RecommendationInfo, prefs: UserPreferences): number {
    const raw = recCourse.scores;
    let score = 0;
    score += raw.grading_leniency * prefs.sweet;
    score += raw.ai_related * prefs.ai;
    score += raw.engineering_related * prefs.tech;
    score += raw.art_literature_related * prefs.art;
    score += raw.economics_related * prefs.money;
    score += raw.difficulty * prefs.diff;
    score += raw.homework_load * -0.3; // Fixed penalty for homework load
    return score;
}

// Helper to normalize course codes (e.g., CC0129-* -> CC0129)
function normalizeCode(code: string): string {
    return code.replace('-*', '').replace('-A', '').replace('-B', '').replace('-C', '');
}

export function generateSchedule(
    mustTakeCourses: Course[],
    prefs: UserPreferences,
    targetDepartment?: string,
    targetCredits: number = 20,
    majorRatio: number = 0.5 // Default 50%
): Course[] {
    // 1. Initialize Schedule & Credits
    let schedule = [...mustTakeCourses];
    let currentCredits = schedule.reduce((sum, c) => sum + c.credit, 0);

    const allCourses = getCourses();
    const existingIds = new Set(schedule.map(c => c.serialNo));

    // Calculate Credit Buckets
    // Major credits needed = (Total Target * Ratio) - (Already taken Major credits)
    // But simplified: We just try to fill up to Target * Ratio with Major electives first.
    const targetMajorCredits = Math.round(targetCredits * majorRatio);

    // ==========================================
    // Phase 1: Fill Major Electives
    // ==========================================
    if (targetDepartment) {
        // Is this a department we have detailed scores for? (Currently only CS/EE related in our fake DB)
        // In our recommendation-data.ts, we only have CE/CC/GS. 
        // If targetDepartment is NOT "Department of Computer Science...", we probably have NO scores for its majors.
        // So we need a fallback: "Randomly select from available major courses"

        // Filter all courses for this department
        let majorCandidates = allCourses.filter(c =>
            c.department === targetDepartment &&
            !existingIds.has(c.serialNo) &&
            c.courseType !== 'REQUIRED' // Assuming we are filling electives here. 
            // Note: If user wants REQUIRED, they can't really "choose", they are usually auto-assigned or must-take.
            // But if there are multiple sections, they might be here.
        );

        // Check if we have scores for ANY of these candidates
        // We do this by checking if they exist in ELECTIVES_DATA (by fuzzy matching classNo)
        // Since we didn't map "Department Name" to "ACRONYM" (like CE), we check loosely.
        const scoredCodes = new Set(ELECTIVES_DATA.map(r => normalizeCode(r.code)));

        const scoredMajorCandidates: { course: Course, score: number }[] = [];
        const unscoredMajorCandidates: Course[] = [];

        majorCandidates.forEach(c => {
            const classCodeBase = normalizeCode(c.classNo);
            // Check if we have a scored record
            // We need to find the exact record to pass to calculateScore
            const recInfo = ELECTIVES_DATA.find(r => normalizeCode(r.code) === classCodeBase);

            if (recInfo) {
                const score = calculateScore(recInfo, prefs);
                scoredMajorCandidates.push({ course: c, score });
            } else {
                unscoredMajorCandidates.push(c);
            }
        });

        // Strategy: Use Scored first, then Unscored (Randomized)
        scoredMajorCandidates.sort((a, b) => b.score - a.score); // DESC
        // Shuffle unscored
        for (let i = unscoredMajorCandidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unscoredMajorCandidates[i], unscoredMajorCandidates[j]] = [unscoredMajorCandidates[j], unscoredMajorCandidates[i]];
        }

        // Merge candidates
        const finalMajorCandidates = [
            ...scoredMajorCandidates.map(x => x.course),
            ...unscoredMajorCandidates
        ];

        // Fill Major Credits
        for (const course of finalMajorCandidates) {
            // Check major credit cap
            const currentMajorCredits = schedule.filter(c => c.department === targetDepartment).reduce((sum, c) => sum + c.credit, 0);
            if (currentMajorCredits >= targetMajorCredits) break; // Reached Major Limit

            // Check total credit cap
            if (currentCredits + course.credit > targetCredits + 3) continue;

            if (schedule.some(c => c.serialNo === course.serialNo)) continue;
            if (!hasConflict(course, schedule)) {
                schedule.push(course);
                currentCredits += course.credit;
                existingIds.add(course.serialNo);
            }
        }
    }

    // ==========================================
    // Phase 2: Fill General Electives (CC / GS)
    // ==========================================
    // These are fully scored in ELECTIVES_DATA.
    let generalCandidates: { course: Course; score: number }[] = [];

    // Get all CC/GS courses from real DB
    // Filter by codes in ELECTIVES_DATA
    const ccGsRecs = ELECTIVES_DATA.filter(r => r.code.startsWith('CC') || r.code.startsWith('GS'));

    for (const rec of ccGsRecs) {
        const normCode = normalizeCode(rec.code);
        const matches = allCourses.filter(c => c.classNo.startsWith(normCode) && !existingIds.has(c.serialNo));
        const score = calculateScore(rec, prefs);

        matches.forEach(m => generalCandidates.push({ course: m, score }));
    }

    // Sort by Score
    generalCandidates.sort((a, b) => b.score - a.score);

    // Fill remaining credits
    for (const candidate of generalCandidates) {
        if (currentCredits >= targetCredits) break;

        const { course } = candidate;

        // Strict Cap for Total Credits (allow small buffer)
        if (currentCredits + course.credit > targetCredits + 3) continue;

        if (schedule.some(c => c.serialNo === course.serialNo)) continue;
        if (!hasConflict(course, schedule)) {
            schedule.push(course);
            currentCredits += course.credit;
        }
    }

    return schedule;
}
