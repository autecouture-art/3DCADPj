import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import SketchToolbar from './SketchToolbar';
import './SketchCanvas.css';

type SketchTool = 'select' | 'line' | 'rectangle' | 'circle';

interface Point {
  x: number;
  y: number;
}

interface SketchEntity {
  id: string;
  type: 'line' | 'rectangle' | 'circle';
  points: Point[];
  radius?: number;
}

const SketchCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedPlane, exitSketchMode, addSketchEntity } = useAppStore();
  const [currentTool, setCurrentTool] = useState<SketchTool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [entities, setEntities] = useState<SketchEntity[]>([]);

  // キャンバスのセットアップ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズを設定
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // グリッドを描画
    drawGrid(ctx, canvas.width, canvas.height);

    // エンティティを描画
    drawEntities(ctx);

    // 現在の描画中のプレビューを表示
    if (isDrawing && startPoint && currentPoint) {
      drawPreview(ctx);
    }
  }, [entities, isDrawing, startPoint, currentPoint, currentTool]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;

    // 縦線
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 横線
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 原点の軸を強調
    const centerX = width / 2;
    const centerY = height / 2;

    // X軸（赤）
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y軸（緑）
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
  };

  const drawEntities = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;

    entities.forEach(entity => {
      switch (entity.type) {
        case 'line':
          if (entity.points.length === 2) {
            ctx.beginPath();
            ctx.moveTo(entity.points[0].x, entity.points[0].y);
            ctx.lineTo(entity.points[1].x, entity.points[1].y);
            ctx.stroke();
          }
          break;

        case 'rectangle':
          if (entity.points.length === 2) {
            const width = entity.points[1].x - entity.points[0].x;
            const height = entity.points[1].y - entity.points[0].y;
            ctx.strokeRect(entity.points[0].x, entity.points[0].y, width, height);
          }
          break;

        case 'circle':
          if (entity.points.length === 2 && entity.radius) {
            ctx.beginPath();
            ctx.arc(entity.points[0].x, entity.points[0].y, entity.radius, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
      }
    });
  };

  const drawPreview = (ctx: CanvasRenderingContext2D) => {
    if (!startPoint || !currentPoint) return;

    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    switch (currentTool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        break;

      case 'rectangle':
        const width = currentPoint.x - startPoint.x;
        const height = currentPoint.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
        break;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - startPoint.x, 2) +
          Math.pow(currentPoint.y - startPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    ctx.setLineDash([]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPoint({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || currentTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const endPoint = { x, y };

    // 新しいエンティティを作成
    const newEntity: SketchEntity = {
      id: `entity-${Date.now()}`,
      type: currentTool as 'line' | 'rectangle' | 'circle',
      points: [startPoint, endPoint],
    };

    // 円の場合は半径を計算
    if (currentTool === 'circle') {
      newEntity.radius = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
      );
    }

    setEntities([...entities, newEntity]);
    addSketchEntity(newEntity);

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const getPlaneName = () => {
    switch (selectedPlane) {
      case 'front':
        return '正面 (Front Plane)';
      case 'top':
        return '上面 (Top Plane)';
      case 'right':
        return '右側面 (Right Plane)';
      default:
        return '';
    }
  };

  return (
    <div className="sketch-canvas-container">
      <SketchToolbar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        onExit={exitSketchMode}
        planeName={getPlaneName()}
      />

      <div className="sketch-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="sketch-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="sketch-info">
        <div className="info-row">
          <span className="info-label">平面:</span>
          <span className="info-value">{getPlaneName()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">ツール:</span>
          <span className="info-value">
            {currentTool === 'select' && '選択'}
            {currentTool === 'line' && '線分'}
            {currentTool === 'rectangle' && '矩形'}
            {currentTool === 'circle' && '円'}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">エンティティ数:</span>
          <span className="info-value">{entities.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SketchCanvas;
