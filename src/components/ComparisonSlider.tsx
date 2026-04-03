// 对比预览组件
// components/ComparisonSlider.tsx

"use client";
import { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = '原图',
  afterLabel = '处理后'
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="space-y-4">
      {/* 对比预览容器 */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-neutral-900 rounded-xl overflow-hidden cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* 处理后的图片（底层） */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-full">
            {afterLabel}
          </div>
        </div>

        {/* 原图（顶层，通过 clip-path 裁剪） */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-neutral-800 text-neutral-100 text-xs font-bold rounded-full">
            {beforeLabel}
          </div>
        </div>

        {/* 滑块分割线 */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* 滑块手柄 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
            <svg
              className="w-6 h-6 text-neutral-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 提示文字 */}
      <div className="text-center text-sm text-neutral-300">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          拖动滑块对比效果
        </span>
      </div>
    </div>
  );
}

// 简化版对比预览（左右并排）
export function SideBySideComparison({
  beforeImage,
  afterImage,
  beforeLabel = '原图',
  afterLabel = '处理后'
}: ComparisonSliderProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 原图 */}
      <div className="space-y-2">
        <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-neutral-800 text-neutral-100 text-xs font-bold rounded-full">
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* 处理后 */}
      <div className="space-y-2">
        <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
          <img
            src={afterImage}
            alt={afterLabel}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-full">
            {afterLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

// 切换式对比预览（点击切换）
export function ToggleComparison({
  beforeImage,
  afterImage,
  beforeLabel = '原图',
  afterLabel = '处理后'
}: ComparisonSliderProps) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="space-y-4">
      {/* 图片容器 */}
      <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
        <img
          src={showAfter ? afterImage : beforeImage}
          alt={showAfter ? afterLabel : beforeLabel}
          className="w-full h-full object-contain transition-opacity duration-300"
        />
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-neutral-800 text-neutral-100 text-xs font-bold rounded-full">
          {showAfter ? afterLabel : beforeLabel}
        </div>
      </div>

      {/* 切换按钮 */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAfter(!showAfter)}
          className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {showAfter ? '查看原图' : '查看处理后'}
        </button>
      </div>
    </div>
  );
}
