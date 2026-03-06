'use client';

import { useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const localStats = analytics.getStats();
    setStats(localStats);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">数据统计</h1>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 数据统计</h1>

        {/* 总览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">总事件数</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalEvents}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">使用功能数</h3>
            <p className="text-3xl font-bold text-blue-600">
              {Object.keys(stats.featureUse).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">使用预设数</h3>
            <p className="text-3xl font-bold text-green-600">
              {Object.keys(stats.presetUse).length}
            </p>
          </div>
        </div>

        {/* 热门功能 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🔥 热门功能 TOP 10</h2>
          {stats.topFeatures.length > 0 ? (
            <div className="space-y-3">
              {stats.topFeatures.map(([featureId, count]: [string, number], index: number) => (
                <div key={featureId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-sm w-6">#{index + 1}</span>
                    <span className="font-medium">{featureId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.topFeatures[0][1]) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-gray-600 font-mono text-sm w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 热门预设 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">⭐ 热门预设 TOP 10</h2>
          {stats.topPresets.length > 0 ? (
            <div className="space-y-3">
              {stats.topPresets.map(([key, count]: [string, number], index: number) => {
                const [featureId, presetId] = key.split(':');
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-mono text-sm w-6">#{index + 1}</span>
                      <div>
                        <span className="font-medium">{featureId}</span>
                        <span className="text-gray-500 text-sm ml-2">/ {presetId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(count / stats.topPresets[0][1]) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-gray-600 font-mono text-sm w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">暂无数据</p>
          )}
        </div>

        {/* 清除数据按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              if (confirm('确定要清除所有统计数据吗？')) {
                analytics.clear();
                window.location.reload();
              }
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            清除统计数据
          </button>
        </div>
      </div>
    </div>
  );
}
