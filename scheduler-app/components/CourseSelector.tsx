'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/lib/course-data';

interface CourseSelectorProps {
    selectedCourses: Course[];
    onSelect: (course: Course) => void;
    onRemove: (courseId: number) => void;
}

export default function CourseSelector({ selectedCourses, onSelect, onRemove }: CourseSelectorProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search for Must-Take Courses
                </label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. 日文, Python, LN0025..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Search Results */}
            {query.length >= 2 && (
                <div className="bg-white border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No courses found.</div>
                    ) : (
                        <ul>
                            {results.map((course) => {
                                const isSelected = selectedCourses.some(c => c.serialNo === course.serialNo);
                                return (
                                    <li key={course.serialNo} className="border-b last:border-b-0 p-3 hover:bg-gray-50 flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold text-gray-800">{course.title}</div>
                                            <div className="text-xs text-gray-500">
                                                {course.teachers.join(', ')} | {course.times.map(t => `${t.day}-${t.period}`).join(', ')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => !isSelected && onSelect(course)}
                                            disabled={isSelected}
                                            className={`px-3 py-1 text-sm rounded-md ${isSelected
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {isSelected ? 'Added' : 'Add'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            {/* Selected Courses List */}
            {selectedCourses.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Courses:</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedCourses.map((course) => (
                            <div key={course.serialNo} className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                <span>{course.title}</span>
                                <button
                                    onClick={() => onRemove(course.serialNo)}
                                    className="hover:text-blue-900 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
