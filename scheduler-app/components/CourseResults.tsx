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
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[100px]">{course.teachers[0]}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {course.times.map(t => `${t.day}-${t.period}`).join(', ')}
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
                    </div>
                );
            })}
        </div>
    );
}
