'use client';

import { useState, useEffect } from 'react';
import CourseFilters from '@/components/CourseFilters';
import CourseResults from '@/components/CourseResults';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { AutoRegisterModal } from '@/components/AutoRegisterModal';
import { Course, SearchFilters } from '@/lib/course-data';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';
import structure from '@/data/structure.json';

export default function Home() {
  // State
  const [schedule, setSchedule] = useState<Course[]>([]);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // AI State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [targetDept, setTargetDept] = useState('');
  const [targetCredits, setTargetCredits] = useState(20);
  const [aiLoading, setAiLoading] = useState(false);

  // Auto Register Modal
  const [isAutoRegisterOpen, setIsAutoRegisterOpen] = useState(false);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.query) params.set('q', filters.query);
        if (filters.college) params.set('college', filters.college);
        if (filters.department) params.set('department', filters.department);
        if (filters.day) params.set('day', filters.day.toString());
        if (filters.period) params.set('period', filters.period.toString());
        if (filters.courseType) params.set('courseType', filters.courseType);

        const res = await fetch(`/api/courses/search?${params.toString()}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  const handleAddCourse = (course: Course) => {
    if (schedule.some(c => c.serialNo === course.serialNo)) return;
    setSchedule(prev => [...prev, course]);
  };

  const handleRemoveCourse = (serialNo: number) => {
    setSchedule(prev => prev.filter(c => c.serialNo !== serialNo));
  };

  const handleAiGenerate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mustTakeSerialNos: schedule.map(c => c.serialNo),
          userPrompt: aiPrompt,
          targetDepartment: targetDept,
          targetCredits: targetCredits
        })
      });
      const data = await res.json();
      if (data.schedule) {
        setSchedule(data.schedule);
        setIsAiModalOpen(false);
      }
    } catch (e) {
      console.error(e);
      alert('AI Generation Failed');
    } finally {
      setAiLoading(false);
    }
  };

  const totalCredits = schedule.reduce((sum, c) => sum + c.credit, 0);

  // Flatten departments for dropdown
  const allDepartments = structure.flatMap(c => c.departments).sort();

  return (
    <main className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">NCU 排課助手</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-600">
            目前學分: <span className={totalCredits > 25 ? 'text-red-600' : 'text-green-600'}>{totalCredits}</span>
          </div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm text-sm font-medium"
          >
            <Sparkles size={16} />
            AI 自動填課
          </button>

          <button
            onClick={() => setIsAutoRegisterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-sm text-sm font-medium"
          >
            🚀 自動選課
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Search & Filters */}
        <aside className="w-[400px] flex flex-col border-r bg-white">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">尋找課程</h2>
            <CourseFilters onFilterChange={setFilters} />
          </div>
          <CourseResults
            results={searchResults}
            selectedCourses={schedule}
            onSelect={handleAddCourse}
            onRemove={handleRemoveCourse}
            loading={loading}
          />
        </aside>

        {/* Right Panel: Schedule */}
        <section className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
          <div className="p-4 flex-1 overflow-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-full">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800">每週課表</h2>
              </div>
              <ScheduleCalendar schedule={schedule} onRemoveCourse={handleRemoveCourse} />
            </div>
          </div>
        </section>
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-purple-600" />
              AI 填課助手
            </h3>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-1.5">目標系所</label>
              <select
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg text-gray-900 font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all"
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
              >
                <option value="">選擇系所...</option>
                {allDepartments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-1.5">目標總學分</label>
              <input
                type="number"
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg text-gray-900 font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all"
                value={targetCredits}
                onChange={(e) => setTargetCredits(parseInt(e.target.value))}
                min={1}
                max={30}
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-1.5">學期期望 (Vibe)</label>
              <textarea
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-base text-gray-900 font-medium focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all min-h-[100px]"
                placeholder="例如：我想多修一點系上必修，但也想修一些有趣的通識..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {aiLoading ? '生成中...' : '開始填課'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Auto Register Modal */}
      <AutoRegisterModal
        open={isAutoRegisterOpen}
        onOpenChange={setIsAutoRegisterOpen}
        courses={schedule}
      />
    </main>
  );
}
