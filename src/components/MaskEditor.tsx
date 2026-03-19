import { useState, useRef, useEffect } from 'react';

interface MaskEditorProps {
  imageUrl: string;
  onMaskComplete: (maskData: string) => void;
  brushSize?: number;
}

export function MaskEditor({ imageUrl, onMaskComplete, brushSize = 20 }: MaskEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBrushSize, setCurrentBrushSize] = useState(brushSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 生成 mask 数据（红色区域）
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
    
    const maskImageData = maskCtx.createImageData(canvas.width, canvas.height);
    
    // 提取红色标记区域作为 mask
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      
      // 如果是红色标记（r > 200, g < 100, b < 100）
      if (r > 200 && g < 100 && b < 100) {
        maskImageData.data[i] = 255;     // R
        maskImageData.data[i + 1] = 255; // G
        maskImageData.data[i + 2] = 255; // B
        maskImageData.data[i + 3] = 255; // A
      } else {
        maskImageData.data[i] = 0;
        maskImageData.data[i + 1] = 0;
        maskImageData.data[i + 2] = 0;
        maskImageData.data[i + 3] = 255;
      }
    }
    
    maskCtx.putImageData(maskImageData, 0, 0);
    const maskDataUrl = maskCanvas.toDataURL('image/png');
    onMaskComplete(maskDataUrl);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 半透明红色
    ctx.beginPath();
    ctx.arc(x, y, currentBrushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">画笔大小:</label>
        <input
          type="range"
          min="5"
          max="50"
          value={currentBrushSize}
          onChange={(e) => setCurrentBrushSize(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm">{currentBrushSize}px</span>
        <button
          onClick={clearMask}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          清除标记
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="max-w-full h-auto cursor-crosshair"
          style={{ display: 'block' }}
        />
      </div>
      
      <p className="text-sm text-gray-600">
        💡 用鼠标在图片上涂抹标记要删除的区域（红色区域），完成后点击"生成"
      </p>
    </div>
  );
}
