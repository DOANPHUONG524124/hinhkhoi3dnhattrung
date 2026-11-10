import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ShapeType, ShapeDimensions } from '../types/geometry';
import { sound } from '../utils/audio';
import { 
  RotateCw, 
  Eye, 
  Maximize, 
  Minimize, 
  Layers, 
  Box, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  Compass
} from 'lucide-react';

interface ThreeViewportProps {
  shapeType: ShapeType;
  dimensions: ShapeDimensions;
  showFaces: boolean;
  showEdges: boolean;
  showVertices: boolean;
  showDimensions: boolean;
  hiddenFaceIds: string[];
  selectedItem: { id: string; type: 'face' | 'edge' | 'vertex' } | null;
  onSelectItem: (item: { id: string; name: string; type: 'face' | 'edge' | 'vertex'; description: string } | null) => void;
  renderStyle: 'solid' | 'wireframe' | 'xray' | 'exploded';
  explodedOffset?: number; // 0 to 1
  isTeacherMode?: boolean;
}

export const ThreeViewport: React.FC<ThreeViewportProps> = ({
  shapeType,
  dimensions,
  showFaces,
  showEdges,
  showVertices,
  showDimensions,
  hiddenFaceIds,
  selectedItem,
  onSelectItem,
  renderStyle,
  explodedOffset = 0,
  isTeacherMode = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // References to keep Three.js scene instances across React renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shapeGroupRef = useRef<THREE.Group | null>(null);
  const dimensionGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Setup Three.js scene once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    // Detect software WebGL as per skill directives
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1128); // Deep rich cosmic navy
    scene.fog = new THREE.FogExp2(0x0a1128, 0.025);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(9, 7, 11);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Environment map reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lights
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 8;
    dirLight.shadow.camera.bottom = -8;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-10, 8, -8);
    scene.add(fillLight);

    // Subtle Ground Grid & Contact Shadow
    const gridHelper = new THREE.GridHelper(24, 24, 0x334155, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Contact shadow circular plane
    const shadowGeo = new THREE.PlaneGeometry(14, 14);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x030712,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 3;
    controls.target.set(0, 2, 0);
    controls.update();
    controlsRef.current = controls;

    // Shape Group
    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);
    shapeGroupRef.current = shapeGroup;

    // Dimension Annotations Group
    const dimGroup = new THREE.Group();
    scene.add(dimGroup);
    dimensionGroupRef.current = dimGroup;

    // Animation Loop
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;
      controls.update();
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update controls autoRotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
      controlsRef.current.autoRotateSpeed = 2.0;
    }
  }, [isAutoRotating]);

  // Re-build 3D shape whenever shapeType, dimensions, styles, or visibility changes
  useEffect(() => {
    const group = shapeGroupRef.current;
    const dimGroup = dimensionGroupRef.current;
    if (!group || !dimGroup) return;

    // Clean up previous geometries/materials in groups
    while (group.children.length > 0) {
      const obj = group.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose());
      } else if (obj.material) {
        obj.material.dispose();
      }
      group.remove(obj);
    }

    while (dimGroup.children.length > 0) {
      const obj = dimGroup.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material && !Array.isArray(obj.material)) obj.material.dispose();
      dimGroup.remove(obj);
    }

    // Palette for distinct geometric surfaces
    const colors = {
      primary: 0x3b82f6,      // Vivid royal blue
      secondary: 0x06b6d4,    // Cyan
      accent: 0xf59e0b,       // Amber / Gold
      highlight: 0xf43f5e,    // Rose highlight when selected
      edgeNormal: 0xffffff,   // Bright crisp edge
      edgeSelected: 0xfacc15, // Bright yellow for selected edge
      vertexNormal: 0xfbbf24, // Amber-gold vertex sphere
      vertexSelected: 0xec4899, // Magenta selected vertex
      topBottom: 0x10b981,    // Emerald base
    };

    const isWireframe = renderStyle === 'wireframe';
    const isXray = renderStyle === 'xray';
    const isExploded = renderStyle === 'exploded';
    const explodeDist = isExploded ? 0.8 + explodedOffset * 1.5 : 0;

    // Material helper
    const createFaceMaterial = (faceId: string, defaultColor: number) => {
      const isSelected = selectedItem?.id === faceId;
      const isHidden = hiddenFaceIds.includes(faceId);

      if (isHidden) {
        return new THREE.MeshBasicMaterial({ visible: false });
      }

      const matColor = isSelected ? colors.highlight : defaultColor;
      return new THREE.MeshStandardMaterial({
        color: matColor,
        roughness: 0.35,
        metalness: 0.15,
        wireframe: isWireframe,
        transparent: isXray,
        opacity: isXray ? 0.35 : 1.0,
        side: THREE.DoubleSide,
      });
    };

    // Edge material
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
      depthTest: true,
    });

    // Vertex sphere helper
    const addVertexSphere = (vId: string, name: string, pos: THREE.Vector3) => {
      if (!showVertices) return;
      const isSelected = selectedItem?.id === vId;
      const vGeo = new THREE.SphereGeometry(isSelected ? 0.18 : 0.12, 16, 16);
      const vMat = new THREE.MeshStandardMaterial({
        color: isSelected ? colors.vertexSelected : colors.vertexNormal,
        roughness: 0.2,
        metalness: 0.3,
        emissive: isSelected ? 0x831843 : 0x78350f,
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.copy(pos);
      vMesh.userData = { id: vId, name, type: 'vertex', description: `Tọa độ đỉnh: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})` };
      group.add(vMesh);
    };

    // Helper to add 3D line dimension with arrows
    const addDimensionLine = (p1: THREE.Vector3, p2: THREE.Vector3, labelText: string, offset: THREE.Vector3) => {
      if (!showDimensions) return;
      const start = p1.clone().add(offset);
      const end = p2.clone().add(offset);

      // Line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
      const line = new THREE.Line(lineGeo, lineMat);
      dimGroup.add(line);

      // Small end ticks
      const tickDir = new THREE.Vector3(0, 0.15, 0);
      const t1Geo = new THREE.BufferGeometry().setFromPoints([start.clone().sub(tickDir), start.clone().add(tickDir)]);
      const t2Geo = new THREE.BufferGeometry().setFromPoints([end.clone().sub(tickDir), end.clone().add(tickDir)]);
      dimGroup.add(new THREE.Line(t1Geo, lineMat));
      dimGroup.add(new THREE.Line(t2Geo, lineMat));

      // Label sprite
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.roundRect(10, 8, 236, 48, 8);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = 'bold 26px Quicksand, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 128, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.5, 0.38, 1);
      sprite.position.copy(start.clone().lerp(end, 0.5)).add(new THREE.Vector3(0, 0.25, 0));
      dimGroup.add(sprite);
    };

    // BUILD SPECIFIC 3D SHAPES
    switch (shapeType) {
      case 'cube':
      case 'cuboid': {
        const isCube = shapeType === 'cube';
        const a = isCube ? Number(dimensions.edge) || 5 : Number(dimensions.length) || 6;
        const b = isCube ? Number(dimensions.edge) || 5 : Number(dimensions.width) || 4;
        const h = isCube ? Number(dimensions.edge) || 5 : Number(dimensions.height) || 5;

        // Scale factors for pleasant viewing in viewport (normalizes max dimension to ~4.5)
        const maxD = Math.max(a, b, h, 6);
        const scale = 5.0 / maxD;
        const sA = a * scale;
        const sB = b * scale;
        const sH = h * scale;

        const halfA = sA / 2;
        const halfB = sB / 2;
        const halfH = sH / 2;
        const centerY = halfH;

        // 6 distinct rectangular plane faces for modular picking, highlighting, exploding, and hiding
        const faceConfigs = [
          { id: 'face-top', name: 'Mặt đáy trên', normal: [0, 1, 0], pos: [0, centerY + halfH, 0], rot: [-Math.PI / 2, 0, 0], size: [sA, sB], color: 0x10b981 },
          { id: 'face-bottom', name: 'Mặt đáy dưới', normal: [0, -1, 0], pos: [0, centerY - halfH, 0], rot: [Math.PI / 2, 0, 0], size: [sA, sB], color: 0x10b981 },
          { id: 'face-front', name: 'Mặt bên trước', normal: [0, 0, 1], pos: [0, centerY, halfB], rot: [0, 0, 0], size: [sA, sH], color: 0x3b82f6 },
          { id: 'face-back', name: 'Mặt bên sau', normal: [0, 0, -1], pos: [0, centerY, -halfB], rot: [0, Math.PI, 0], size: [sA, sH], color: 0x3b82f6 },
          { id: 'face-left', name: 'Mặt bên trái', normal: [-1, 0, 0], pos: [-halfA, centerY, 0], rot: [0, -Math.PI / 2, 0], size: [sB, sH], color: 0x6366f1 },
          { id: 'face-right', name: 'Mặt bên phải', normal: [1, 0, 0], pos: [halfA, centerY, 0], rot: [0, Math.PI / 2, 0], size: [sB, sH], color: 0x6366f1 },
        ];

        if (showFaces) {
          faceConfigs.forEach(fc => {
            const fGeo = new THREE.PlaneGeometry(fc.size[0], fc.size[1]);
            const fMat = createFaceMaterial(fc.id, fc.color);
            const mesh = new THREE.Mesh(fGeo, fMat);
            
            // Apply explode displacement along normal
            const expX = fc.normal[0] * explodeDist;
            const expY = fc.normal[1] * explodeDist;
            const expZ = fc.normal[2] * explodeDist;

            mesh.position.set(fc.pos[0] + expX, fc.pos[1] + expY, fc.pos[2] + expZ);
            mesh.rotation.set(fc.rot[0], fc.rot[1], fc.rot[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = { id: fc.id, name: fc.name, type: 'face', description: `${fc.name} (${fc.size[0] > 0 ? (fc.id.includes('top') || fc.id.includes('bottom') ? `${a} × ${b}` : `${fc.size[0] === sA ? a : b} × ${h}`) : ''} cm)` };
            group.add(mesh);
          });
        }

        // 12 Edges
        if (showEdges && !isExploded) {
          const boxGeo = new THREE.BoxGeometry(sA, sH, sB);
          const edgesGeo = new THREE.EdgesGeometry(boxGeo);
          const edgesMesh = new THREE.LineSegments(edgesGeo, edgeMaterial);
          edgesMesh.position.set(0, centerY, 0);
          group.add(edgesMesh);
        }

        // 8 Vertices
        if (!isExploded) {
          const vDefs = [
            { id: 'v-A', name: 'Đỉnh A', pos: new THREE.Vector3(-halfA, centerY + halfH, halfB) },
            { id: 'v-B', name: 'Đỉnh B', pos: new THREE.Vector3(halfA, centerY + halfH, halfB) },
            { id: 'v-C', name: 'Đỉnh C', pos: new THREE.Vector3(halfA, centerY + halfH, -halfB) },
            { id: 'v-D', name: 'Đỉnh D', pos: new THREE.Vector3(-halfA, centerY + halfH, -halfB) },
            { id: 'v-A1', name: "Đỉnh A'", pos: new THREE.Vector3(-halfA, centerY - halfH, halfB) },
            { id: 'v-B1', name: "Đỉnh B'", pos: new THREE.Vector3(halfA, centerY - halfH, halfB) },
            { id: 'v-C1', name: "Đỉnh C'", pos: new THREE.Vector3(halfA, centerY - halfH, -halfB) },
            { id: 'v-D1', name: "Đỉnh D'", pos: new THREE.Vector3(-halfA, centerY - halfH, -halfB) },
          ];
          vDefs.forEach(v => addVertexSphere(v.id, v.name, v.pos));
        }

        // 3D Measurement dimensions
        if (!isExploded) {
          if (isCube) {
            addDimensionLine(new THREE.Vector3(-halfA, 0, halfB), new THREE.Vector3(halfA, 0, halfB), `Cạnh a = ${a} cm`, new THREE.Vector3(0, 0, 0.4));
            addDimensionLine(new THREE.Vector3(halfA, 0, halfB), new THREE.Vector3(halfA, sH, halfB), `Cạnh a = ${a} cm`, new THREE.Vector3(0.4, 0, 0));
          } else {
            addDimensionLine(new THREE.Vector3(-halfA, 0, halfB), new THREE.Vector3(halfA, 0, halfB), `Dài a = ${a} cm`, new THREE.Vector3(0, 0, 0.4));
            addDimensionLine(new THREE.Vector3(halfA, 0, -halfB), new THREE.Vector3(halfA, 0, halfB), `Rộng b = ${b} cm`, new THREE.Vector3(0.4, 0, 0));
            addDimensionLine(new THREE.Vector3(-halfA, 0, -halfB), new THREE.Vector3(-halfA, sH, -halfB), `Cao h = ${h} cm`, new THREE.Vector3(-0.4, 0, 0));
          }
        }
        break;
      }

      case 'cylinder': {
        const r = Number(dimensions.radius) || 3;
        const h = Number(dimensions.height) || 6;
        const scale = 5.0 / Math.max(r * 2, h, 6);
        const sR = r * scale;
        const sH = h * scale;
        const centerY = sH / 2;

        if (showFaces) {
          // Top circular face
          const topGeo = new THREE.CircleGeometry(sR, 36);
          const topMat = createFaceMaterial('face-top', 0x10b981);
          const topMesh = new THREE.Mesh(topGeo, topMat);
          topMesh.rotation.x = -Math.PI / 2;
          topMesh.position.set(0, centerY + sH / 2 + (isExploded ? explodeDist : 0), 0);
          topMesh.userData = { id: 'face-top', name: 'Mặt đáy trên', type: 'face', description: `Mặt đáy hình tròn phẳng (bán kính r = ${r} cm)` };
          group.add(topMesh);

          // Bottom circular face
          const botGeo = new THREE.CircleGeometry(sR, 36);
          const botMat = createFaceMaterial('face-bottom', 0x10b981);
          const botMesh = new THREE.Mesh(botGeo, botMat);
          botMesh.rotation.x = Math.PI / 2;
          botMesh.position.set(0, centerY - sH / 2 - (isExploded ? explodeDist : 0), 0);
          botMesh.userData = { id: 'face-bottom', name: 'Mặt đáy dưới', type: 'face', description: `Mặt đáy hình tròn phẳng (bán kính r = ${r} cm)` };
          group.add(botMesh);

          // Curved around surface
          const cylGeo = new THREE.CylinderGeometry(sR, sR, sH, 36, 1, true);
          const cylMat = createFaceMaterial('face-around', 0xf59e0b);
          const cylMesh = new THREE.Mesh(cylGeo, cylMat);
          cylMesh.position.set(0, centerY, 0);
          cylMesh.userData = { id: 'face-around', name: 'Mặt xung quanh hình trụ', type: 'face', description: `Mặt cong trơn (Chu vi đáy = ${(2 * 3.14 * r).toFixed(1)} cm, Cao = ${h} cm)` };
          group.add(cylMesh);
        }

        if (showEdges && !isExploded) {
          // Circle edges
          const circleCurve = new THREE.EllipseCurve(0, 0, sR, sR, 0, 2 * Math.PI, false, 0);
          const points = circleCurve.getPoints(48);
          const circleGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
          
          const topEdge = new THREE.Line(circleGeo, edgeMaterial);
          topEdge.position.set(0, centerY + sH / 2, 0);
          group.add(topEdge);

          const botEdge = new THREE.Line(circleGeo, edgeMaterial);
          botEdge.position.set(0, centerY - sH / 2, 0);
          group.add(botEdge);
        }

        if (!isExploded) {
          addDimensionLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(sR, 0, 0), `Bán kính r = ${r} cm`, new THREE.Vector3(0, 0.05, 0));
          addDimensionLine(new THREE.Vector3(sR, 0, 0), new THREE.Vector3(sR, sH, 0), `Chiều cao h = ${h} cm`, new THREE.Vector3(0.35, 0, 0));
        }
        break;
      }

      case 'cone': {
        const r = Number(dimensions.radius) || 3;
        const h = Number(dimensions.height) || 5;
        const scale = 5.0 / Math.max(r * 2, h, 6);
        const sR = r * scale;
        const sH = h * scale;
        const centerY = sH / 2;

        if (showFaces) {
          // Bottom circular base
          const botGeo = new THREE.CircleGeometry(sR, 36);
          const botMat = createFaceMaterial('face-bottom', 0x10b981);
          const botMesh = new THREE.Mesh(botGeo, botMat);
          botMesh.rotation.x = Math.PI / 2;
          botMesh.position.set(0, 0 - (isExploded ? explodeDist : 0), 0);
          botMesh.userData = { id: 'face-bottom', name: 'Mặt đáy tròn phẳng', type: 'face', description: `Mặt đáy hình tròn (bán kính r = ${r} cm)` };
          group.add(botMesh);

          // Side cone surface
          const coneGeo = new THREE.ConeGeometry(sR, sH, 36, 1, true);
          const coneMat = createFaceMaterial('face-around', 0xec4899);
          const coneMesh = new THREE.Mesh(coneGeo, coneMat);
          coneMesh.position.set(0, centerY + (isExploded ? explodeDist : 0), 0);
          coneMesh.userData = { id: 'face-around', name: 'Mặt xung quanh hình nón', type: 'face', description: `Mặt nón thuôn nhọn dần về đỉnh S` };
          group.add(coneMesh);
        }

        if (showEdges && !isExploded) {
          const circleCurve = new THREE.EllipseCurve(0, 0, sR, sR, 0, 2 * Math.PI, false, 0);
          const points = circleCurve.getPoints(48);
          const circleGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
          const botEdge = new THREE.Line(circleGeo, edgeMaterial);
          botEdge.position.set(0, 0, 0);
          group.add(botEdge);
        }

        // Apex vertex
        if (!isExploded) {
          addVertexSphere('v-S', 'Đỉnh nón S', new THREE.Vector3(0, sH, 0));
          addDimensionLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(sR, 0, 0), `Bán kính r = ${r} cm`, new THREE.Vector3(0, 0.05, 0));
          addDimensionLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, sH, 0), `Chiều cao h = ${h} cm`, new THREE.Vector3(-0.35, 0, 0));
        }
        break;
      }

      case 'sphere': {
        const r = Number(dimensions.radius) || 4;
        const scale = 5.0 / Math.max(r * 2, 6);
        const sR = r * scale;
        const centerY = sR;

        if (showFaces) {
          const sphereGeo = new THREE.SphereGeometry(sR, 40, 40);
          const sphereMat = createFaceMaterial('face-sphere', 0x8b5cf6);
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          sphereMesh.position.set(0, centerY, 0);
          sphereMesh.castShadow = true;
          sphereMesh.userData = { id: 'face-sphere', name: 'Mặt cầu tròn hoàn hảo', type: 'face', description: `Tất cả các điểm trên mặt cầu đều cách tâm O một khoảng R = ${r} cm` };
          group.add(sphereMesh);
        }

        if (showEdges && !isWireframe) {
          // Equator great circle ring
          const ringGeo = new THREE.TorusGeometry(sR, 0.02, 16, 64);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.position.set(0, centerY, 0);
          group.add(ringMesh);

          // Meridian great circle ring
          const ringMesh2 = ringMesh.clone();
          ringMesh2.rotation.x = 0;
          group.add(ringMesh2);
        }

        // Center point
        if (showVertices) {
          addVertexSphere('v-O', 'Tâm cầu O', new THREE.Vector3(0, centerY, 0));
        }

        addDimensionLine(new THREE.Vector3(0, centerY, 0), new THREE.Vector3(sR, centerY, 0), `Bán kính R = ${r} cm`, new THREE.Vector3(0, 0.1, 0));
        break;
      }

      case 'triangular-prism': {
        const a = Number(dimensions.baseEdge) || 4;
        const h = Number(dimensions.height) || 6;
        const scale = 5.0 / Math.max(a * 1.5, h, 6);
        const sA = a * scale;
        const sH = h * scale;
        const hBase = (sA * Math.sqrt(3)) / 2;
        const centerY = sH / 2;

        // Base vertices on X-Z plane centered
        const pA = new THREE.Vector2(-sA / 2, -hBase / 3);
        const pB = new THREE.Vector2(sA / 2, -hBase / 3);
        const pC = new THREE.Vector2(0, (2 * hBase) / 3);

        if (showFaces) {
          // Top triangle
          const topShape = new THREE.Shape();
          topShape.moveTo(pA.x, pA.y);
          topShape.lineTo(pB.x, pB.y);
          topShape.lineTo(pC.x, pC.y);
          topShape.closePath();

          const topGeo = new THREE.ShapeGeometry(topShape);
          const topMat = createFaceMaterial('face-top', 0x10b981);
          const topMesh = new THREE.Mesh(topGeo, topMat);
          topMesh.rotation.x = -Math.PI / 2;
          topMesh.position.set(0, centerY + sH / 2 + (isExploded ? explodeDist : 0), 0);
          topMesh.userData = { id: 'face-top', name: 'Mặt đáy tam giác trên (ABC)', type: 'face', description: `Tam giác đều cạnh a = ${a} cm` };
          group.add(topMesh);

          // Bottom triangle
          const botGeo = new THREE.ShapeGeometry(topShape);
          const botMat = createFaceMaterial('face-bottom', 0x10b981);
          const botMesh = new THREE.Mesh(botGeo, botMat);
          botMesh.rotation.x = Math.PI / 2;
          botMesh.position.set(0, centerY - sH / 2 - (isExploded ? explodeDist : 0), 0);
          botMesh.userData = { id: 'face-bottom', name: "Mặt đáy tam giác dưới (A'B'C')", type: 'face', description: `Tam giác đều cạnh a = ${a} cm` };
          group.add(botMesh);

          // 3 Rectangle Sides
          const sides = [
            { id: 'face-side-1', name: 'Mặt bên 1 (ABB’A’)', v1: pA, v2: pB, norm: [0, 0, 1] },
            { id: 'face-side-2', name: 'Mặt bên 2 (BCC’B’)', v1: pB, v2: pC, norm: [1, 0, -0.5] },
            { id: 'face-side-3', name: 'Mặt bên 3 (CAA’C’)', v1: pC, v2: pA, norm: [-1, 0, -0.5] },
          ];

          sides.forEach(s => {
            const sideLen = s.v1.distanceTo(s.v2);
            const sideGeo = new THREE.PlaneGeometry(sideLen, sH);
            const sideMat = createFaceMaterial(s.id, 0x06b6d4);
            const mesh = new THREE.Mesh(sideGeo, sideMat);

            const midX = (s.v1.x + s.v2.x) / 2;
            const midZ = (s.v1.y + s.v2.y) / 2;
            const angle = -Math.atan2(s.v2.y - s.v1.y, s.v2.x - s.v1.x);

            mesh.position.set(
              midX + (isExploded ? s.norm[0] * explodeDist : 0),
              centerY,
              midZ + (isExploded ? s.norm[2] * explodeDist : 0)
            );
            mesh.rotation.y = angle;
            mesh.userData = { id: s.id, name: s.name, type: 'face', description: `Mặt chữ nhật kích thước ${a} × ${h} cm` };
            group.add(mesh);
          });
        }

        // 6 Vertices
        if (!isExploded) {
          const vList = [
            { id: 'v-A', name: 'Đỉnh A', pos: new THREE.Vector3(pA.x, centerY + sH / 2, pA.y) },
            { id: 'v-B', name: 'Đỉnh B', pos: new THREE.Vector3(pB.x, centerY + sH / 2, pB.y) },
            { id: 'v-C', name: 'Đỉnh C', pos: new THREE.Vector3(pC.x, centerY + sH / 2, pC.y) },
            { id: 'v-A1', name: "Đỉnh A'", pos: new THREE.Vector3(pA.x, centerY - sH / 2, pA.y) },
            { id: 'v-B1', name: "Đỉnh B'", pos: new THREE.Vector3(pB.x, centerY - sH / 2, pB.y) },
            { id: 'v-C1', name: "Đỉnh C'", pos: new THREE.Vector3(pC.x, centerY - sH / 2, pC.y) },
          ];
          vList.forEach(v => addVertexSphere(v.id, v.name, v.pos));

          // Edges
          if (showEdges) {
            const edgeLines: [THREE.Vector3, THREE.Vector3][] = [
              [vList[0].pos, vList[1].pos], [vList[1].pos, vList[2].pos], [vList[2].pos, vList[0].pos],
              [vList[3].pos, vList[4].pos], [vList[4].pos, vList[5].pos], [vList[5].pos, vList[3].pos],
              [vList[0].pos, vList[3].pos], [vList[1].pos, vList[4].pos], [vList[2].pos, vList[5].pos],
            ];
            const pts: THREE.Vector3[] = [];
            edgeLines.forEach(pair => { pts.push(pair[0]); pts.push(pair[1]); });
            const eGeo = new THREE.BufferGeometry().setFromPoints(pts);
            const eLines = new THREE.LineSegments(eGeo, edgeMaterial);
            group.add(eLines);
          }

          addDimensionLine(new THREE.Vector3(pA.x, 0, pA.y), new THREE.Vector3(pB.x, 0, pB.y), `Cạnh đáy a = ${a} cm`, new THREE.Vector3(0, 0, 0.3));
          addDimensionLine(new THREE.Vector3(pB.x, 0, pB.y), new THREE.Vector3(pB.x, sH, pB.y), `Chiều cao h = ${h} cm`, new THREE.Vector3(0.3, 0, 0));
        }
        break;
      }

      case 'square-pyramid': {
        const a = Number(dimensions.baseEdge) || 5;
        const h = Number(dimensions.height) || 6;
        const scale = 5.0 / Math.max(a, h, 6);
        const sA = a * scale;
        const sH = h * scale;
        const halfA = sA / 2;

        const apex = new THREE.Vector3(0, sH, 0);
        const vA = new THREE.Vector3(-halfA, 0, halfA);
        const vB = new THREE.Vector3(halfA, 0, halfA);
        const vC = new THREE.Vector3(halfA, 0, -halfA);
        const vD = new THREE.Vector3(-halfA, 0, -halfA);

        if (showFaces) {
          // Bottom square
          const botGeo = new THREE.PlaneGeometry(sA, sA);
          const botMat = createFaceMaterial('face-bottom', 0x10b981);
          const botMesh = new THREE.Mesh(botGeo, botMat);
          botMesh.rotation.x = Math.PI / 2;
          botMesh.position.set(0, 0 - (isExploded ? explodeDist : 0), 0);
          botMesh.userData = { id: 'face-bottom', name: 'Mặt đáy vuông (ABCD)', type: 'face', description: `Hình vuông cạnh a = ${a} cm` };
          group.add(botMesh);

          // 4 Triangular sides
          const triFaces = [
            { id: 'face-side-1', name: 'Mặt bên tam giác SAB', v1: vA, v2: vB, norm: [0, 0.5, 1] },
            { id: 'face-side-2', name: 'Mặt bên tam giác SBC', v1: vB, v2: vC, norm: [1, 0.5, 0] },
            { id: 'face-side-3', name: 'Mặt bên tam giác SCD', v1: vC, v2: vD, norm: [0, 0.5, -1] },
            { id: 'face-side-4', name: 'Mặt bên tam giác SDA', v1: vD, v2: vA, norm: [-1, 0.5, 0] },
          ];

          triFaces.forEach(tf => {
            const geom = new THREE.BufferGeometry();
            const vertices = new Float32Array([
              tf.v1.x, tf.v1.y, tf.v1.z,
              tf.v2.x, tf.v2.y, tf.v2.z,
              apex.x, apex.y, apex.z,
            ]);
            geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geom.computeVertexNormals();

            const mat = createFaceMaterial(tf.id, 0xf97316);
            const mesh = new THREE.Mesh(geom, mat);
            if (isExploded) {
              mesh.position.set(tf.norm[0] * explodeDist, tf.norm[1] * explodeDist, tf.norm[2] * explodeDist);
            }
            mesh.userData = { id: tf.id, name: tf.name, type: 'face', description: `Mặt tam giác cân đáy = ${a} cm` };
            group.add(mesh);
          });
        }

        if (!isExploded) {
          // 5 Vertices
          addVertexSphere('v-S', 'Đỉnh chóp S', apex);
          addVertexSphere('v-A', 'Đỉnh đáy A', vA);
          addVertexSphere('v-B', 'Đỉnh đáy B', vB);
          addVertexSphere('v-C', 'Đỉnh đáy C', vC);
          addVertexSphere('v-D', 'Đỉnh đáy D', vD);

          // 8 Edges
          if (showEdges) {
            const edgePairs = [
              [vA, vB], [vB, vC], [vC, vD], [vD, vA],
              [apex, vA], [apex, vB], [apex, vC], [apex, vD],
            ];
            const pts: THREE.Vector3[] = [];
            edgePairs.forEach(p => { pts.push(p[0]); pts.push(p[1]); });
            const eGeo = new THREE.BufferGeometry().setFromPoints(pts);
            const eLines = new THREE.LineSegments(eGeo, edgeMaterial);
            group.add(eLines);
          }

          addDimensionLine(vA, vB, `Cạnh đáy a = ${a} cm`, new THREE.Vector3(0, 0, 0.3));
          addDimensionLine(new THREE.Vector3(0, 0, 0), apex, `Chiều cao h = ${h} cm`, new THREE.Vector3(-0.4, 0, 0));
        }
        break;
      }
    }
  }, [shapeType, dimensions, showFaces, showEdges, showVertices, showDimensions, hiddenFaceIds, selectedItem, renderStyle, explodedOffset]);

  // Handle Raycasting click on canvas
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !shapeGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(shapeGroupRef.current.children, true);

    if (intersects.length > 0) {
      // Find the first interactive object that has userData
      for (const hit of intersects) {
        const uData = hit.object.userData;
        if (uData && uData.id) {
          sound.playPick();
          onSelectItem({
            id: uData.id,
            name: uData.name || 'Phần tử hình khối',
            type: uData.type || 'face',
            description: uData.description || '',
          });
          return;
        }
      }
    }
  }, [onSelectItem]);

  // Pointer move to show quick hover tooltip
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !shapeGroupRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(shapeGroupRef.current.children, true);

    if (intersects.length > 0) {
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.name) {
          setHoveredName(hit.object.userData.name);
          return;
        }
      }
    }
    setHoveredName(null);
  }, []);

  // Camera Preset Angles
  const setCameraView = (view: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso') => {
    sound.playClick();
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    const dist = 14;

    switch (view) {
      case 'front':
        cam.position.set(0, 2.5, dist);
        break;
      case 'back':
        cam.position.set(0, 2.5, -dist);
        break;
      case 'left':
        cam.position.set(-dist, 2.5, 0);
        break;
      case 'right':
        cam.position.set(dist, 2.5, 0);
        break;
      case 'top':
        cam.position.set(0, dist + 2, 0.001);
        break;
      case 'bottom':
        cam.position.set(0, -dist - 2, 0.001);
        break;
      case 'iso':
        cam.position.set(9, 7, 11);
        break;
    }
    controls.target.set(0, 2, 0);
    controls.update();
  };

  // Reset Camera View
  const resetCamera = () => {
    sound.playClick();
    setCameraView('iso');
  };

  // Zoom In / Zoom Out
  const zoomCamera = (delta: number) => {
    sound.playClick();
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    cam.position.addScaledVector(dir, delta);
    controlsRef.current.update();
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    sound.playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* 3D WebGL Canvas Host */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Top Floating Badge & View Preset Strip */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 gap-2 flex-wrap">
        {/* Left: View orientation pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1 px-2 text-xs font-bold text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Góc nhìn:</span>
          </div>
          <button
            onClick={() => setCameraView('iso')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Góc nhìn 3D chuẩn"
          >
            3D
          </button>
          <button
            onClick={() => setCameraView('front')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Nhìn từ mặt trước"
          >
            Trước
          </button>
          <button
            onClick={() => setCameraView('top')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Nhìn từ trên xuống"
          >
            Trên
          </button>
          <button
            onClick={() => setCameraView('left')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Nhìn từ bên trái"
          >
            Trái
          </button>
          <button
            onClick={() => setCameraView('right')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Nhìn từ bên phải"
          >
            Phải
          </button>
          <button
            onClick={() => setCameraView('bottom')}
            className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Nhìn từ đáy dưới"
          >
            Dưới
          </button>
        </div>

        {/* Right: Quick viewport utilities (Auto Rotate, Zoom, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all active:scale-95 ${
              isAutoRotating
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Tự động xoay 360 độ"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAutoRotating ? 'Đang xoay' : 'Tự xoay'}</span>
          </button>

          <button
            onClick={() => zoomCamera(1.5)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => zoomCamera(-1.5)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all active:scale-95"
            title="Đặt lại vị trí camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-all active:scale-95"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng toàn màn hình'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating Hover Indicator when pointing at faces or vertices */}
      {hoveredName && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-900/90 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl pointer-events-none z-10 animate-fade-in">
          🔍 {hoveredName} (Nhấp để chọn)
        </div>
      )}

      {/* Bottom Floating Interactive Hints & Selection Banner */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 flex-wrap gap-2">
        {/* Navigation Help pill */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-auto">
          <span className="flex items-center gap-1 font-semibold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Kéo chuột:
          </span>
          <span>Xoay 360°</span>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-sky-400">Cuộn:</span>
          <span>Phóng to/nhỏ</span>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-sky-400">Chuột phải:</span>
          <span>Di chuyển</span>
        </div>

        {/* Selected Item Notification Tag */}
        {selectedItem && (
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-500/60 text-xs text-rose-200 font-bold shadow-xl flex items-center gap-2 pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Đang chọn: {selectedItem.id}</span>
            <button
              onClick={() => onSelectItem(null)}
              className="ml-1 text-rose-400 hover:text-white px-1 font-extrabold text-sm"
              title="Bỏ chọn"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
