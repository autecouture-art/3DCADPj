import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Point, SketchEntity, LineEntity, RectangleEntity, CircleEntity } from '../../types/sketch';
import SketchToolbar from './SketchToolbar';
import DimensionPanel from './DimensionPanel';
import GeometricConstraintPanel from './GeometricConstraintPanel';
import ExtrudeDialog from './ExtrudeDialog';
import './SketchCanvas.css';

type SketchTool = 'select' | 'line' | 'rectangle' | 'circle';

const SketchCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    selectedPlane,
    exitSketchMode,
    addSketchEntity,
    sketchEntities,
    dimensionConstraints,
    selectedEntityId,
    selectSketchEntity
  } = useAppStore();
  const [currentTool, setCurrentTool] = useState<SketchTool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [showExtrudeDialog, setShowExtrudeDialog] = useState(false);

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

    // 寸法を描画
    drawDimensions(ctx);

    // 現在の描画中のプレビューを表示
    if (isDrawing && startPoint && currentPoint) {
      drawPreview(ctx);
    }
  }, [sketchEntities, dimensionConstraints, selectedEntityId, isDrawing, startPoint, currentPoint, currentTool]);

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
    sketchEntities.forEach(entity => {
      const isSelected = entity.id === selectedEntityId;
      ctx.strokeStyle = isSelected ? '#FFC107' : '#4CAF50';
      ctx.lineWidth = isSelected ? 3 : 2;

      switch (entity.type) {
        case 'line': {
          const lineEntity = entity as LineEntity;
          ctx.beginPath();
          ctx.moveTo(lineEntity.start.x, lineEntity.start.y);
          ctx.lineTo(lineEntity.end.x, lineEntity.end.y);
          ctx.stroke();

          // 選択時は端点を表示
          if (isSelected) {
            drawPoint(ctx, lineEntity.start);
            drawPoint(ctx, lineEntity.end);
          }
          break;
        }

        case 'rectangle': {
          const rectEntity = entity as RectangleEntity;
          const width = rectEntity.end.x - rectEntity.start.x;
          const height = rectEntity.end.y - rectEntity.start.y;
          ctx.strokeRect(rectEntity.start.x, rectEntity.start.y, width, height);

          // 選択時は角点を表示
          if (isSelected) {
            drawPoint(ctx, rectEntity.start);
            drawPoint(ctx, rectEntity.end);
            drawPoint(ctx, { x: rectEntity.start.x, y: rectEntity.end.y });
            drawPoint(ctx, { x: rectEntity.end.x, y: rectEntity.start.y });
          }
          break;
        }

        case 'circle': {
          const circleEntity = entity as CircleEntity;
          ctx.beginPath();
          ctx.arc(circleEntity.center.x, circleEntity.center.y, circleEntity.radius, 0, Math.PI * 2);
          ctx.stroke();

          // 選択時は中心点を表示
          if (isSelected) {
            drawPoint(ctx, circleEntity.center);
          }
          break;
        }
      }
    });
  };

  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawDimensions = (ctx: CanvasRenderingContext2D) => {
    ctx.font = '14px monospace';
    ctx.fillStyle = '#2196F3';
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 1;

    dimensionConstraints.forEach(constraint => {
      const entity = sketchEntities.find(e => e.id === constraint.entityId);
      if (!entity) return;

      let displayText = `${constraint.label}: ${constraint.value.toFixed(2)}`;
      let textX = 0;
      let textY = 0;

      if (entity.type === 'line') {
        const lineEntity = entity as LineEntity;
        const midX = (lineEntity.start.x + lineEntity.end.x) / 2;
        const midY = (lineEntity.start.y + lineEntity.end.y) / 2;
        textX = midX + 10;
        textY = midY - 10;
      } else if (entity.type === 'circle') {
        const circleEntity = entity as CircleEntity;
        textX = circleEntity.center.x + circleEntity.radius + 10;
        textY = circleEntity.center.y - 10;
      } else if (entity.type === 'rectangle') {
        const rectEntity = entity as RectangleEntity;
        textX = rectEntity.start.x + 10;
        textY = rectEntity.start.y - 10;
      }

      // 寸法テキストの背景
      const metrics = ctx.measureText(displayText);
      const padding = 4;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        textX - padding,
        textY - 14 - padding,
        metrics.width + padding * 2,
        16 + padding * 2
      );

      // 寸法テキスト
      ctx.fillStyle = '#2196F3';
      ctx.fillText(displayText, textX, textY);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'select') {
      // エンティティ選択モード
      const clickedEntity = findEntityAtPoint({ x, y });
      selectSketchEntity(clickedEntity?.id || null);
      return;
    }

    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const findEntityAtPoint = (point: Point): SketchEntity | null => {
    const tolerance = 10;

    for (const entity of sketchEntities) {
      if (entity.type === 'line') {
        const lineEntity = entity as LineEntity;
        if (isPointNearLine(point, lineEntity.start, lineEntity.end, tolerance)) {
          return entity;
        }
      } else if (entity.type === 'circle') {
        const circleEntity = entity as CircleEntity;
        const distance = Math.sqrt(
          Math.pow(point.x - circleEntity.center.x, 2) +
          Math.pow(point.y - circleEntity.center.y, 2)
        );
        if (Math.abs(distance - circleEntity.radius) < tolerance) {
          return entity;
        }
      } else if (entity.type === 'rectangle') {
        const rectEntity = entity as RectangleEntity;
        const minX = Math.min(rectEntity.start.x, rectEntity.end.x);
        const maxX = Math.max(rectEntity.start.x, rectEntity.end.x);
        const minY = Math.min(rectEntity.start.y, rectEntity.end.y);
        const maxY = Math.max(rectEntity.start.y, rectEntity.end.y);

        // 矩形の4辺をチェック
        if (
          isPointNearLine(point, { x: minX, y: minY }, { x: maxX, y: minY }, tolerance) ||
          isPointNearLine(point, { x: maxX, y: minY }, { x: maxX, y: maxY }, tolerance) ||
          isPointNearLine(point, { x: maxX, y: maxY }, { x: minX, y: maxY }, tolerance) ||
          isPointNearLine(point, { x: minX, y: maxY }, { x: minX, y: minY }, tolerance)
        ) {
          return entity;
        }
      }
    }

    return null;
  };

  const isPointNearLine = (point: Point, lineStart: Point, lineEnd: Point, tolerance: number): boolean => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return false;

    const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)));
    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;
    const distance = Math.sqrt(Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2));

    return distance < tolerance;
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
    let newEntity: SketchEntity;

    if (currentTool === 'line') {
      newEntity = {
        id: `entity-${Date.now()}-${Math.random()}`,
        type: 'line',
        start: startPoint,
        end: endPoint,
        constraints: []
      } as LineEntity;
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
      );
      newEntity = {
        id: `entity-${Date.now()}-${Math.random()}`,
        type: 'circle',
        center: startPoint,
        radius,
        constraints: []
      } as CircleEntity;
    } else if (currentTool === 'rectangle') {
      newEntity = {
        id: `entity-${Date.now()}-${Math.random()}`,
        type: 'rectangle',
        start: startPoint,
        end: endPoint,
        constraints: []
      } as RectangleEntity;
    } else {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
      return;
    }

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
        onExtrude={() => setShowExtrudeDialog(true)}
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

      {/* 幾何拘束パネル */}
      <GeometricConstraintPanel />

      {/* 寸法パネル */}
      <DimensionPanel />

      {/* 押し出しダイアログ */}
      {showExtrudeDialog && (
        <ExtrudeDialog onClose={() => setShowExtrudeDialog(false)} />
      )}

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
          <span className="info-value">{sketchEntities.length}</span>
        </div>
        <div className="info-row">
          <span className="info-label">寸法数:</span>
          <span className="info-value">{dimensionConstraints.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SketchCanvas;
