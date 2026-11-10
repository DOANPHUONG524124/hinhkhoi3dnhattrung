import { ShapeType, ShapeDimensions, ShapeCalculations, ShapeMetadata, ShapeStructureItem } from '../types/geometry';

export const SHAPES_METADATA: Record<ShapeType, ShapeMetadata> = {
  cube: {
    id: 'cube',
    name: 'Hình Lập Phương',
    englishName: 'Cube',
    gradeLevel: 'Toán Lớp 5',
    realWorldExamples: ['Khối rubik', 'Con xúc xắc (xí ngầu)', 'Hộp quà vuông', 'Viên đá lạnh vuông'],
    description: 'Hình lập phương là hình khối không gian có 6 mặt đều là các hình vuông bằng nhau.',
    color: '#3B82F6', // Blue
    gradient: 'from-blue-500 to-indigo-600',
    facesCount: 6,
    edgesCount: 12,
    verticesCount: 8,
    facesDescription: 'Có 6 mặt là các hình vuông bằng nhau (2 mặt đáy và 4 mặt bên).',
    edgesDescription: 'Có 12 cạnh có độ dài bằng nhau.',
    verticesDescription: 'Có 8 đỉnh (mỗi đỉnh là giao điểm của 3 cạnh).',
    defaultDimensions: { edge: 5 },
    minDimensions: { edge: 2 },
    maxDimensions: { edge: 10 },
  },
  cuboid: {
    id: 'cuboid',
    name: 'Hình Hộp Chữ Nhật',
    englishName: 'Rectangular Prism',
    gradeLevel: 'Toán Lớp 5',
    realWorldExamples: ['Hộp sữa giấy', 'Bao diêm', 'Hộp phấn viết bảng', 'Tủ lạnh', 'Quyển sách dày'],
    description: 'Hình hộp chữ nhật có 6 mặt đều là hình chữ nhật, gồm 2 mặt đáy và 4 mặt bên.',
    color: '#10B981', // Emerald
    gradient: 'from-emerald-500 to-teal-600',
    facesCount: 6,
    edgesCount: 12,
    verticesCount: 8,
    facesDescription: 'Có 6 mặt hình chữ nhật (2 mặt đáy đối diện bằng nhau, 2 cặp mặt bên đối diện bằng nhau).',
    edgesDescription: 'Có 12 cạnh gồm 3 kích thước: chiều dài (4 cạnh), chiều rộng (4 cạnh), chiều cao (4 cạnh).',
    verticesDescription: 'Có 8 đỉnh (mỗi đỉnh là giao điểm của 3 cạnh vuông góc với nhau).',
    defaultDimensions: { length: 6, width: 4, height: 5 },
    minDimensions: { length: 2, width: 2, height: 2 },
    maxDimensions: { length: 12, width: 10, height: 10 },
  },
  cylinder: {
    id: 'cylinder',
    name: 'Hình Trụ',
    englishName: 'Cylinder',
    gradeLevel: 'Toán Lớp 5',
    realWorldExamples: ['Lon sữa đặc', 'Lon nước ngọt', 'Cột đình tròn', 'Ống cống', 'Cây nến tròn'],
    description: 'Hình trụ có 2 mặt đáy là hai hình tròn bằng nhau và một mặt xung quanh uốn cong mượt mà.',
    color: '#F59E0B', // Amber
    gradient: 'from-amber-500 to-orange-600',
    facesCount: 3,
    edgesCount: 2,
    verticesCount: 0,
    facesDescription: 'Có 3 mặt: 2 mặt đáy phẳng hình tròn bằng nhau và 1 mặt xung quanh cong tròn.',
    edgesDescription: 'Có 2 đường mép đáy cong tròn (đường tròn giới hạn hai đáy).',
    verticesDescription: 'Không có đỉnh nhọn nào (0 đỉnh).',
    defaultDimensions: { radius: 3, height: 6 },
    minDimensions: { radius: 1.5, height: 2 },
    maxDimensions: { radius: 6, height: 12 },
  },
  cone: {
    id: 'cone',
    name: 'Hình Nón',
    englishName: 'Cone',
    gradeLevel: 'Toán Lớp 5 & Làm quen',
    realWorldExamples: ['Nón lá Việt Nam', 'Ốc quế kem', 'Cọc tiêu giao thông hình nón', 'Mũ sinh nhật'],
    description: 'Hình nón có 1 mặt đáy hình tròn, 1 mặt xung quanh cong thu nhỏ dần về một đỉnh nhọn duy nhất.',
    color: '#EC4899', // Pink
    gradient: 'from-pink-500 to-rose-600',
    facesCount: 2,
    edgesCount: 1,
    verticesCount: 1,
    facesDescription: 'Có 2 mặt: 1 mặt đáy hình tròn phẳng và 1 mặt xung quanh uốn cong.',
    edgesDescription: 'Có 1 đường mép đáy cong tròn khép kín.',
    verticesDescription: 'Có 1 đỉnh nhọn duy nhất ở phía trên.',
    defaultDimensions: { radius: 3, height: 5 },
    minDimensions: { radius: 1.5, height: 2 },
    maxDimensions: { radius: 6, height: 10 },
  },
  sphere: {
    id: 'sphere',
    name: 'Hình Cầu',
    englishName: 'Sphere',
    gradeLevel: 'Toán Lớp 5 & Làm quen',
    realWorldExamples: ['Quả bóng đá', 'Quả địa cầu', 'Viên bi thủy tinh', 'Trái cam', 'Mặt trăng tròn'],
    description: 'Hình cầu là tập hợp tất cả các điểm trong không gian cách đều tâm một khoảng bằng bán kính R.',
    color: '#8B5CF6', // Purple
    gradient: 'from-purple-500 to-violet-700',
    facesCount: 1,
    edgesCount: 0,
    verticesCount: 0,
    facesDescription: 'Có 1 mặt cầu duy nhất khép kín, uốn cong hoàn hảo.',
    edgesDescription: 'Không có cạnh thẳng hay mép gấp khúc nào (0 cạnh).',
    verticesDescription: 'Hoàn toàn trơn nhẵn, không có đỉnh nhọn nào (0 đỉnh).',
    defaultDimensions: { radius: 4 },
    minDimensions: { radius: 2 },
    maxDimensions: { radius: 7 },
  },
  'triangular-prism': {
    id: 'triangular-prism',
    name: 'Hình Lăng Trụ Tam Giác',
    englishName: 'Triangular Prism',
    gradeLevel: 'Toán Nâng Cao & Trực Quan',
    realWorldExamples: ['Mái nhà ngói chữ A', 'Lều cắm trại tam giác', 'Thỏi sô-cô-la Toblerone', 'Lăng kính thủy tinh'],
    description: 'Hình lăng trụ tam giác có 2 mặt đáy đối diện là hình tam giác bằng nhau và 3 mặt bên là hình chữ nhật.',
    color: '#06B6D4', // Cyan
    gradient: 'from-cyan-500 to-blue-600',
    facesCount: 5,
    edgesCount: 9,
    verticesCount: 6,
    facesDescription: 'Có 5 mặt: 2 mặt đáy là hình tam giác bằng nhau và 3 mặt bên là hình chữ nhật.',
    edgesDescription: 'Có 9 cạnh (6 cạnh đáy và 3 cạnh bên song song bằng nhau).',
    verticesDescription: 'Có 6 đỉnh (3 đỉnh ở đáy trên và 3 đỉnh ở đáy dưới).',
    defaultDimensions: { baseEdge: 4, height: 6 },
    minDimensions: { baseEdge: 2, height: 2 },
    maxDimensions: { baseEdge: 8, height: 10 },
  },
  'square-pyramid': {
    id: 'square-pyramid',
    name: 'Hình Chóp Tứ Giác Đều',
    englishName: 'Square Pyramid',
    gradeLevel: 'Toán Nâng Cao & Trực Quan',
    realWorldExamples: ['Kim tự tháp Ai Cập', 'Mái che tháp chuông', 'Lều thổ dân', 'Đồ chơi rubik chóp'],
    description: 'Hình chóp tứ giác đều có mặt đáy là hình vuông và 4 mặt bên là các hình tam giác cân bằng nhau.',
    color: '#F97316', // Orange
    gradient: 'from-orange-500 to-amber-600',
    facesCount: 5,
    edgesCount: 8,
    verticesCount: 5,
    facesDescription: 'Có 5 mặt: 1 mặt đáy là hình vuông phẳng và 4 mặt bên là các hình tam giác cân chung 1 đỉnh.',
    edgesDescription: 'Có 8 cạnh (4 cạnh đáy bằng nhau và 4 cạnh bên bằng nhau).',
    verticesDescription: 'Có 5 đỉnh (4 đỉnh ở đáy vuông và 1 đỉnh chóp phía trên).',
    defaultDimensions: { baseEdge: 5, height: 6 },
    minDimensions: { baseEdge: 2, height: 2 },
    maxDimensions: { baseEdge: 8, height: 10 },
  },
};

export function calculateShapeProperties(shape: ShapeType, dim: ShapeDimensions): ShapeCalculations {
  switch (shape) {
    case 'cube': {
      const a = Number(dim.edge) || 5;
      const pBottom = a * 4;
      const sBottom = a * a;
      const sAround = a * a * 4;
      const sTotal = a * a * 6;
      const vol = a * a * a;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy',
          formula: 'P = a × 4',
          steps: `${a} × 4 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích 1 mặt đáy',
          formula: 'S = a × a',
          steps: `${a} × ${a} = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh (4 mặt bên)',
          formula: 'Sxq = a × a × 4',
          steps: `${a} × ${a} × 4 = ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần (cả 6 mặt)',
          formula: 'Stp = a × a × 6',
          steps: `${a} × ${a} × 6 = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích hình lập phương',
          formula: 'V = a × a × a',
          steps: `${a} × ${a} × ${a} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Hình lập phương là trường hợp đặc biệt của hình hộp chữ nhật khi chiều dài = chiều rộng = chiều cao.',
          'Cả 6 mặt đều là hình vuông có diện tích hoàn toàn bằng nhau.',
        ],
      };
    }

    case 'cuboid': {
      const a = Number(dim.length) || 6;
      const b = Number(dim.width) || 4;
      const h = Number(dim.height) || 5;

      const pBottom = (a + b) * 2;
      const sBottom = a * b;
      const sAround = pBottom * h;
      const sTotal = sAround + sBottom * 2;
      const vol = a * b * h;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy',
          formula: 'P = (a + b) × 2',
          steps: `(${a} + ${b}) × 2 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích mặt đáy',
          formula: 'Sđ = a × b',
          steps: `${a} × ${b} = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh',
          formula: 'Sxq = (a + b) × 2 × h = Chu vi đáy × Chiều cao',
          steps: `(${a} + ${b}) × 2 × ${h} = ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần',
          formula: 'Stp = Sxq + (Sđ × 2)',
          steps: `${sAround} + (${sBottom} × 2) = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích hình hộp chữ nhật',
          formula: 'V = a × b × h = Sđ × h',
          steps: `${a} × ${b} × ${h} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Diện tích xung quanh là tổng diện tích của 4 mặt bên.',
          'Diện tích toàn phần bằng diện tích xung quanh cộng với diện tích của 2 mặt đáy.',
        ],
      };
    }

    case 'cylinder': {
      const r = Number(dim.radius) || 3;
      const h = Number(dim.height) || 6;
      const pi = 3.14;

      const pBottom = Math.round(2 * pi * r * 100) / 100;
      const sBottom = Math.round(pi * r * r * 100) / 100;
      const sAround = Math.round(2 * pi * r * h * 100) / 100;
      const sTotal = Math.round((sAround + 2 * sBottom) * 100) / 100;
      const vol = Math.round(sBottom * h * 100) / 100;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy (đường tròn)',
          formula: 'C = r × 2 × 3,14',
          steps: `${r} × 2 × 3,14 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích 1 mặt đáy',
          formula: 'Sđ = r × r × 3,14',
          steps: `${r} × ${r} × 3,14 = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh',
          formula: 'Sxq = r × 2 × 3,14 × h = Chu vi đáy × h',
          steps: `${pBottom} × ${h} = ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần',
          formula: 'Stp = Sxq + (Sđ × 2)',
          steps: `${sAround} + (${sBottom} × 2) = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích hình trụ',
          formula: 'V = r × r × 3,14 × h = Sđ × h',
          steps: `${sBottom} × ${h} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Khi trải phẳng mặt xung quanh hình trụ, ta được một hình chữ nhật có chiều dài bằng chu vi đáy và chiều rộng bằng chiều cao.',
        ],
      };
    }

    case 'cone': {
      const r = Number(dim.radius) || 3;
      const h = Number(dim.height) || 5;
      const pi = 3.14;
      // Slant height l = sqrt(r^2 + h^2)
      const l = Math.round(Math.sqrt(r * r + h * h) * 100) / 100;

      const pBottom = Math.round(2 * pi * r * 100) / 100;
      const sBottom = Math.round(pi * r * r * 100) / 100;
      const sAround = Math.round(pi * r * l * 100) / 100;
      const sTotal = Math.round((sAround + sBottom) * 100) / 100;
      const vol = Math.round(((1 / 3) * sBottom * h) * 100) / 100;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy',
          formula: 'C = r × 2 × 3,14',
          steps: `${r} × 2 × 3,14 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích đáy',
          formula: 'Sđ = r × r × 3,14',
          steps: `${r} × ${r} × 3,14 = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh',
          formula: 'Sxq = 3,14 × r × l (với l là đường sinh ≈ ' + l + ' cm)',
          steps: `3,14 × ${r} × ${l} ≈ ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần',
          formula: 'Stp = Sxq + Sđ',
          steps: `${sAround} + ${sBottom} = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích hình nón',
          formula: 'V = (1/3) × Sđ × h = (1/3) × r × r × 3,14 × h',
          steps: `(1/3) × ${sBottom} × ${h} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Thể tích hình nón bằng 1/3 thể tích hình trụ có cùng bán kính đáy và chiều cao.',
        ],
      };
    }

    case 'sphere': {
      const r = Number(dim.radius) || 4;
      const pi = 3.14;

      const pGreatCircle = Math.round(2 * pi * r * 100) / 100;
      const sSphere = Math.round(4 * pi * r * r * 100) / 100;
      const vol = Math.round(((4 / 3) * pi * r * r * r) * 100) / 100;

      return {
        perimeterBottom: {
          label: 'Chu vi đường tròn lớn (xích đạo)',
          formula: 'C = 2 × 3,14 × r',
          steps: `2 × 3,14 × ${r} = ${pGreatCircle}`,
          value: pGreatCircle,
          unit: 'cm',
        },
        areaTotal: {
          label: 'Diện tích mặt cầu',
          formula: 'S = 4 × 3,14 × r × r = 4 × S hình tròn lớn',
          steps: `4 × 3,14 × ${r} × ${r} = ${sSphere}`,
          value: sSphere,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích khối cầu',
          formula: 'V = (4/3) × 3,14 × r × r × r',
          steps: `(4/3) × 3,14 × ${r}³ = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Hình cầu có tính đối xứng hoàn hảo tuyệt đối: nhìn từ mọi hướng đều là một hình tròn.',
          'Mặt cầu không có góc cạnh hay đỉnh nào.',
        ],
      };
    }

    case 'triangular-prism': {
      const a = Number(dim.baseEdge) || 4;
      const h = Number(dim.height) || 6;
      // Equilateral triangle base: height = a * sqrt(3) / 2
      const baseH = Math.round(((a * Math.sqrt(3)) / 2) * 100) / 100;
      const pBottom = a * 3;
      const sBottom = Math.round((0.5 * a * baseH) * 100) / 100;
      const sAround = pBottom * h;
      const sTotal = Math.round((sAround + 2 * sBottom) * 100) / 100;
      const vol = Math.round((sBottom * h) * 100) / 100;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy tam giác đều',
          formula: 'P = a × 3',
          steps: `${a} × 3 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích 1 đáy tam giác',
          formula: 'Sđ = (1/2) × a × h_đáy',
          steps: `(1/2) × ${a} × ${baseH} = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh (3 mặt bên chữ nhật)',
          formula: 'Sxq = (a × 3) × h = Chu vi đáy × h',
          steps: `${pBottom} × ${h} = ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần',
          formula: 'Stp = Sxq + (Sđ × 2)',
          steps: `${sAround} + (${sBottom} × 2) = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích lăng trụ tam giác',
          formula: 'V = Sđ × h',
          steps: `${sBottom} × ${h} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Lăng trụ tam giác có 2 mặt đáy tam giác song song và 3 mặt bên hình chữ nhật.',
        ],
      };
    }

    case 'square-pyramid': {
      const a = Number(dim.baseEdge) || 5;
      const h = Number(dim.height) || 6;
      // Slant height of face triangle d = sqrt(h^2 + (a/2)^2)
      const slantFace = Math.round(Math.sqrt(h * h + Math.pow(a / 2, 2)) * 100) / 100;
      const pBottom = a * 4;
      const sBottom = a * a;
      // 4 side triangles each area = 0.5 * a * slantFace
      const sAround = Math.round((4 * (0.5 * a * slantFace)) * 100) / 100;
      const sTotal = Math.round((sAround + sBottom) * 100) / 100;
      const vol = Math.round(((1 / 3) * sBottom * h) * 100) / 100;

      return {
        perimeterBottom: {
          label: 'Chu vi đáy hình vuông',
          formula: 'P = a × 4',
          steps: `${a} × 4 = ${pBottom}`,
          value: pBottom,
          unit: 'cm',
        },
        areaBottom: {
          label: 'Diện tích đáy hình vuông',
          formula: 'Sđ = a × a',
          steps: `${a} × ${a} = ${sBottom}`,
          value: sBottom,
          unit: 'cm²',
        },
        areaAround: {
          label: 'Diện tích xung quanh (4 mặt tam giác bên)',
          formula: 'Sxq = 4 × (1/2 × a × d) với d là trung đoạn ≈ ' + slantFace + ' cm',
          steps: `4 × (1/2 × ${a} × ${slantFace}) = ${sAround}`,
          value: sAround,
          unit: 'cm²',
        },
        areaTotal: {
          label: 'Diện tích toàn phần',
          formula: 'Stp = Sxq + Sđ',
          steps: `${sAround} + ${sBottom} = ${sTotal}`,
          value: sTotal,
          unit: 'cm²',
        },
        volume: {
          label: 'Thể tích hình chóp tứ giác',
          formula: 'V = (1/3) × Sđ × h',
          steps: `(1/3) × ${sBottom} × ${h} = ${vol}`,
          value: vol,
          unit: 'cm³',
        },
        extraNotes: [
          'Hình chóp tứ giác đều mô phỏng hình dạng các Kim tự tháp Ai Cập cổ đại hùng vĩ.',
          'Thể tích hình chóp chỉ bằng 1/3 thể tích hình hộp có cùng diện tích đáy và chiều cao.',
        ],
      };
    }
  }
}

// Generate structure parts (faces, edges, vertices) for each shape for interaction
export function getShapeStructure(shape: ShapeType): {
  faces: ShapeStructureItem[];
  edges: ShapeStructureItem[];
  vertices: ShapeStructureItem[];
} {
  switch (shape) {
    case 'cube':
    case 'cuboid': {
      const isCube = shape === 'cube';
      return {
        faces: [
          { id: 'face-top', name: 'Mặt đáy trên', type: 'face', description: isCube ? 'Hình vuông phía trên' : 'Hình chữ nhật đáy trên' },
          { id: 'face-bottom', name: 'Mặt đáy dưới', type: 'face', description: isCube ? 'Hình vuông phía dưới' : 'Hình chữ nhật đáy dưới' },
          { id: 'face-front', name: 'Mặt bên trước', type: 'face', description: 'Mặt nhìn thẳng từ phía trước' },
          { id: 'face-back', name: 'Mặt bên sau', type: 'face', description: 'Mặt đối diện mặt trước' },
          { id: 'face-left', name: 'Mặt bên trái', type: 'face', description: 'Mặt nhìn từ cạnh bên trái' },
          { id: 'face-right', name: 'Mặt bên phải', type: 'face', description: 'Mặt nhìn từ cạnh bên phải' },
        ],
        edges: [
          { id: 'edge-top-1', name: 'Cạnh đáy trên (trước)', type: 'edge', description: 'Nối đỉnh A và B' },
          { id: 'edge-top-2', name: 'Cạnh đáy trên (sau)', type: 'edge', description: 'Nối đỉnh C và D' },
          { id: 'edge-top-3', name: 'Cạnh đáy trên (trái)', type: 'edge', description: 'Nối đỉnh A và D' },
          { id: 'edge-top-4', name: 'Cạnh đáy trên (phải)', type: 'edge', description: 'Nối đỉnh B và C' },
          { id: 'edge-bot-1', name: 'Cạnh đáy dưới (trước)', type: 'edge', description: "Nối đỉnh A' và B'" },
          { id: 'edge-bot-2', name: 'Cạnh đáy dưới (sau)', type: 'edge', description: "Nối đỉnh C' và D'" },
          { id: 'edge-bot-3', name: 'Cạnh đáy dưới (trái)', type: 'edge', description: "Nối đỉnh A' và D'" },
          { id: 'edge-bot-4', name: 'Cạnh đáy dưới (phải)', type: 'edge', description: "Nối đỉnh B' và C'" },
          { id: 'edge-side-1', name: 'Cạnh bên đứng (trước trái)', type: 'edge', description: "Nối đỉnh A và A'" },
          { id: 'edge-side-2', name: 'Cạnh bên đứng (trước phải)', type: 'edge', description: "Nối đỉnh B và B'" },
          { id: 'edge-side-3', name: 'Cạnh bên đứng (sau phải)', type: 'edge', description: "Nối đỉnh C và C'" },
          { id: 'edge-side-4', name: 'Cạnh bên đứng (sau trái)', type: 'edge', description: "Nối đỉnh D và D'" },
        ],
        vertices: [
          { id: 'v-A', name: 'Đỉnh A', type: 'vertex', description: 'Đỉnh góc trước-trái đáy trên' },
          { id: 'v-B', name: 'Đỉnh B', type: 'vertex', description: 'Đỉnh góc trước-phải đáy trên' },
          { id: 'v-C', name: 'Đỉnh C', type: 'vertex', description: 'Đỉnh góc sau-phải đáy trên' },
          { id: 'v-D', name: 'Đỉnh D', type: 'vertex', description: 'Đỉnh góc sau-trái đáy trên' },
          { id: 'v-A1', name: "Đỉnh A'", type: 'vertex', description: 'Đỉnh góc trước-trái đáy dưới' },
          { id: 'v-B1', name: "Đỉnh B'", type: 'vertex', description: 'Đỉnh góc trước-phải đáy dưới' },
          { id: 'v-C1', name: "Đỉnh C'", type: 'vertex', description: 'Đỉnh góc sau-phải đáy dưới' },
          { id: 'v-D1', name: "Đỉnh D'", type: 'vertex', description: 'Đỉnh góc sau-trái đáy dưới' },
        ],
      };
    }

    case 'cylinder': {
      return {
        faces: [
          { id: 'face-top', name: 'Mặt đáy trên', type: 'face', description: 'Hình tròn phẳng phía trên' },
          { id: 'face-bottom', name: 'Mặt đáy dưới', type: 'face', description: 'Hình tròn phẳng phía dưới' },
          { id: 'face-around', name: 'Mặt xung quanh', type: 'face', description: 'Mặt cong trơn nối 2 đường tròn đáy' },
        ],
        edges: [
          { id: 'edge-circle-top', name: 'Đường mép đáy trên', type: 'edge', description: 'Đường tròn bao quanh đáy trên' },
          { id: 'edge-circle-bot', name: 'Đường mép đáy dưới', type: 'edge', description: 'Đường tròn bao quanh đáy dưới' },
        ],
        vertices: [],
      };
    }

    case 'cone': {
      return {
        faces: [
          { id: 'face-bottom', name: 'Mặt đáy tròn', type: 'face', description: 'Hình tròn phẳng dưới đáy' },
          { id: 'face-around', name: 'Mặt xung quanh', type: 'face', description: 'Mặt nón cong thu về đỉnh S' },
        ],
        edges: [
          { id: 'edge-circle-bot', name: 'Đường viền đáy tròn', type: 'edge', description: 'Đường tròn giới hạn mặt đáy' },
        ],
        vertices: [
          { id: 'v-S', name: 'Đỉnh nón S', type: 'vertex', description: 'Đỉnh nhọn duy nhất trên đỉnh nón' },
        ],
      };
    }

    case 'sphere': {
      return {
        faces: [
          { id: 'face-sphere', name: 'Mặt cầu tròn', type: 'face', description: 'Mặt cong khép kín hoàn hảo bao quanh khối cầu' },
        ],
        edges: [],
        vertices: [],
      };
    }

    case 'triangular-prism': {
      return {
        faces: [
          { id: 'face-top', name: 'Mặt đáy tam giác trên', type: 'face', description: 'Tam giác đều phía trên (ABC)' },
          { id: 'face-bottom', name: 'Mặt đáy tam giác dưới', type: 'face', description: "Tam giác đều phía dưới (A'B'C')" },
          { id: 'face-side-1', name: 'Mặt bên 1 (ABB’A’)', type: 'face', description: 'Mặt chữ nhật phía trước' },
          { id: 'face-side-2', name: 'Mặt bên 2 (BCC’B’)', type: 'face', description: 'Mặt chữ nhật phía phải' },
          { id: 'face-side-3', name: 'Mặt bên 3 (CAA’C’)', type: 'face', description: 'Mặt chữ nhật phía trái' },
        ],
        edges: [
          { id: 'edge-t1', name: 'Cạnh đáy trên AB', type: 'edge', description: 'Cạnh tam giác trên' },
          { id: 'edge-t2', name: 'Cạnh đáy trên BC', type: 'edge', description: 'Cạnh tam giác trên' },
          { id: 'edge-t3', name: 'Cạnh đáy trên CA', type: 'edge', description: 'Cạnh tam giác trên' },
          { id: 'edge-b1', name: "Cạnh đáy dưới A'B'", type: 'edge', description: 'Cạnh tam giác dưới' },
          { id: 'edge-b2', name: "Cạnh đáy dưới B'C'", type: 'edge', description: 'Cạnh tam giác dưới' },
          { id: 'edge-b3', name: "Cạnh đáy dưới C'A'", type: 'edge', description: 'Cạnh tam giác dưới' },
          { id: 'edge-s1', name: "Cạnh bên đứng AA'", type: 'edge', description: 'Cạnh bên dọc song song' },
          { id: 'edge-s2', name: "Cạnh bên đứng BB'", type: 'edge', description: 'Cạnh bên dọc song song' },
          { id: 'edge-s3', name: "Cạnh bên đứng CC'", type: 'edge', description: 'Cạnh bên dọc song song' },
        ],
        vertices: [
          { id: 'v-A', name: 'Đỉnh A', type: 'vertex', description: 'Đỉnh đáy trên' },
          { id: 'v-B', name: 'Đỉnh B', type: 'vertex', description: 'Đỉnh đáy trên' },
          { id: 'v-C', name: 'Đỉnh C', type: 'vertex', description: 'Đỉnh đáy trên' },
          { id: 'v-A1', name: "Đỉnh A'", type: 'vertex', description: 'Đỉnh đáy dưới' },
          { id: 'v-B1', name: "Đỉnh B'", type: 'vertex', description: 'Đỉnh đáy dưới' },
          { id: 'v-C1', name: "Đỉnh C'", type: 'vertex', description: 'Đỉnh đáy dưới' },
        ],
      };
    }

    case 'square-pyramid': {
      return {
        faces: [
          { id: 'face-bottom', name: 'Mặt đáy vuông (ABCD)', type: 'face', description: 'Mặt hình vuông ở đáy' },
          { id: 'face-side-1', name: 'Mặt bên tam giác SAB', type: 'face', description: 'Mặt tam giác cân phía trước' },
          { id: 'face-side-2', name: 'Mặt bên tam giác SBC', type: 'face', description: 'Mặt tam giác cân phía phải' },
          { id: 'face-side-3', name: 'Mặt bên tam giác SCD', type: 'face', description: 'Mặt tam giác cân phía sau' },
          { id: 'face-side-4', name: 'Mặt bên tam giác SDA', type: 'face', description: 'Mặt tam giác cân phía trái' },
        ],
        edges: [
          { id: 'edge-b1', name: 'Cạnh đáy AB', type: 'edge', description: 'Cạnh đáy trước' },
          { id: 'edge-b2', name: 'Cạnh đáy BC', type: 'edge', description: 'Cạnh đáy phải' },
          { id: 'edge-b3', name: 'Cạnh đáy CD', type: 'edge', description: 'Cạnh đáy sau' },
          { id: 'edge-b4', name: 'Cạnh đáy DA', type: 'edge', description: 'Cạnh đáy trái' },
          { id: 'edge-s1', name: 'Cạnh bên SA', type: 'edge', description: 'Nối đỉnh chóp S với đỉnh đáy A' },
          { id: 'edge-s2', name: 'Cạnh bên SB', type: 'edge', description: 'Nối đỉnh chóp S với đỉnh đáy B' },
          { id: 'edge-s3', name: 'Cạnh bên SC', type: 'edge', description: 'Nối đỉnh chóp S với đỉnh đáy C' },
          { id: 'edge-s4', name: 'Cạnh bên SD', type: 'edge', description: 'Nối đỉnh chóp S với đỉnh đáy D' },
        ],
        vertices: [
          { id: 'v-S', name: 'Đỉnh chóp S', type: 'vertex', description: 'Đỉnh nhọn cao nhất của hình chóp' },
          { id: 'v-A', name: 'Đỉnh đáy A', type: 'vertex', description: 'Đỉnh góc trước-trái đáy vuông' },
          { id: 'v-B', name: 'Đỉnh đáy B', type: 'vertex', description: 'Đỉnh góc trước-phải đáy vuông' },
          { id: 'v-C', name: 'Đỉnh đáy C', type: 'vertex', description: 'Đỉnh góc sau-phải đáy vuông' },
          { id: 'v-D', name: 'Đỉnh đáy D', type: 'vertex', description: 'Đỉnh góc sau-trái đáy vuông' },
        ],
      };
    }
  }
}
