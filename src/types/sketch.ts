// スケッチエンティティの型定義

export type SketchEntityType = 'line' | 'rectangle' | 'circle';

export interface Point {
  x: number;
  y: number;
}

export interface LineEntity {
  id: string;
  type: 'line';
  start: Point;
  end: Point;
  constraints: string[]; // 関連する拘束のID
}

export interface RectangleEntity {
  id: string;
  type: 'rectangle';
  start: Point;
  end: Point;
  constraints: string[]; // 関連する拘束のID
}

export interface CircleEntity {
  id: string;
  type: 'circle';
  center: Point;
  radius: number;
  constraints: string[]; // 関連する拘束のID
}

export type SketchEntity = LineEntity | RectangleEntity | CircleEntity;

// 寸法拘束の型定義
export type DimensionType = 'length' | 'radius' | 'diameter' | 'angle' | 'distance';

export interface DimensionConstraint {
  id: string;
  type: DimensionType;
  entityId: string; // 関連するエンティティのID
  value: number; // 寸法値
  label: string; // 表示用ラベル（例: "L1", "R1"）
  position?: Point; // 寸法線の表示位置
}

// 幾何拘束の型定義
export type GeometricConstraintType =
  | 'horizontal'
  | 'vertical'
  | 'parallel'
  | 'perpendicular'
  | 'coincident'
  | 'concentric'
  | 'tangent';

export interface GeometricConstraint {
  id: string;
  type: GeometricConstraintType;
  entityIds: string[]; // 関連するエンティティのID（1つまたは2つ）
}

export type SketchConstraint = DimensionConstraint | GeometricConstraint;
