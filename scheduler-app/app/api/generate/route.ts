import { NextResponse } from 'next/server';
import { getCourseBySerial } from '@/lib/course-data';
import { classifyStrategy } from '@/lib/gemini';
import { generateSchedule } from '@/lib/scheduler';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mustTakeSerialNos, userPrompt, targetDepartment, targetCredits, majorRatio, userWeights } = body;

        if (!Array.isArray(mustTakeSerialNos)) {
            return NextResponse.json({ error: 'Invalid mustTakeSerialNos' }, { status: 400 });
        }

        const mustTakeCourses = mustTakeSerialNos
            .map(serial => getCourseBySerial(serial))
            .filter(c => c !== undefined);

        // Preference Resolution: Manual Override > AI Classification > Default
        let preferences = { sweet: 5, ai: 5, tech: 5, art: 5, money: 5, diff: 5 };
        if (userWeights) {
            preferences = userWeights;
        } else if (userPrompt) {
            preferences = await classifyStrategy(userPrompt);
        }

        const schedule = generateSchedule(mustTakeCourses, preferences, targetDepartment, targetCredits, majorRatio);

        return NextResponse.json({
            schedule,
            preferences,
            credits: schedule.reduce((sum, c) => sum + c.credit, 0)
        });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
