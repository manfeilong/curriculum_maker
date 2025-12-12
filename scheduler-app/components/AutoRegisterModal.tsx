import React, { useState, useEffect } from 'react';
import { Course } from '@/lib/course-data';
import { Loader2, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink, X } from 'lucide-react';

interface AutoRegisterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courses: Course[];
}

type RegisterStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

interface CourseStatus {
    course: Course;
    status: RegisterStatus;
    message?: string;
}

export function AutoRegisterModal({ open, onOpenChange, courses }: AutoRegisterModalProps) {
    const [step, setStep] = useState<1 | 2>(1); // 1: Input, 2: Process
    const [jsessionid, setJsessionid] = useState('');
    const [scriptSessionId, setScriptSessionId] = useState('');
    const [results, setResults] = useState<CourseStatus[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize results when opening or getting courses
    useEffect(() => {
        if (open) {
            setResults(courses.map(c => ({ course: c, status: 'PENDING' })));
            setStep(1);
        }
    }, [open, courses]);

    if (!open) return null;

    const handleStart = async () => {
        if (!jsessionid || !scriptSessionId) return;

        setStep(2);
        setIsProcessing(true);

        // Process one by one
        for (let i = 0; i < results.length; i++) {
            const current = results[i];
            if (current.status === 'SUCCESS') continue; // Skip already succeeded if retrying?

            // Update to processing
            setResults(prev => {
                const next = [...prev];
                next[i] = { ...next[i], status: 'PROCESSING' };
                return next;
            });

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsessionid: jsessionid.trim(),
                        scriptSessionId: scriptSessionId.trim(),
                        serialNo: current.course.serialNo
                    })
                });

                const data = await response.json();

                // Interpret Result
                let status: RegisterStatus = 'FAILED';
                let msg = '未知錯誤';

                if (data.status === 'SUCCESS_CALL' || data.success) {
                    const text = data.data as string;
                    // Relaxed logic: Default to Success
                    status = 'SUCCESS';
                    msg = '請求已送出 (視為成功)';

                    // Try to detect specific errors if readable
                    if (text.includes('額滿')) {
                        status = 'FAILED';
                        msg = '課程已額滿';
                    } else if (text.includes('衝堂')) {
                        status = 'FAILED';
                        msg = '時間衝堂';
                    }

                    if (text.includes('加選成功') || text.includes('Success')) {
                        msg = '加選成功';
                    }
                } else {
                    msg = data.message || '連線錯誤';
                }

                // Update Status
                setResults(prev => {
                    const next = [...prev];
                    next[i] = { ...next[i], status: status, message: msg };
                    return next;
                });

            } catch (e) {
                setResults(prev => {
                    const next = [...prev];
                    next[i] = { ...next[i], status: 'FAILED', message: '請求發送失敗' };
                    return next;
                });
            }

            // Small delay for animation feel
            await new Promise(r => setTimeout(r, 800));
        }

        setIsProcessing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">自動進系統加選課程</h2>
                        <p className="text-sm text-slate-500 mt-1">此功能會模擬瀏覽器行為，自動將您排程中的課程送出加選請求。</p>
                    </div>
                    <button
                        onClick={() => !isProcessing && onOpenChange(false)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        disabled={isProcessing}
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                                <div className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    準備步驟 (取得驗證資訊)
                                </div>
                                <ol className="list-decimal list-inside space-y-3 text-sm text-blue-900 ml-1">
                                    <li>
                                        登入 <a href="https://cis.ncu.edu.tw/Course/main/news/announce" target="_blank" className="text-blue-600 hover:underline inline-flex items-center font-medium">
                                            中央大學選課系統 <ExternalLink className="w-3 h-3 ml-0.5" />
                                        </a> 並進入選課頁面。
                                    </li>
                                    <li>
                                        按下 <strong>F12</strong> 開啟開發者工具。
                                    </li>
                                    <li>
                                        取得 <strong>scriptSessionId</strong>:
                                        <div className="mt-1 pl-4 mb-2 text-slate-600">
                                            切換到 <strong>Console (主控台)</strong> 分頁，輸入下方指令並複製結果：
                                        </div>
                                        <div className="bg-slate-900 text-slate-100 p-3 rounded-md font-mono text-xs flex justify-between items-center ml-4 shadow-inner">
                                            <code>dwr.engine._scriptSessionId</code>
                                            <button
                                                className="p-1.5 hover:bg-white/20 rounded text-slate-400 hover:text-white transition-colors"
                                                onClick={() => navigator.clipboard.writeText('dwr.engine._scriptSessionId')}
                                                title="複製指令"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                    <li>
                                        取得 <strong>JSESSIONID</strong>:
                                        <div className="mt-1 pl-4 text-slate-600">
                                            切換到 <strong>Application (應用程式)</strong> 分頁 {'->'} 左側 <strong>Cookies</strong> {'->'} 找到 <code>JSESSIONID</code> 並複製其值。
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            <div className="grid gap-5">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                        <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">🤖</span>
                                        快速登入 (推薦)
                                    </h3>
                                    <button
                                        onClick={async () => {
                                            if (isProcessing) return;
                                            try {
                                                setIsProcessing(true); // Re-use isProcessing to block other actions

                                                const res = await fetch('/api/auth-script', { method: 'POST' });
                                                const data = await res.json();

                                                if (data.error) {
                                                    alert('自動登入失敗: ' + (data.details || data.error));
                                                } else {
                                                    if (data.JSESSIONID) setJsessionid(data.JSESSIONID);
                                                    if (data.scriptSessionId) setScriptSessionId(data.scriptSessionId);
                                                }
                                            } catch (e) {
                                                alert('連線錯誤');
                                            } finally {
                                                setIsProcessing(false);
                                            }
                                        }}
                                        disabled={isProcessing}
                                        className="w-full py-2.5 bg-white border-2 border-slate-800 text-slate-800 font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                正在等待您在視窗中登入...
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="w-4 h-4" />
                                                開啟登入視窗並自動取得 ID
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                        點擊後將開啟 Chrome 視窗，請手動登入學校系統並進入選課頁面。
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">或是手動輸入</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="scriptSessionId" className="text-sm font-medium text-slate-700">
                                        scriptSessionId
                                    </label>
                                    <input
                                        id="scriptSessionId"
                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                        placeholder="例如: 1B14E8DF56C9D06DA10BDB5061374E17"
                                        value={scriptSessionId}
                                        onChange={e => setScriptSessionId(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="jsessionid" className="text-sm font-medium text-slate-700">
                                        JSESSIONID
                                    </label>
                                    <input
                                        id="jsessionid"
                                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                        placeholder="例如: CAE3A5B375C9DA267831989A12EA8C37"
                                        value={jsessionid}
                                        onChange={e => setJsessionid(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="h-[300px] w-full border border-slate-200 rounded-lg bg-slate-50 overflow-y-auto p-4">
                            <div className="space-y-3">
                                {results.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800">{item.course.title}</span>
                                            <span className="text-xs text-slate-500 mt-0.5">{item.course.serialNo} - {item.course.teachers.join(',')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.status === 'PENDING' && <span className="text-slate-400 text-sm font-medium bg-slate-100 px-2 py-1 rounded">等待中</span>}
                                            {item.status === 'PROCESSING' && (
                                                <div className="flex items-center text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded">
                                                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                                                    處理中...
                                                </div>
                                            )}
                                            {item.status === 'SUCCESS' && (
                                                <div className="flex items-center text-green-700 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                                    {item.message || '加選成功'}
                                                </div>
                                            )}
                                            {item.status === 'FAILED' && (
                                                <div className="flex items-center text-red-700 text-sm font-medium bg-red-50 px-2 py-1 rounded">
                                                    <XCircle className="w-4 h-4 mr-1.5" />
                                                    {item.message || '失敗'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                    {step === 1 ? (
                        <button
                            onClick={handleStart}
                            disabled={!jsessionid || !scriptSessionId || courses.length === 0}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            開始自動加選 ({courses.length})
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep(1)}
                            disabled={isProcessing}
                            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            {isProcessing ? '正在執行...' : '返回 / 修改ID'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
