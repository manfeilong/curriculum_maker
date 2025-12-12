import { NextResponse } from 'next/server';
import { searchCourses } from '@/lib/course-data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filters = {
        query: searchParams.get('q') || undefined,
        college: searchParams.get('college') || undefined,
        department: searchParams.get('department') || undefined,
        day: searchParams.get('day') ? parseInt(searchParams.get('day')!) : undefined,
        period: searchParams.get('period') ? parseInt(searchParams.get('period')!) : undefined,
        courseType: searchParams.get('courseType') || undefined,
        minCredits: searchParams.get('minCredits') ? parseInt(searchParams.get('minCredits')!) : undefined,
        maxCredits: searchParams.get('maxCredits') ? parseInt(searchParams.get('maxCredits')!) : undefined,
        availableOnly: searchParams.get('availableOnly') === 'true',
    };

    // If no filters at all, return empty to avoid loading everything
    if (Object.values(filters).every(v => v === undefined)) {
        return NextResponse.json([]);
    }

    const results = searchCourses(filters);
    return NextResponse.json(results);
}
