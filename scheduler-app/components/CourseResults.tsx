'use client';

import { Course } from '@/lib/course-data';

interface CourseResultsProps {
    results: Course[];
    selectedCourses: Course[];
    onSelect: (course: Course) => void;
    onRemove: (serialNo: number) => void;
    loading: boolean;
}

export default function CourseResults({ results, selectedCourses, onSelect, onRemove, loading }: CourseResultsProps) {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">搜尋中...</div>;
    }

    if (results.length === 0) {
        return <div className="p-8 text-center text-gray-500">找不到課程，請調整篩選條件。</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {results.map((course) => {
                const isSelected = selectedCourses.some(c => c.serialNo === course.serialNo);
                return (
                    <div
                        key={course.serialNo}
                        className={`p-3 rounded-lg border transition-all hover:shadow-md ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate" title={course.title}>
                                    {course.title}
                                </h3>
                                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">{course.classNo}</span>
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">{course.credit}學分</span>
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={course.teachers.join(', ')}>
                                        {course.teachers.join(', ')}
                                    </span>
                                    <span className={`px-1.5 py-0.5 rounded font-medium ${course.limitCnt > 0 && course.admitCnt >= course.limitCnt
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-green-100 text-green-700'
                                        }`}>
                                        人數: {course.admitCnt}/{course.limitCnt === 0 ? '不限' : course.limitCnt}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => isSelected ? onRemove(course.serialNo) : onSelect(course)}
                                className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isSelected
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isSelected ? '移除' : '加入'}
                            </button>
                        </div>
                        {/* Time & Location Badge */}
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-1.5 rounded flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>
                                {formatCourseTime(course.times)}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function formatCourseTime(times: { day: number; period: number }[]) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const byDay: Record<number, number[]> = {};
    times.forEach(t => {
        if (!byDay[t.day]) byDay[t.day] = [];
        byDay[t.day].push(t.period);
    });

    return Object.entries(byDay)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([day, periods]) => {
            periods.sort((a, b) => a - b);
            // Simple range formatting check
            // Actually periods likely usually 1-2 hrs, so just joining is fine for now unless we want complex range detection
            // Let's try to group ranges: 1, 2, 3 -> 1-3
            const ranges: string[] = [];
            let start = periods[0];
            let prev = periods[0];

            for (let i = 1; i < periods.length; i++) {
                if (periods[i] !== prev + 1) {
                    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                    start = periods[i];
                }
                prev = periods[i];
            }
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`);

            return `週${days[Number(day)]} ${ranges.join(',')}`;
        })
        .join('、');
}
