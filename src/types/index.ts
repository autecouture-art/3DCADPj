export type ToolMode = 'viewer' | 'modeler' | 'converter' | 'tools';

export interface CADFile {
  name: string;
  type: string;
  data: ArrayBuffer | string;
  url?: string;
}

export interface GeometryData {
  vertices: number[];
  indices: number[];
  normals?: number[];
  uvs?: number[];
}

export interface ModelingTool {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

export interface ConversionFormat {
  from: string;
  to: string;
  converter: (data: ArrayBuffer) => Promise<ArrayBuffer | string>;
}

export interface CADObject {
  id: string;
  name: string;
  type: 'mesh' | 'line' | 'point' | 'surface';
  geometry: GeometryData;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
  color: string;
}
