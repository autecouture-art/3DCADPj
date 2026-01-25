import { create } from 'zustand';
import { ToolMode, CADObject, CADFile } from '../types';

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
  sketchEntities: any[];

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
  addSketchEntity: (entity: any) => void;
  clearSketch: () => void;
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
    sketchEntities: []
  }),

  exitSketchMode: () => set({
    isSketchMode: false,
    selectedPlane: null
  }),

  addSketchEntity: (entity) => set((state) => ({
    sketchEntities: [...state.sketchEntities, entity]
  })),

  clearSketch: () => set({ sketchEntities: [] })
}));
