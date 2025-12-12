'use client';

import { useState, useEffect } from 'react';
import CourseFilters from '@/components/CourseFilters';
import CourseResults from '@/components/CourseResults';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import { AutoRegisterModal } from '@/components/AutoRegisterModal';
import { Course, SearchFilters } from '@/lib/course-data';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';
import structure from '@/data/structure.json';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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

  // Advanced Options
  const [majorRatio, setMajorRatio] = useState(50); // 0-100%
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [manualWeights, setManualWeights] = useState({
    sweet: 5, ai: 5, tech: 5, art: 5, money: 5, diff: 5
  });
  const [useManualWeights, setUseManualWeights] = useState(false);

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
        if (filters.minCredits) params.set('minCredits', filters.minCredits.toString());
        if (filters.maxCredits) params.set('maxCredits', filters.maxCredits.toString());
        if (filters.availableOnly) params.set('availableOnly', 'true');

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
          targetCredits: targetCredits,
          majorRatio: majorRatio / 100, // Convert to 0.0-1.0
          userWeights: useManualWeights ? manualWeights : undefined
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

  const updateWeight = (key: keyof typeof manualWeights, val: number) => {
    setManualWeights(prev => ({ ...prev, [key]: val }));
  };

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

      {/* Resizable Content */}
      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* Sidebar Panel */}
        <Panel defaultSize={30} minSize={20} maxSize={50}>
          <PanelGroup direction="vertical">
            {/* Filters Panel */}
            <Panel defaultSize={40} minSize={20}>
              <div className="h-full flex flex-col border-r bg-white overflow-hidden">
                <div className="p-4 border-b bg-gray-50 shrink-0">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">尋找課程</h2>
                  <CourseFilters onFilterChange={setFilters} />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-gray-100 border-y border-gray-200 hover:bg-blue-100 transition-colors cursor-row-resize flex justify-center items-center">
              <div className="w-8 h-1 rounded-full bg-gray-300" />
            </PanelResizeHandle>

            {/* Results Panel */}
            <Panel minSize={20}>
              <div className="h-full flex flex-col border-r bg-white overflow-hidden">
                <CourseResults
                  results={searchResults}
                  selectedCourses={schedule}
                  onSelect={handleAddCourse}
                  onRemove={handleRemoveCourse}
                  loading={loading}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-100 border-x border-gray-200 hover:bg-blue-100 transition-colors cursor-col-resize flex justify-center items-center">
          <div className="h-8 w-1 rounded-full bg-gray-300" />
        </PanelResizeHandle>

        {/* Schedule Panel */}
        <Panel>
          <section className="h-full flex flex-col overflow-hidden bg-gray-50/50">
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
        </Panel>
      </PanelGroup>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-purple-600" />
              AI 填課助手
            </h3>

            <div className="space-y-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">目標系所</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  value={targetDept}
                  onChange={(e) => setTargetDept(e.target.value)}
                >
                  <option value="">選擇系所...</option>
                  {allDepartments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Credits & Ratio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">目標總學分</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={targetCredits}
                    onChange={(e) => setTargetCredits(parseInt(e.target.value))}
                    min={1}
                    max={30}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">本系選修比例: {majorRatio}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className="w-full accent-purple-600"
                    value={majorRatio}
                    onChange={(e) => setMajorRatio(parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">學期期望 (Vibe)</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
                  placeholder="例如：我想多修一點系上必修，但也想修一些有趣的通識..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={useManualWeights}
                />
              </div>

              {/* Advanced Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1"
                >
                  {showAdvanced ? '收起進階選項' : '顯示進階選項 (權重調整)'}
                </button>
              </div>

              {/* Advanced Options */}
              {/* Advanced Options */}
              {showAdvanced && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="useManual"
                      checked={useManualWeights}
                      onChange={(e) => setUseManualWeights(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="useManual" className="text-sm font-bold text-gray-700 cursor-pointer">
                      手動設定權重 (忽略文字期望)
                    </label>
                  </div>

                  <div className={`grid grid-cols-2 gap-x-4 gap-y-2 ${!useManualWeights ? 'opacity-50 pointer-events-none' : ''}`}>
                    {[
                      { key: 'sweet', label: '甜度 (Sweetness)' },
                      { key: 'ai', label: 'AI 人工智慧' },
                      { key: 'tech', label: '工程/硬體' },
                      { key: 'art', label: '文藝/人文' },
                      { key: 'money', label: '商業/經濟' },
                      { key: 'diff', label: '硬課偏好 (Difficulty)' }
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                          <span>{label}</span>
                          <span>{manualWeights[key as keyof typeof manualWeights]}</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          value={manualWeights[key as keyof typeof manualWeights]}
                          onChange={(e) => updateWeight(key as any, parseInt(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${aiLoading
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x cursor-wait'
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AI 思考中...</span>
                  </div>
                ) : (
                  '開始填課'
                )}
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
