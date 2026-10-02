import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { WadaPalette, WadaColor } from '../types';
import { RotateCw, Box, Camera, Sparkles, Sliders, Play, Pause, Layers, Eye } from 'lucide-react';
import { playGentleClick, playCopyChime } from '../utils/sound';

export type GeometryType = 'crystal' | 'mizuhiki' | 'ribbon' | 'chazutsu' | 'isometric-stack';
export type MaterialFinish = 'lacquer' | 'washi' | 'metallic' | 'wireframe';

interface ThreeCanvasProps {
  palette: WadaPalette;
  height?: number | string;
  interactive?: boolean;
  autoRotateDefault?: boolean;
  initialGeometry?: GeometryType;
  showControls?: boolean;
  onSnapshotNotice?: (title: string, subtitle?: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  palette,
  height = 420,
  interactive = true,
  autoRotateDefault = true,
  initialGeometry = 'crystal',
  showControls = true,
  onSnapshotNotice,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [geometryType, setGeometryType] = useState<GeometryType>(initialGeometry);
  const [finish, setFinish] = useState<MaterialFinish>('lacquer');
  const [isRotating, setIsRotating] = useState<boolean>(autoRotateDefault);
  const [wireframe, setWireframe] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Pointer dragging state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Update Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const canvasHeight = typeof height === 'number' ? height : container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // 3. Renderer with transparent background and alpha
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7e6, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8f5, 1.4);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 1.8, 10);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 5. Main Object Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Build the chosen 3D Geometry
    buildGeometry(mainGroup, geometryType, finish, palette, wireframe);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (mainGroupRef.current) {
        if (isRotating && !isDraggingRef.current) {
          mainGroupRef.current.rotation.y += 0.5 * delta;
          mainGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
        }

        // Kinetic wave animation if geometry is ribbon
        if (geometryType === 'ribbon') {
          const ribbonMesh = mainGroupRef.current.children[0] as THREE.Mesh;
          if (ribbonMesh && ribbonMesh.geometry) {
            const position = ribbonMesh.geometry.attributes.position;
            if (position) {
              const v = new THREE.Vector3();
              for (let i = 0; i < position.count; i++) {
                v.fromBufferAttribute(position, i);
                const wave = Math.sin(v.x * 2.5 + elapsedTime * 2.0) * 0.2 + Math.cos(v.y * 2.0 + elapsedTime * 1.5) * 0.15;
                position.setZ(i, wave);
              }
              position.needsUpdate = true;
              ribbonMesh.geometry.computeVertexNormals();
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = typeof height === 'number' ? height : container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
    };
  }, [geometryType, finish, palette, wireframe, height]);

  // Pointer interaction for dragging / rotating
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !isDraggingRef.current || !mainGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    mainGroupRef.current.rotation.y += deltaX * 0.008;
    mainGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length !== 1) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!interactive || !isDraggingRef.current || !mainGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    mainGroupRef.current.rotation.y += deltaX * 0.01;
    mainGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Snapshot PNG export
  const handleTakeSnapshot = () => {
    playCopyChime();
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `wada-3d-№${palette.code}-${geometryType}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onSnapshotNotice) {
      onSnapshotNotice('3D Model Render Saved', `Downloaded wada-3d-№${palette.code}-${geometryType}.png`);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.04] dark:from-white/[0.02] dark:to-black/[0.2] border border-black/10 select-none">
      
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      />

      {/* Floating 3D Control Bar */}
      {showControls && (
        <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          
          {/* Geometry Selector Pills */}
          <div className="pointer-events-auto flex items-center gap-1 bg-white/90 dark:bg-[#1f1d19]/90 backdrop-blur-md p-1 rounded-xl border border-[#ded5c2] dark:border-[#332f28] shadow-sm">
            <button
              onClick={() => { playGentleClick(); setGeometryType('crystal'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                geometryType === 'crystal'
                  ? 'bg-[#1c1a17] text-white dark:bg-[#eae4d9] dark:text-[#181614] shadow-xs'
                  : 'text-[#6e675b] dark:text-[#a0988a] hover:text-[#1c1a17]'
              }`}
            >
              Origami Crystal
            </button>
            <button
              onClick={() => { playGentleClick(); setGeometryType('mizuhiki'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                geometryType === 'mizuhiki'
                  ? 'bg-[#1c1a17] text-white dark:bg-[#eae4d9] dark:text-[#181614] shadow-xs'
                  : 'text-[#6e675b] dark:text-[#a0988a] hover:text-[#1c1a17]'
              }`}
            >
              Mizuhiki Knot
            </button>
            <button
              onClick={() => { playGentleClick(); setGeometryType('ribbon'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                geometryType === 'ribbon'
                  ? 'bg-[#1c1a17] text-white dark:bg-[#eae4d9] dark:text-[#181614] shadow-xs'
                  : 'text-[#6e675b] dark:text-[#a0988a] hover:text-[#1c1a17]'
              }`}
            >
              Silk Wave
            </button>
            <button
              onClick={() => { playGentleClick(); setGeometryType('chazutsu'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                geometryType === 'chazutsu'
                  ? 'bg-[#1c1a17] text-white dark:bg-[#eae4d9] dark:text-[#181614] shadow-xs'
                  : 'text-[#6e675b] dark:text-[#a0988a] hover:text-[#1c1a17]'
              }`}
            >
              Packaging Caddy
            </button>
            <button
              onClick={() => { playGentleClick(); setGeometryType('isometric-stack'); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                geometryType === 'isometric-stack'
                  ? 'bg-[#1c1a17] text-white dark:bg-[#eae4d9] dark:text-[#181614] shadow-xs'
                  : 'text-[#6e675b] dark:text-[#a0988a] hover:text-[#1c1a17]'
              }`}
            >
              Layered UI Stack
            </button>
          </div>

          {/* Action Tools (Play/Pause, Finish, Snapshot) */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-[#1f1d19]/90 backdrop-blur-md p-1 rounded-xl border border-[#ded5c2] dark:border-[#332f28] shadow-sm">
            {/* Auto spin toggle */}
            <button
              onClick={() => { playGentleClick(); setIsRotating(!isRotating); }}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isRotating ? 'text-[#cb3550] bg-[#cb3550]/10' : 'text-[#7e7668] dark:text-[#9e968a]'
              }`}
              title={isRotating ? 'Pause rotation' : 'Resume rotation'}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Wireframe toggle */}
            <button
              onClick={() => { playGentleClick(); setWireframe(!wireframe); }}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                wireframe ? 'bg-[#1c1a17] text-white dark:bg-white dark:text-black font-semibold' : 'text-[#6e675b] dark:text-[#a0988a]'
              }`}
              title="Toggle architectural wireframe"
            >
              Wireframe
            </button>

            {/* Finish mode */}
            <select
              value={finish}
              onChange={(e) => {
                playGentleClick();
                setFinish(e.target.value as MaterialFinish);
              }}
              className="bg-transparent text-xs font-sans text-[#4f483d] dark:text-[#cfc7ba] focus:outline-none px-1.5 py-1 rounded cursor-pointer"
            >
              <option value="lacquer" className="dark:bg-[#201d19]">Urushi Lacquer (Gloss)</option>
              <option value="washi" className="dark:bg-[#201d19]">Washi Paper (Matte)</option>
              <option value="metallic" className="dark:bg-[#201d19]">Gilded Gold (Metallic)</option>
            </select>

            {/* Take transparent snapshot */}
            <button
              onClick={handleTakeSnapshot}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#cb3550] text-white text-xs font-medium hover:bg-[#b02941] transition-colors"
              title="Download high-resolution transparent PNG"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Capture PNG</span>
            </button>
          </div>

        </div>
      )}

      {/* Subtle bottom hint */}
      <div className="absolute bottom-2.5 left-4 pointer-events-none text-[10px] font-mono text-[#8a8274] dark:text-[#888075] flex items-center gap-2">
        <span>Click & drag to rotate in 3D</span>
        <span>•</span>
        <span>Colors: {palette.colors.map(c => c.nameJa).join(' / ')}</span>
      </div>

    </div>
  );
};

// Helper to construct materials and geometries dynamically based on chosen finish and palette colors
function buildGeometry(
  group: THREE.Group,
  type: GeometryType,
  finish: MaterialFinish,
  palette: WadaPalette,
  wireframe: boolean
) {
  // Clear any existing children
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

  const colors = palette.colors;
  const threeColors = colors.map(c => new THREE.Color(c.hex));

  // Determine material properties based on finish
  const getMaterial = (color: THREE.Color, roughnessOverride?: number) => {
    if (wireframe) {
      return new THREE.MeshStandardMaterial({
        color,
        wireframe: true,
      });
    }

    if (finish === 'metallic') {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.2,
      });
    }

    if (finish === 'washi') {
      return new THREE.MeshStandardMaterial({
        color,
        metalness: 0.05,
        roughness: 0.85,
      });
    }

    // Default: Urushi Lacquerware (high-end gloss with clearcoat feel)
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.1,
      roughness: roughnessOverride !== undefined ? roughnessOverride : 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
  };

  // 1. Origami Faceted Crystal
  if (type === 'crystal') {
    const geom = new THREE.IcosahedronGeometry(1.6, 1);
    
    // Assign multi-color palette per face group
    const count = geom.attributes.position.count;
    const colorsAttr = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 3) {
      const col = threeColors[Math.floor(i / 3) % threeColors.length];
      colorsAttr[i * 3] = col.r;
      colorsAttr[i * 3 + 1] = col.g;
      colorsAttr[i * 3 + 2] = col.b;

      colorsAttr[(i + 1) * 3] = col.r;
      colorsAttr[(i + 1) * 3 + 1] = col.g;
      colorsAttr[(i + 1) * 3 + 2] = col.b;

      colorsAttr[(i + 2) * 3] = col.r;
      colorsAttr[(i + 2) * 3 + 1] = col.g;
      colorsAttr[(i + 2) * 3 + 2] = col.b;
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colorsAttr, 3));
    geom.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      metalness: finish === 'metallic' ? 0.8 : 0.15,
      roughness: finish === 'washi' ? 0.85 : 0.2,
      clearcoat: finish === 'washi' ? 0 : 0.8,
      wireframe,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    group.add(mesh);
    return;
  }

  // 2. Mizuhiki Braided Torus Knot
  if (type === 'mizuhiki') {
    const geom = new THREE.TorusKnotGeometry(1.2, 0.36, 180, 24, 2, 3);
    const primaryColor = threeColors[0];
    const mat = getMaterial(primaryColor);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    group.add(mesh);

    // If 2+ colors, add an intertwined second slender knot
    if (threeColors.length > 1) {
      const secondGeom = new THREE.TorusKnotGeometry(1.2, 0.12, 160, 16, 2, 3);
      const secondMat = getMaterial(threeColors[1]);
      const secondMesh = new THREE.Mesh(secondGeom, secondMat);
      secondMesh.rotation.y = Math.PI / 4;
      secondMesh.scale.set(1.08, 1.08, 1.08);
      group.add(secondMesh);
    }
    return;
  }

  // 3. Kinetic Silk Wave Ribbon
  if (type === 'ribbon') {
    const geom = new THREE.PlaneGeometry(3.6, 2.4, 48, 36);
    const primaryColor = threeColors[0];
    const mat = getMaterial(primaryColor, 0.3);
    mat.side = THREE.DoubleSide;
    const mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -Math.PI / 6;
    mesh.castShadow = true;
    group.add(mesh);
    return;
  }

  // 4. Traditional Japanese Packaging Canister (Chazutsu)
  if (type === 'chazutsu') {
    // Body
    const bodyGeom = new THREE.CylinderGeometry(1.1, 1.1, 2.2, 48);
    const bodyMat = getMaterial(threeColors[0]);
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.position.y = -0.2;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Lid
    const lidColor = threeColors.length > 1 ? threeColors[1] : threeColors[0];
    const lidGeom = new THREE.CylinderGeometry(1.14, 1.14, 0.7, 48);
    const lidMat = getMaterial(lidColor);
    const lidMesh = new THREE.Mesh(lidGeom, lidMat);
    lidMesh.position.y = 1.15;
    lidMesh.castShadow = true;
    group.add(lidMesh);

    // Accent Gold / Foil Band
    const bandColor = threeColors.length > 2 ? threeColors[2] : (threeColors[1] || threeColors[0]);
    const bandGeom = new THREE.CylinderGeometry(1.12, 1.12, 0.25, 48);
    const bandMat = new THREE.MeshStandardMaterial({
      color: bandColor,
      metalness: 0.8,
      roughness: 0.2,
      wireframe,
    });
    const bandMesh = new THREE.Mesh(bandGeom, bandMat);
    bandMesh.position.y = 0.7;
    group.add(bandMesh);

    // Base Rim
    if (threeColors.length > 3) {
      const baseRimGeom = new THREE.CylinderGeometry(1.12, 1.12, 0.15, 48);
      const baseRimMat = getMaterial(threeColors[3]);
      const baseRimMesh = new THREE.Mesh(baseRimGeom, baseRimMat);
      baseRimMesh.position.y = -1.25;
      group.add(baseRimMesh);
    }
    return;
  }

  // 5. Layered 3D Isometric UI Stack (Exploded UI volume hierarchy)
  if (type === 'isometric-stack') {
    group.rotation.x = 0.6;
    group.rotation.y = -0.5;

    // Layer 1: Base Canvas Floor (60% volume)
    const baseGeom = new THREE.BoxGeometry(3.2, 2.2, 0.08);
    const baseMat = getMaterial(threeColors[0]);
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.z = -0.4;
    group.add(baseMesh);

    // Layer 2: Floating Card Surface (30% volume)
    const cardColor = threeColors.length > 1 ? threeColors[1] : threeColors[0];
    const cardGeom = new THREE.BoxGeometry(2.5, 1.6, 0.08);
    const cardMat = getMaterial(cardColor);
    const cardMesh = new THREE.Mesh(cardGeom, cardMat);
    cardMesh.position.z = 0;
    group.add(cardMesh);

    // Layer 3: Floating Action Pill / CTA Badge (10% volume)
    const ctaColor = threeColors.length > 2 ? threeColors[2] : (threeColors[1] || threeColors[0]);
    const ctaGeom = new THREE.BoxGeometry(1.4, 0.45, 0.12);
    const ctaMat = getMaterial(ctaColor);
    const ctaMesh = new THREE.Mesh(ctaGeom, ctaMat);
    ctaMesh.position.set(0, -0.3, 0.45);
    group.add(ctaMesh);

    // Layer 4: Accent Dot / Jewel Indicator
    if (threeColors.length > 3) {
      const jewelGeom = new THREE.SphereGeometry(0.18, 24, 24);
      const jewelMat = getMaterial(threeColors[3]);
      const jewelMesh = new THREE.Mesh(jewelGeom, jewelMat);
      jewelMesh.position.set(0.85, 0.45, 0.5);
      group.add(jewelMesh);
    }
  }
}
