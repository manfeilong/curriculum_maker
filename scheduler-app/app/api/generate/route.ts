import { NextResponse } from 'next/server';
import { getCourseBySerial } from '@/lib/course-data';
import { classifyStrategy } from '@/lib/gemini';
import { generateSchedule } from '@/lib/scheduler';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mustTakeSerialNos, userPrompt, targetDepartment, targetCredits } = body;

        if (!Array.isArray(mustTakeSerialNos)) {
            return NextResponse.json({ error: 'Invalid mustTakeSerialNos' }, { status: 400 });
        }

        const mustTakeCourses = mustTakeSerialNos
            .map(serial => getCourseBySerial(serial))
            .filter(c => c !== undefined);

        // If no prompt, default to BALANCED
        const strategy = userPrompt ? await classifyStrategy(userPrompt) : 'BALANCED';

        const schedule = generateSchedule(mustTakeCourses, strategy, targetDepartment, targetCredits);

        return NextResponse.json({
            schedule,
            strategy,
            credits: schedule.reduce((sum, c) => sum + c.credit, 0)
        });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
