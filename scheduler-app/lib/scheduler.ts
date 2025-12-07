import { Course, getCourses } from './course-data';
import { Strategy } from './gemini';

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

export function generateSchedule(
    mustTakeCourses: Course[],
    strategy: Strategy,
    targetDepartment?: string,
    targetCredits: number = 20
): Course[] {
    let schedule = [...mustTakeCourses];
    let currentCredits = schedule.reduce((sum, c) => sum + c.credit, 0);

    const allCourses = getCourses();

    // Filter out courses already in schedule
    const existingIds = new Set(schedule.map(c => c.serialNo));

    // Filter candidates based on target department and strategy
    let candidates = allCourses.filter(c => {
        if (existingIds.has(c.serialNo)) return false;

        // Always include target department courses
        if (targetDepartment && c.department === targetDepartment) return true;

        // Include General/Language courses for DIVERSE or BALANCED
        const isGeneral = c.department === 'Core and Generals Education Courses' || c.department === 'Language Center';
        if (isGeneral && (strategy === 'DIVERSE' || strategy === 'BALANCED')) return true;

        // If no target department, include everything (fallback)
        if (!targetDepartment) return true;

        return false;
    });

    // Sort candidates based on strategy
    candidates.sort((a, b) => {
        const isTargetDeptA = targetDepartment ? a.department === targetDepartment : false;
        const isTargetDeptB = targetDepartment ? b.department === targetDepartment : false;

        const isRequiredA = a.courseType === 'REQUIRED';
        const isRequiredB = b.courseType === 'REQUIRED';

        const isGeneralA = a.department === 'Core and Generals Education Courses' || a.department === 'Language Center';
        const isGeneralB = b.department === 'Core and Generals Education Courses' || b.department === 'Language Center';

        let scoreA = 0;
        let scoreB = 0;

        // Base score: Target Dept > General > Others
        if (isTargetDeptA) scoreA += 50;
        if (isTargetDeptB) scoreB += 50;

        if (strategy === 'CHALLENGING') {
            // Prioritize Required courses in Target Dept
            if (isRequiredA) scoreA += 20;
            if (isRequiredB) scoreB += 20;
        } else if (strategy === 'DIVERSE') {
            // Prioritize General courses
            if (isGeneralA) scoreA += 20;
            if (isGeneralB) scoreB += 20;
        } else {
            // Balanced: Mix of Required and General
            if (isRequiredA) scoreA += 10;
            if (isRequiredB) scoreB += 10;
            if (isGeneralA) scoreA += 10;
            if (isGeneralB) scoreB += 10;
        }

        // Randomness for variety
        scoreA += Math.random() * 5;
        scoreB += Math.random() * 5;

        return scoreB - scoreA;
    });

    for (const course of candidates) {
        if (currentCredits >= targetCredits) break;

        // Don't exceed target credits too much (allow +3 buffer)
        if (currentCredits + course.credit > targetCredits + 3) continue;

        if (!hasConflict(course, schedule)) {
            schedule.push(course);
            currentCredits += course.credit;
        }
    }

    return schedule;
}
