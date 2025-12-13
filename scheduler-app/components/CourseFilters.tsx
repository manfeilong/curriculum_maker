'use client';

import { useState, useEffect } from 'react';
import structure from '@/data/structure.json';

interface CourseFiltersProps {
    onFilterChange: (filters: any) => void;
}

const COLLEGE_MAP: Record<string, string> = {
    "Centres and Institues": "中心/學程",
    "College of Earth Sciences": "地科學院",
    "College of Electrical Engineering and Computer Science": "電資學院",
    "College of Engineering": "工學院",
    "College of Graduate College of Sustainability and Green Energy": "永續與綠能學院",
    "College of Hakka Studies": "客家學院",
    "College of Health Sciences and Technology": "生醫理工學院",
    "College of Liberal Arts": "文學院",
    "College of Management": "管理學院",
    "College of Science": "理學院"
};

export default function CourseFilters({ onFilterChange }: CourseFiltersProps) {
    const [query, setQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [courseType, setCourseType] = useState('');
    const [minCredits, setMinCredits] = useState('');
    const [maxCredits, setMaxCredits] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);

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
                courseType,
                minCredits: minCredits ? Number(minCredits) : undefined,
                maxCredits: maxCredits ? Number(maxCredits) : undefined,
                availableOnly
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [query, selectedCollege, selectedDept, selectedDay, selectedPeriod, courseType, minCredits, maxCredits, availableOnly, onFilterChange]);

    const departments = structure.find(c => c.name === selectedCollege)?.departments || [];

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Search */}
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">搜尋課程</label>
                <input
                    type="text"
                    className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-500"
                    placeholder="課程名稱, 教師, 代碼..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">學院</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                        value={selectedCollege}
                        onChange={(e) => setSelectedCollege(e.target.value)}
                    >
                        <option value="">所有學院</option>
                        {structure.map(c => (
                            <option key={c.name} value={c.name}>{COLLEGE_MAP[c.name] || c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">系所</label>
                    <select
                        className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all disabled:bg-gray-100 disabled:text-gray-400"
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
                        className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
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
                        className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
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

            {/* Credits & Availability */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">學分範圍</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                            placeholder="Min"
                            value={minCredits}
                            onChange={(e) => setMinCredits(e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            min="0"
                            className="w-full p-2.5 text-base border-2 border-gray-400 rounded-lg text-black font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                            placeholder="Max"
                            value={maxCredits}
                            onChange={(e) => setMaxCredits(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(e) => setAvailableOnly(e.target.checked)}
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-bold text-gray-900">僅顯示有餘額</span>
                    </label>
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
                                : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
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
