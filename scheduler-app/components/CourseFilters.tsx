'use client';

import { useState, useEffect } from 'react';
import structure from '@/data/structure.json';

interface CourseFiltersProps {
    onFilterChange: (filters: any) => void;
}

export default function CourseFilters({ onFilterChange }: CourseFiltersProps) {
    const [query, setQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [courseType, setCourseType] = useState('');

    // Reset department when college changes
    useEffect(() => {
        setSelectedDept('');
    }, [selectedCollege]);

    // Debounce filter updates
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({
                query,
                college: selectedCollege,
                department: selectedDept,
                day: selectedDay,
                period: selectedPeriod,
                courseType
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, selectedCollege, selectedDept, selectedDay, selectedPeriod, courseType, onFilterChange]);

    const departments = structure.find(c => c.name === selectedCollege)?.departments || [];

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Search */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">搜尋課程</label>
                <input
                    type="text"
                    className="w-full p-2.5 text-base border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                    placeholder="課程名稱, 教師, 代碼..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">學院</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        value={selectedCollege}
                        onChange={(e) => setSelectedCollege(e.target.value)}
                    >
                        <option value="">所有學院</option>
                        {structure.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">系所</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all disabled:bg-gray-100 disabled:text-gray-400"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        disabled={!selectedCollege}
                    >
                        <option value="">所有系所</option>
                        {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">星期</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        <option value="">不限</option>
                        <option value="1">週一</option>
                        <option value="2">週二</option>
                        <option value="3">週三</option>
                        <option value="4">週四</option>
                        <option value="5">週五</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">節次</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="">不限</option>
                        {Array.from({ length: 14 }, (_, i) => i + 1).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">必選修</label>
                <div className="flex gap-2">
                    {[
                        { value: 'REQUIRED', label: '必修' },
                        { value: 'ELECTIVE', label: '選修' }
                    ].map(type => (
                        <button
                            key={type.value}
                            onClick={() => setCourseType(courseType === type.value ? '' : type.value)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg border-2 transition-all ${courseType === type.value
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
