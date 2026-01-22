import { create } from 'zustand';
import { ToolMode, CADObject, CADFile } from '../types';

interface AppState {
  mode: ToolMode;
  objects: CADObject[];
  selectedObjectId: string | null;
  loadedFile: CADFile | null;
  gridVisible: boolean;
  axesVisible: boolean;

  setMode: (mode: ToolMode) => void;
  addObject: (object: CADObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<CADObject>) => void;
  selectObject: (id: string | null) => void;
  setLoadedFile: (file: CADFile | null) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  clearScene: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'viewer',
  objects: [],
  selectedObjectId: null,
  loadedFile: null,
  gridVisible: true,
  axesVisible: true,

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

  clearScene: () => set({ objects: [], selectedObjectId: null })
}));
