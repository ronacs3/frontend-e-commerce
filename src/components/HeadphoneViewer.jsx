"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw, RotateCw, MoveHorizontal } from "lucide-react";

export default function HeadphoneViewer({ color = "#292a2c" }) {
  const hostRef = useRef(null);
  const colorRef = useRef(color);
  const controlsRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { colorRef.current = color; }, [color]);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let teardown = () => {};
    const initialize = async () => {
      const [THREE, { OrbitControls }] = await Promise.all([
        import("three"), import("three/addons/controls/OrbitControls.js"),
      ]);
      if (disposed) return;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.45;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
      camera.position.set(3.5, 1.4, 6.5);
      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.target.set(0, 0.25, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI * 0.72;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      controls.autoRotate = !motion.matches;
      controls.autoRotateSpeed = 0.55;
      const onMotion = () => { controls.autoRotate = !motion.matches; };
      motion.addEventListener("change", onMotion);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x716758, 3));
      const key = new THREE.DirectionalLight(0xfff5e5, 5);
      key.position.set(3, 6, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -4; key.shadow.camera.right = 4;
      key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
      key.shadow.normalBias = 0.03;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 4);
      rim.position.set(-4, 2, -3);
      scene.add(rim);

      const shell = new THREE.MeshStandardMaterial({ color: colorRef.current, metalness: 0.52, roughness: 0.27 });
      const pad = new THREE.MeshStandardMaterial({ color: "#181818", metalness: 0.05, roughness: 0.9 });
      const gold = new THREE.MeshStandardMaterial({ color: "#b99b66", metalness: 0.75, roughness: 0.24 });
      const model = new THREE.Group();
      model.rotation.z = -0.13;
      scene.add(model);
      const addMesh = (geometry, material, position, rotation = [0, 0, 0], scale = [1, 1, 1]) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position); mesh.rotation.set(...rotation); mesh.scale.set(...scale);
        mesh.castShadow = true; mesh.receiveShadow = true;
        model.add(mesh);
        return mesh;
      };
      // A continuous padded arch, metal sliders and oval over-ear shells.
      addMesh(new THREE.TorusGeometry(1.02, 0.115, 16, 80, Math.PI), shell, [0, 0.45, 0], [0, 0, 0], [1, 1.12, 1.65]);
      addMesh(new THREE.TorusGeometry(0.94, 0.07, 12, 64, Math.PI), pad, [0, 0.45, 0], [0, 0, 0], [1, 1.12, 1.8]);
      for (const side of [-1, 1]) {
        addMesh(new THREE.CapsuleGeometry(0.045, 0.55, 4, 12), gold, [side * 1.015, 0.21, 0]);
        const cup = addMesh(new THREE.SphereGeometry(1, 36, 28), shell, [side * 1.015, -0.35, 0.05], [0, 0, side * 0.08], [0.43, 0.65, 0.3]);
        cup.rotation.y = side * 0.08;
        addMesh(new THREE.TorusGeometry(0.34, 0.12, 16, 48), pad, [side * 1.015, -0.35, -0.17], [0, 0, 0], [1, 1.5, 1]);
        addMesh(new THREE.TorusGeometry(0.28, 0.009, 8, 48), gold, [side * 1.015, -0.35, 0.342], [0, 0, 0], [1, 1.55, 1]);
        for (let line = -1; line <= 1; line++) {
          addMesh(new THREE.CapsuleGeometry(0.011, line === 0 ? 0.13 : 0.075, 3, 6), gold, [side * 1.015 + line * 0.055, -0.35, 0.355]);
        }
      }
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.14 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -1.17; floor.receiveShadow = true;
      scene.add(floor);

      const resize = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height; camera.updateProjectionMatrix();
      });
      resize.observe(host);
      let visible = true;
      let frame = 0;
      const target = new THREE.Color(colorRef.current);
      const animate = () => {
        if (disposed || !visible) { frame = 0; return; }
        target.set(colorRef.current);
        shell.color.lerp(target, motion.matches ? 1 : 0.09);
        controls.update(); renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frame) animate();
      });
      visibility.observe(host);
      animate();
      setReady(true);
      teardown = () => {
        cancelAnimationFrame(frame); visibility.disconnect(); resize.disconnect();
        motion.removeEventListener("change", onMotion);
        controls.dispose(); controlsRef.current = null;
        const geometries = new Set(); const materials = new Set();
        scene.traverse((object) => {
          if (object.geometry) geometries.add(object.geometry);
          if (object.material) materials.add(object.material);
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    };
    const lazy = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { lazy.disconnect(); initialize().catch(() => {}); }
    }, { rootMargin: "200px" });
    lazy.observe(host);
    return () => { disposed = true; lazy.disconnect(); teardown(); };
  }, []);

  const rotate = (direction) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const offset = controls.object.position.clone().sub(controls.target);
    const angle = direction * Math.PI / 6;
    const x = offset.x * Math.cos(angle) + offset.z * Math.sin(angle);
    const z = offset.z * Math.cos(angle) - offset.x * Math.sin(angle);
    controls.object.position.set(x, controls.object.position.y, z);
    controls.autoRotate = false;
    controls.update();
  };

  return <div className="headphone-viewer">
    <div className="headphone-canvas" ref={hostRef} role="img" aria-label="Mô hình tai nghe 3D minh họa, kéo để xoay" />
    {!ready && <Image src="/images/hero-headphones.svg" alt="Tai nghe minh họa" fill className="viewer-fallback" priority />}
    <span className="viewer-caption"><MoveHorizontal size={14} /> {ready ? "Kéo để khám phá mọi góc nhìn" : "Thiết kế âm thanh, từ mọi góc nhìn"}</span>
    {ready && <div className="viewer-controls"><button onClick={() => rotate(-1)} aria-label="Xoay mô hình sang trái"><RotateCcw size={16} /></button><button onClick={() => rotate(1)} aria-label="Xoay mô hình sang phải"><RotateCw size={16} /></button></div>}
  </div>;
}
