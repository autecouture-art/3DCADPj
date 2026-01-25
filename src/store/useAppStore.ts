import { create } from 'zustand';
import { ToolMode, CADObject, CADFile } from '../types';
import { SketchEntity, DimensionConstraint, GeometricConstraint } from '../types/sketch';

type PlaneType = 'front' | 'top' | 'right' | null;

interface AppState {
  mode: ToolMode;
  objects: CADObject[];
  selectedObjectId: string | null;
  loadedFile: CADFile | null;
  gridVisible: boolean;
  axesVisible: boolean;

  // SOLIDWORKSライクなスケッチモード
  isSketchMode: boolean;
  selectedPlane: PlaneType;
  sketchEntities: SketchEntity[];
  dimensionConstraints: DimensionConstraint[];
  geometricConstraints: GeometricConstraint[];
  selectedEntityId: string | null;

  setMode: (mode: ToolMode) => void;
  addObject: (object: CADObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<CADObject>) => void;
  selectObject: (id: string | null) => void;
  setLoadedFile: (file: CADFile | null) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  clearScene: () => void;

  // スケッチモード関連
  enterSketchMode: (plane: PlaneType) => void;
  exitSketchMode: () => void;
  addSketchEntity: (entity: SketchEntity) => void;
  updateSketchEntity: (id: string, updates: Partial<SketchEntity>) => void;
  selectSketchEntity: (id: string | null) => void;
  clearSketch: () => void;

  // 寸法拘束関連
  addDimensionConstraint: (constraint: DimensionConstraint) => void;
  updateDimensionConstraint: (id: string, value: number) => void;
  removeDimensionConstraint: (id: string) => void;

  // 幾何拘束関連
  addGeometricConstraint: (constraint: GeometricConstraint) => void;
  removeGeometricConstraint: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'viewer',
  objects: [],
  selectedObjectId: null,
  loadedFile: null,
  gridVisible: true,
  axesVisible: true,

  // スケッチモード初期状態
  isSketchMode: false,
  selectedPlane: null,
  sketchEntities: [],
  dimensionConstraints: [],
  geometricConstraints: [],
  selectedEntityId: null,

  setMode: (mode) => set({ mode }),

  addObject: (object) => set((state) => ({
    objects: [...state.objects, object]
  })),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter(obj => obj.id !== id),
    selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
  })),

  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    )
  })),

  selectObject: (id) => set({ selectedObjectId: id }),

  setLoadedFile: (file) => set({ loadedFile: file }),

  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),

  toggleAxes: () => set((state) => ({ axesVisible: !state.axesVisible })),

  clearScene: () => set({ objects: [], selectedObjectId: null }),

  // スケッチモード関連
  enterSketchMode: (plane) => set({
    isSketchMode: true,
    selectedPlane: plane,
    sketchEntities: [],
    dimensionConstraints: [],
    geometricConstraints: [],
    selectedEntityId: null
  }),

  exitSketchMode: () => set({
    isSketchMode: false,
    selectedPlane: null,
    selectedEntityId: null
  }),

  addSketchEntity: (entity) => set((state) => ({
    sketchEntities: [...state.sketchEntities, entity]
  })),

  updateSketchEntity: (id, updates) => set((state) => ({
    sketchEntities: state.sketchEntities.map(entity =>
      entity.id === id ? { ...entity, ...updates } as SketchEntity : entity
    )
  })),

  selectSketchEntity: (id) => set({ selectedEntityId: id }),

  clearSketch: () => set({
    sketchEntities: [],
    dimensionConstraints: [],
    geometricConstraints: [],
    selectedEntityId: null
  }),

  // 寸法拘束関連
  addDimensionConstraint: (constraint) => set((state) => ({
    dimensionConstraints: [...state.dimensionConstraints, constraint]
  })),

  updateDimensionConstraint: (id, value) => set((state) => {
    const updatedConstraints = state.dimensionConstraints.map(constraint =>
      constraint.id === id ? { ...constraint, value } : constraint
    );

    // 寸法値が変更されたら、関連するエンティティを更新
    const constraint = state.dimensionConstraints.find(c => c.id === id);
    if (!constraint) return { dimensionConstraints: updatedConstraints };

    const updatedEntities = state.sketchEntities.map(entity => {
      if (entity.id !== constraint.entityId) return entity;

      // エンティティの種類に応じて更新
      if (constraint.type === 'length' && entity.type === 'line') {
        const dx = entity.end.x - entity.start.x;
        const dy = entity.end.y - entity.start.y;
        const currentLength = Math.sqrt(dx * dx + dy * dy);
        const scale = value / currentLength;
        return {
          ...entity,
          end: {
            x: entity.start.x + dx * scale,
            y: entity.start.y + dy * scale
          }
        };
      }

      if ((constraint.type === 'radius' || constraint.type === 'diameter') && entity.type === 'circle') {
        const radius = constraint.type === 'diameter' ? value / 2 : value;
        return { ...entity, radius };
      }

      return entity;
    });

    return {
      dimensionConstraints: updatedConstraints,
      sketchEntities: updatedEntities as SketchEntity[]
    };
  }),

  removeDimensionConstraint: (id) => set((state) => ({
    dimensionConstraints: state.dimensionConstraints.filter(c => c.id !== id)
  })),

  // 幾何拘束関連
  addGeometricConstraint: (constraint) => set((state) => ({
    geometricConstraints: [...state.geometricConstraints, constraint]
  })),

  removeGeometricConstraint: (id) => set((state) => ({
    geometricConstraints: state.geometricConstraints.filter(c => c.id !== id)
  }))
}));
