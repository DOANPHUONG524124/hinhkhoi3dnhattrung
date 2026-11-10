export type ShapeType =
  | 'cube'                 // Hình lập phương
  | 'cuboid'               // Hình hộp chữ nhật
  | 'cylinder'             // Hình trụ
  | 'cone'                 // Hình nón
  | 'sphere'               // Hình cầu
  | 'triangular-prism'     // Hình lăng trụ tam giác
  | 'square-pyramid';      // Hình chóp tứ giác đều

export type AppMode =
  | 'observe'       // 1. Quan sát hình khối
  | 'structure'     // 2. Nhận biết Mặt - Cạnh - Đỉnh
  | 'dimensions'    // 3. Khám phá kích thước
  | 'formulas'      // 4. Khám phá công thức
  | 'challenge';    // 5. Thử thách Toán học

export interface ShapeDimensions {
  // For Cube: edge length (a)
  edge?: number;
  // For Cuboid: length (a), width (b), height (h)
  length?: number;
  width?: number;
  height?: number;
  // For Cylinder / Cone: radius (r), height (h)
  radius?: number;
  // For Triangular Prism: base triangle edge (a), base triangle height (h_d), prism height (h)
  baseEdge?: number;
  baseHeight?: number;
  // For Sphere: radius (r)
}

export interface ShapeCalculations {
  perimeterBottom?: {
    label: string;
    formula: string;
    steps: string;
    value: number;
    unit: string;
  };
  areaBottom?: {
    label: string;
    formula: string;
    steps: string;
    value: number;
    unit: string;
  };
  areaAround?: {
    label: string;
    formula: string;
    steps: string;
    value: number;
    unit: string;
  };
  areaTotal?: {
    label: string;
    formula: string;
    steps: string;
    value: number;
    unit: string;
  };
  volume: {
    label: string;
    formula: string;
    steps: string;
    value: number;
    unit: string;
  };
  extraNotes?: string[];
}

export interface ShapeStructureItem {
  id: string;
  name: string;
  type: 'face' | 'edge' | 'vertex';
  description: string;
  coordinates?: [number, number, number];
  color?: string;
  hidden?: boolean;
}

export interface ShapeMetadata {
  id: ShapeType;
  name: string;
  englishName: string;
  gradeLevel: string;
  realWorldExamples: string[];
  description: string;
  color: string;
  gradient: string;
  facesCount: number;
  edgesCount: number;
  verticesCount: number;
  facesDescription: string;
  edgesDescription: string;
  verticesDescription: string;
  defaultDimensions: ShapeDimensions;
  minDimensions: ShapeDimensions;
  maxDimensions: ShapeDimensions;
}

export interface QuizQuestion {
  id: string;
  shapeType: ShapeType;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
