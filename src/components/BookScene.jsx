import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { pagePoint } from './bookGeometry';

function coverTexture(book) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1120;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = book.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Small, deterministic fibers give the jackets a cloth finish.
  ctx.globalAlpha = 0.075;
  ctx.strokeStyle = book.ink;
  for (let x = 0; x < 768; x += 4) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1120); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = book.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 684, 1036);
  ctx.lineWidth = 0.6;
  ctx.strokeRect(52, 52, 664, 1016);
  ctx.fillStyle = book.ink;
  ctx.textAlign = 'center';
  ctx.font = '22px Georgia';
  ctx.fillText('THE READING ROOM', 384, 121);
  ctx.fillRect(355, 147, 58, 1);
  ctx.font = book.coverLines.length === 1 ? '53px Georgia' : '68px Georgia';
  book.coverLines.forEach((line, index) => {
    ctx.fillText(line, 384, 280 + index * 87);
  });
  ctx.font = 'italic 30px Georgia';
  if (book.subtitle) ctx.fillText(book.subtitle, 384, 520);
  ctx.lineWidth = 2;
  const cy = 703;
  if (book.motif === 'circle') {
    ctx.beginPath(); ctx.arc(384, cy, 107, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(384, cy, 98, 0, Math.PI * 2); ctx.stroke();
    ctx.fillRect(383, cy - 125, 2, 250);
    ctx.fillRect(259, cy - 1, 250, 2);
  } else if (book.motif === 'window') {
    ctx.strokeRect(282, cy - 126, 204, 252);
    ctx.strokeRect(296, cy - 112, 176, 224);
    ctx.beginPath(); ctx.moveTo(384, cy - 126); ctx.lineTo(384, cy + 126); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(282, cy); ctx.lineTo(486, cy); ctx.stroke();
    ctx.beginPath(); ctx.arc(384, cy, 58, 0, Math.PI * 2); ctx.stroke();
  } else {
    for (const direction of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(384, cy, 108, 123, 0, direction < 0 ? 1.6 : -1.5, direction < 0 ? 4.65 : 1.5);
      ctx.stroke();
      for (let i = 0; i < 9; i += 1) {
        const theta = -1.2 + i * 0.3;
        const x = 384 + direction * Math.cos(theta) * 110;
        const y = cy + Math.sin(theta) * 123;
        ctx.save(); ctx.translate(x, y); ctx.rotate(direction * theta);
        ctx.beginPath(); ctx.ellipse(0, 0, 21, 7, direction * 0.7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    ctx.font = 'italic 46px Georgia';
    ctx.fillText('M', 384, cy + 16);
  }
  ctx.font = '27px Georgia';
  ctx.fillText(book.author.toUpperCase(), 384, 943);
  ctx.font = '17px Georgia';
  ctx.fillText('A SAMPLE FROM THE COLLECTION', 384, 1032);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function paperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eee6d2';
  ctx.fillRect(0, 0, 512, 768);
  ctx.fillStyle = '#80745d';
  ctx.textAlign = 'center';
  ctx.font = 'italic 23px Georgia';
  ctx.fillText('In the margins', 256, 112);
  ctx.fillStyle = '#c9bea5';
  for (let row = 0; row < 22; row += 1) ctx.fillRect(65, 170 + row * 20, row % 7 === 6 ? 245 : 382, 2);
  ctx.fillStyle = '#948774';
  ctx.font = '16px Georgia';
  ctx.fillText('01', 256, 710);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function stoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#79776a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 160; i += 1) {
    ctx.strokeStyle = i % 3 === 0 ? '#a9a39422' : '#343b3226';
    ctx.lineWidth = i % 3 + 0.5;
    const y = (i * 79) % 256;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(70, y + 25, 180, y - 16, 256, y + 9); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  return texture;
}

export default function BookScene({ book, opening = false, originRect, reducedMotion = false, onOpened }) {
  const mount = useRef(null);
  const paperWash = useRef(null);
  const onOpenedRef = useRef(onOpened);
  const [ready, setReady] = useState(false);
  onOpenedRef.current = onOpened;

  useEffect(() => {
    setReady(false);
    if (reducedMotion) {
      onOpenedRef.current?.();
      return undefined;
    }
    const host = mount.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      onOpenedRef.current?.();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);
    const cameraTarget = new THREE.Vector3(0, -0.9, 0);
    camera.position.set(3.1, 1.55, 8.9);
    camera.lookAt(cameraTarget);
    scene.add(new THREE.AmbientLight('#a4b49d', 1.5));
    const key = new THREE.SpotLight('#ffe1a2', 92, 20, Math.PI / 5, 0.85, 1.6);
    key.position.set(-2, 6, 5);
    key.target.position.set(0, -0.5, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.bias = -0.001;
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight('#b8b29a', 2.1);
    rim.position.set(3, 1, -2);
    scene.add(rim);
    const display = new THREE.Group();
    scene.add(display);
    const stone = new THREE.MeshStandardMaterial({ color: '#ada797', roughness: 0.95, map: stoneTexture() });
    const addBox = (width, height, depth, y, material = stone, parent = display) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      box.position.y = y;
      box.castShadow = true;
      box.receiveShadow = true;
      parent.add(box);
      return box;
    };
    addBox(2.02, 0.17, 1.75, -1.05);
    addBox(1.82, 0.12, 1.54, -1.195);
    addBox(1.57, 0.2, 1.37, -1.35);
    const shaftGeometry = new THREE.CylinderGeometry(0.68, 0.79, 2.18, 96, 1);
    const positions = shaftGeometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const angle = Math.atan2(positions.getZ(index), positions.getX(index));
      const groove = 1 - 0.034 * (1 + Math.cos(angle * 20));
      positions.setX(index, positions.getX(index) * groove);
      positions.setZ(index, positions.getZ(index) * groove);
    }
    shaftGeometry.computeVertexNormals();
    const shaft = new THREE.Mesh(shaftGeometry, stone);
    shaft.position.y = -2.54;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    display.add(shaft);
    addBox(1.71, 0.16, 1.53, -3.69);
    addBox(1.94, 0.2, 1.75, -3.85);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.28 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.96;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = new THREE.Group();
    model.position.set(0, 0.29, 0);
    model.rotation.y = -0.12;
    display.add(model);
    const jacket = new THREE.MeshStandardMaterial({ color: book.color, roughness: 0.85 });
    const cover = new THREE.MeshStandardMaterial({ map: coverTexture(book), roughness: 0.82 });
    const paper = new THREE.MeshStandardMaterial({ color: '#d8cdb3', roughness: 1 });
    const block = addBox(1.53, 2.3, 0.34, 0, paper, model);
    block.position.x = 0.015;
    block.position.z = -0.02;
    const back = addBox(1.66, 2.46, 0.07, 0, jacket, model);
    back.position.z = -0.235;
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.46, 0.47), jacket);
    spine.position.set(-0.8, 0, 0);
    model.add(spine);
    const hinge = new THREE.Group();
    hinge.position.set(-0.83, 0, 0.22);
    const front = new THREE.Mesh(new THREE.BoxGeometry(1.66, 2.46, 0.065), [jacket, jacket, jacket, paper, cover, jacket]);
    front.position.x = 0.83;
    front.castShadow = true;
    hinge.add(front);
    model.add(hinge);
    // Thin lines on the fore-edge make the closed page block read as paper.
    const edgeMaterial = new THREE.LineBasicMaterial({ color: '#897e69', transparent: true, opacity: 0.36 });
    const edgePoints = [];
    for (let i = 0; i < 19; i += 1) {
      const z = -0.178 + i * 0.017;
      edgePoints.push(0.783, -1.15, z, 0.783, 1.15, z);
      edgePoints.push(-0.75, 1.152, z, 0.783, 1.152, z);
    }
    const edges = new THREE.BufferGeometry();
    edges.setAttribute('position', new THREE.Float32BufferAttribute(edgePoints, 3));
    model.add(new THREE.LineSegments(edges, edgeMaterial));
    const pages = [];
    if (opening) {
      const printedPaper = new THREE.MeshStandardMaterial({ map: paperTexture(), roughness: 1, side: THREE.DoubleSide });
      const rightPage = new THREE.Mesh(new THREE.PlaneGeometry(1.52, 2.28), printedPaper);
      rightPage.position.z = 0.151;
      model.add(rightPage);
      for (let index = 0; index < 4; index += 1) {
        const geometry = new THREE.PlaneGeometry(1.52, 2.28, 22, 1);
        geometry.translate(0.76, 0, 0);
        const page = new THREE.Mesh(geometry, printedPaper);
        page.castShadow = true;
        const pivot = new THREE.Group();
        pivot.position.set(-0.76, 0, 0.175 - index * 0.007);
        pivot.add(page);
        model.add(pivot);
        pages.push({ pivot, geometry, turn: 0 });
      }
    }
    let visible = true;
    let disposed = false;
    let timeline;
    const render = () => {
      if (!disposed && visible && !document.hidden) {
        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
      }
    };
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      renderer.setSize(host.clientWidth, host.clientHeight);
      camera.updateProjectionMatrix();
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) timeline?.resume();
      else timeline?.pause();
      render();
    });
    intersection.observe(host);
    const contextLost = (event) => {
      event.preventDefault();
      setReady(false);
      onOpenedRef.current?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    let hover;
    const pointerMove = (event) => {
      const bounds = host.getBoundingClientRect();
      hover?.kill();
      hover = gsap.to(model.rotation, { y: -0.12 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.18, duration: 0.65, onUpdate: render });
    };
    const pointerLeave = () => {
      hover?.kill();
      hover = gsap.to(model.rotation, { y: -0.12, duration: 0.8, onUpdate: render });
    };
    if (!opening) {
      host.addEventListener('pointermove', pointerMove);
      host.addEventListener('pointerleave', pointerLeave);
    }
    const fullscreenDepth = window.innerWidth / window.innerHeight < 0.8 ? 13 : 8.9;
    const hasOrigin = opening && originRect && ['x', 'y', 'width', 'height'].every((key) => Number.isFinite(originRect[key])) && originRect.width > 0 && originRect.height > 0;
    if (hasOrigin) gsap.set(host, { left: originRect.x, top: originRect.y, width: originRect.width, height: originRect.height });
    else if (opening) camera.position.z = fullscreenDepth;
    resize();
    setReady(true);
    if (opening) {
      timeline = gsap.timeline({ onUpdate: render, onComplete: () => onOpenedRef.current?.() });
      if (hasOrigin) {
        timeline.to(host, { left: 0, top: 0, width: '100%', height: '100%', duration: 0.6, ease: 'power2.inOut', onUpdate: resize }, 0);
        timeline.to(camera.position, { z: fullscreenDepth, duration: 0.6, ease: 'power2.inOut' }, 0);
      }
      timeline.to(display.position, { y: 0.6, duration: 0.7, ease: 'power2.inOut' }, 0);
      timeline.to(model.rotation, { y: 0.14, x: -0.1, duration: 0.9 }, 0);
      timeline.to(model.scale, { x: 1.32, y: 1.32, z: 1.32, duration: 1.15, ease: 'power2.inOut' }, 0);
      timeline.to(hinge.rotation, { y: -2.7, duration: 0.82, ease: 'power2.inOut' }, 0.28);
      pages.forEach((page, index) => {
        timeline.to(page, {
          turn: 1,
          duration: 0.65,
          ease: 'power2.inOut',
          onUpdate: () => {
            page.pivot.rotation.y = -2.62 * page.turn;
            const vertices = page.geometry.attributes.position;
            for (let i = 0; i < vertices.count; i += 1) {
              vertices.setZ(i, pagePoint(vertices.getX(i), vertices.getY(i), page.turn)[2]);
            }
            vertices.needsUpdate = true;
            page.geometry.computeVertexNormals();
          },
        }, 0.49 + index * 0.095);
      });
      // Approach the exposed right-hand page, then blend paper into the HTML sheet.
      timeline.to(model.rotation, { x: 0, y: 0, duration: 0.55, ease: 'power2.inOut' }, 1.3);
      timeline.to(cameraTarget, { x: 0, y: 0.89, z: 0.2, duration: 0.55, ease: 'power2.inOut' }, 1.3);
      timeline.to(camera.position, { x: 0, y: 0.89, z: 1.35, duration: 0.55, ease: 'power3.in' }, 1.3);
      timeline.to(paperWash.current, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 1.72);
    }
    const visibilityChange = () => {
      if (document.hidden) timeline?.pause();
      else if (visible) { timeline?.resume(); render(); }
    };
    document.addEventListener('visibilitychange', visibilityChange);
    return () => {
      disposed = true;
      timeline?.kill();
      hover?.kill();
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', visibilityChange);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      host.removeEventListener('pointermove', pointerMove);
      host.removeEventListener('pointerleave', pointerLeave);
      const geometries = new Set();
      const materials = new Set();
      const textures = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
      });
      materials.forEach((material) => {
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        material.dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      textures.forEach((texture) => texture.dispose());
      key.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [book, opening, originRect, reducedMotion]);

  return (
    <div className={`book-scene ${ready ? 'book-scene--ready' : ''} ${opening ? 'book-scene--opening' : ''}`} ref={mount} aria-hidden="true">
      {opening && <div className="book-scene-paper-wash" ref={paperWash} />}
      {!ready && (
        <div className="book-scene-fallback">
          <div className="book-fallback-cover" style={{ '--book-color': book.color, '--book-ink': book.ink }}>
            <span className="book-fallback-imprint">THE READING ROOM</span>
            <strong>{book.title}</strong>
            <span className="book-fallback-symbol">✳</span>
            <span>{book.author}</span>
          </div>
          {!opening && <div className="book-fallback-pillar" />}
        </div>
      )}
    </div>
  );
}
