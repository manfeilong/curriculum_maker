import { Course } from '@/lib/course-data';
import { X } from 'lucide-react';

interface ScheduleCalendarProps {
    schedule: Course[];
    onRemoveCourse?: (serialNo: number) => void;
}

const DAYS = ['一', '二', '三', '四', '五'];
const PERIODS = Array.from({ length: 14 }, (_, i) => i + 1);

export default function ScheduleCalendar({ schedule, onRemoveCourse }: ScheduleCalendarProps) {
    const getCoursesForSlot = (day: number, period: number) => {
        return schedule.filter(c => c.times.some(t => t.day === day && t.period === period));
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px] border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 bg-gray-50 border-b">
                    <div className="p-2 text-center text-sm font-medium text-gray-500 border-r">節次</div>
                    {DAYS.map((day, i) => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {PERIODS.map((period) => (
                    <div key={period} className="grid grid-cols-6 border-b last:border-b-0">
                        <div className="p-2 text-center text-xs text-gray-500 border-r bg-gray-50 flex items-center justify-center">
                            {period}
                        </div>
                        {DAYS.map((_, dayIndex) => {
                            const dayNum = dayIndex + 1; // 1-based day
                            const courses = getCoursesForSlot(dayNum, period);
                            const isConflict = courses.length > 1;

                            return (
                                <div key={dayNum} className={`p-1 border-r last:border-r-0 min-h-[60px] relative ${isConflict ? 'bg-red-50' : ''}`}>
                                    {courses.map((course) => (
                                        <div
                                            key={course.serialNo}
                                            className={`text-xs p-1 rounded mb-1 shadow-sm group relative ${isConflict ? 'bg-red-100 text-red-800 border border-red-300' :
                                                    course.courseType === 'REQUIRED' ? 'bg-red-50 text-red-800 border border-red-200' :
                                                        course.department === 'Core and Generals Education Courses' ? 'bg-green-50 text-green-800 border border-green-200' :
                                                            'bg-blue-50 text-blue-800 border border-blue-200'
                                                }`}
                                        >
                                            <div className="font-bold truncate" title={course.title}>{course.title}</div>
                                            <div className="truncate text-[10px]">{course.teachers[0]}</div>

                                            {onRemoveCourse && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveCourse(course.serialNo);
                                                    }}
                                                    className="absolute -top-1 -right-1 bg-white rounded-full shadow-md p-0.5 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
