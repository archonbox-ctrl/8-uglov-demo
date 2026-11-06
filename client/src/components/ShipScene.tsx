import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type ShipSceneProps = {
  /** Scroll progress. Values outside 0–1 are clamped. */
  progress?: number;
  className?: string;
  onFailure?: () => void;
};

const SECTION_COUNT = 8;
const SECTION_ANGLE = (Math.PI * 2) / SECTION_COUNT;
const PANEL_GAP = 0.015;

// Radial profile of the upper hull, from the cockpit out to the rim.
const HULL_PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.78, 0.28],
  [1.04, 0.285],
  [1.38, 0.255],
  [1.75, 0.205],
  [2.1, 0.135],
  [2.38, 0.065],
  [2.58, -0.015],
  [2.66, -0.075],
];

function hullHeight(radius: number) {
  for (let i = 1; i < HULL_PROFILE.length; i += 1) {
    const [rightRadius, rightHeight] = HULL_PROFILE[i];
    const [leftRadius, leftHeight] = HULL_PROFILE[i - 1];
    if (radius <= rightRadius) {
      const t = (radius - leftRadius) / (rightRadius - leftRadius);
      return THREE.MathUtils.lerp(leftHeight, rightHeight, t);
    }
  }
  return HULL_PROFILE[HULL_PROFILE.length - 1][1];
}

function normalizedProgress(value: number) {
  return Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 1) : 0;
}

// Each mechanism returns to its assembled position before the next one starts.
function stagePulse(progress: number, stage: number) {
  const local = THREE.MathUtils.clamp(progress * SECTION_COUNT - stage, 0, 1);
  return local === 0 || local === 1 ? 0 : Math.sin(Math.PI * local);
}

/** An individual curved skin plate. Gaps reveal the dark solid hull beneath. */
function makePanelGeometry(start: number, end: number) {
  const divisions = 16;
  const vertices: number[] = [];
  const indices: number[] = [];

  for (const [radius, height] of HULL_PROFILE) {
    for (let j = 0; j <= divisions; j += 1) {
      const angle = THREE.MathUtils.lerp(start, end, j / divisions);
      vertices.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    }
  }

  for (let i = 0; i < HULL_PROFILE.length - 1; i += 1) {
    for (let j = 0; j < divisions; j += 1) {
      const a = i * (divisions + 1) + j;
      const b = a + divisions + 1;
      // The winding faces upward.
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Opaque edges give each plate real thickness instead of a paper-thin surface. */
function makePanelEdges(start: number, end: number) {
  const vertices: number[] = [];
  const addQuad = (a: number[], b: number[], c: number[], d: number[]) => {
    vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
  };
  const point = (radius: number, height: number, angle: number) => [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius,
  ];

  for (const angle of [start, end]) {
    for (let i = 0; i < HULL_PROFILE.length - 1; i += 1) {
      const [r1, y1] = HULL_PROFILE[i];
      const [r2, y2] = HULL_PROFILE[i + 1];
      addQuad(
        point(r1, y1, angle),
        point(r2, y2, angle),
        point(r2, y2 - 0.065, angle),
        point(r1, y1 - 0.065, angle)
      );
    }
  }
  const [outerRadius, outerHeight] = HULL_PROFILE[HULL_PROFILE.length - 1];
  for (let i = 0; i < 16; i += 1) {
    const a = THREE.MathUtils.lerp(start, end, i / 16);
    const b = THREE.MathUtils.lerp(start, end, (i + 1) / 16);
    addQuad(
      point(outerRadius, outerHeight, a),
      point(outerRadius, outerHeight, b),
      point(outerRadius, outerHeight - 0.065, b),
      point(outerRadius, outerHeight - 0.065, a)
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.computeVertexNormals();
  return geometry;
}

function arcGeometry(radius: number, tube: number, start: number, end: number) {
  const geometry = new THREE.TorusGeometry(radius, tube, 8, 24, end - start);
  geometry.rotateX(Math.PI / 2);
  geometry.rotateY(-start);
  return geometry;
}

function disposeScene(scene: THREE.Scene) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  scene.traverse(object => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material) {
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        materials.add(material);
      }
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}

function createShip() {
  const ship = new THREE.Group();
  const sections: Array<{
    group: THREE.Group;
    angle: number;
    tangent: THREE.Vector3;
  }> = [];
  const ringArcs: THREE.Mesh[][] = [[], [], []];

  // Every material is opaque. Pink is limited to small lights and one inlaid ring.
  const porcelain = new THREE.MeshStandardMaterial({
    color: 0xd9d9d6,
    roughness: 0.7,
    metalness: 0.16,
  });
  const porcelainAlt = new THREE.MeshStandardMaterial({
    color: 0xc2c3c1,
    roughness: 0.75,
    metalness: 0.14,
  });
  const domeMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9e9e5,
    roughness: 0.88,
    metalness: 0.04,
  });
  const charcoal = new THREE.MeshStandardMaterial({
    color: 0x202023,
    roughness: 0.74,
    metalness: 0.18,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3d,
    roughness: 0.78,
    metalness: 0.12,
    side: THREE.DoubleSide,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x4b4b4d,
    roughness: 0.7,
    metalness: 0.25,
  });
  const silver = new THREE.MeshStandardMaterial({
    color: 0xa9aaa9,
    roughness: 0.62,
    metalness: 0.3,
  });
  const pink = new THREE.MeshStandardMaterial({
    color: 0xf3c6d5,
    emissive: 0xf3c6d5,
    emissiveIntensity: 0.28,
    roughness: 0.65,
    metalness: 0.08,
  });
  const whiteLight = new THREE.MeshStandardMaterial({
    color: 0xf4f1ef,
    emissive: 0xf4efed,
    emissiveIntensity: 0.19,
    roughness: 0.6,
  });

  // A dark, continuous lower body is visible in the seams and from below.
  const lowerProfile = [
    [0, -0.57],
    [0.38, -0.57],
    [0.85, -0.54],
    [1.28, -0.49],
    [1.75, -0.43],
    [2.18, -0.35],
    [2.48, -0.29],
    [2.66, -0.24],
    [2.66, -0.055],
    [2.5, -0.025],
    [2.1, 0.07],
    [1.65, 0.145],
    [1.18, 0.215],
    [0.78, 0.225],
    [0, 0.225],
  ].map(([radius, height]) => new THREE.Vector2(radius, height));
  ship.add(new THREE.Mesh(new THREE.LatheGeometry(lowerProfile, 96), charcoal));

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(2.625, 0.045, 10, 128),
    graphite
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.1;
  ship.add(rim);

  // The three concentric inlays are split at the same seams as the eight plates,
  // so they move with their own section instead of floating over the ship.
  const ringSpecs = [
    { radius: 1.12, tube: 0.025, material: graphite },
    { radius: 1.73, tube: 0.022, material: graphite },
    { radius: 2.32, tube: 0.022, material: pink },
  ];

  const ventHousingGeometry = new THREE.BoxGeometry(0.31, 0.035, 0.16);
  const ventSlatGeometry = new THREE.BoxGeometry(0.025, 0.015, 0.12);
  const markerGeometry = new THREE.CylinderGeometry(0.032, 0.032, 0.018, 12);
  const boltGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.016, 12);

  for (let i = 0; i < SECTION_COUNT; i += 1) {
    const angle = i * SECTION_ANGLE;
    const start = angle - SECTION_ANGLE / 2 + PANEL_GAP;
    const end = angle + SECTION_ANGLE / 2 - PANEL_GAP;
    const group = new THREE.Group();
    group.add(
      new THREE.Mesh(
        makePanelGeometry(start, end),
        i % 2 ? porcelainAlt : porcelain
      )
    );
    group.add(new THREE.Mesh(makePanelEdges(start, end), edgeMaterial));

    for (const [ringIndex, { radius, tube, material }] of ringSpecs.entries()) {
      const ring = new THREE.Mesh(
        arcGeometry(radius, tube, start, end),
        material
      );
      ring.position.y = hullHeight(radius) + 0.015;
      group.add(ring);
      ringArcs[ringIndex].push(ring);
    }

    // Small flush hardware catches light without relying on textures or bloom.
    const housingRadius = 1.43;
    const housing = new THREE.Mesh(ventHousingGeometry, charcoal);
    housing.position.set(
      Math.cos(angle) * housingRadius,
      hullHeight(housingRadius) + 0.025,
      Math.sin(angle) * housingRadius
    );
    housing.rotation.y = -angle;
    group.add(housing);
    for (let j = -2; j <= 2; j += 1) {
      const slatRadius = housingRadius + j * 0.053;
      const slat = new THREE.Mesh(ventSlatGeometry, silver);
      slat.position.set(
        Math.cos(angle) * slatRadius,
        hullHeight(housingRadius) + 0.049,
        Math.sin(angle) * slatRadius
      );
      slat.rotation.y = -angle;
      group.add(slat);
    }

    const markerRadius = 2.49;
    const marker = new THREE.Mesh(
      markerGeometry,
      i % 2 === 0 ? whiteLight : pink
    );
    marker.position.set(
      Math.cos(angle) * markerRadius,
      hullHeight(markerRadius) + 0.018,
      Math.sin(angle) * markerRadius
    );
    group.add(marker);

    for (const offset of [-0.22, 0.22]) {
      const boltRadius = 2.16;
      const boltAngle = angle + offset;
      const bolt = new THREE.Mesh(boltGeometry, graphite);
      bolt.position.set(
        Math.cos(boltAngle) * boltRadius,
        hullHeight(boltRadius) + 0.012,
        Math.sin(boltAngle) * boltRadius
      );
      group.add(bolt);
    }

    ship.add(group);
    sections.push({
      group,
      angle,
      tangent: new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)),
    });
  }

  // Solid cockpit and layered collar: deliberately matte, never transparent.
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.83, 0.88, 0.12, 64),
    graphite
  );
  collar.position.y = 0.29;
  ship.add(collar);
  const collarRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.025, 8, 96),
    silver
  );
  collarRim.rotation.x = Math.PI / 2;
  collarRim.position.y = 0.355;
  ship.add(collarRim);
  const cockpit = new THREE.Group();
  ship.add(cockpit);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.77, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    domeMaterial
  );
  dome.position.y = 0.35;
  dome.scale.y = 0.72;
  cockpit.add(dome);

  // An antenna with a small illuminated tip and a stepped mechanical base.
  const antennaGroup = new THREE.Group();
  antennaGroup.position.y = 0.92;
  cockpit.add(antennaGroup);
  const antennaBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.105, 0.13, 0.07, 24),
    graphite
  );
  antennaGroup.add(antennaBase);
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.028, 0.54, 16),
    silver
  );
  antenna.position.y = 0.295;
  antennaGroup.add(antenna);
  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 12),
    pink
  );
  antennaTip.position.y = 0.58;
  antennaGroup.add(antennaTip);
  const signalRings = [0.2, 0.32].map(radius => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012, 6, 48),
      pink
    );
    ring.rotation.x = Math.PI / 2;
    antennaGroup.add(ring);
    return ring;
  });

  // The core is hidden by the solid dome when the ship is assembled.
  const core = new THREE.Group();
  const coreBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.39, 0.43, 0.08, 40),
    charcoal
  );
  core.add(coreBase);
  const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.21, 28, 20), pink);
  coreOrb.position.y = 0.2;
  core.add(coreOrb);
  const coreRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.025, 8, 48),
    silver
  );
  coreRim.rotation.x = Math.PI / 2;
  coreRim.position.y = 0.1;
  core.add(coreRim);
  const coreFlaps = Array.from({ length: 4 }, (_, index) => {
    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(0.27, 0.055, 0.2),
      porcelainAlt
    );
    core.add(flap);
    return { flap, angle: (index * Math.PI) / 2 };
  });
  ship.add(core);

  // Four compact thrusters deploy from the underside of the outer rim.
  const engineBodyGeometry = new THREE.CylinderGeometry(0.14, 0.18, 0.2, 20);
  const engineCapGeometry = new THREE.CylinderGeometry(0.11, 0.11, 0.025, 20);
  const engineArmGeometry = new THREE.BoxGeometry(0.48, 0.055, 0.08);
  const exhaustGeometry = new THREE.ConeGeometry(0.1, 0.45, 16);
  exhaustGeometry.rotateX(Math.PI);
  const engines = Array.from({ length: 4 }, (_, index) => {
    const angle = (index * Math.PI) / 2 + Math.PI / 4;
    const group = new THREE.Group();
    group.add(new THREE.Mesh(engineBodyGeometry, graphite));
    const cap = new THREE.Mesh(engineCapGeometry, silver);
    cap.position.y = 0.11;
    group.add(cap);
    const exhaust = new THREE.Mesh(exhaustGeometry, pink);
    exhaust.position.y = -0.3;
    group.add(exhaust);
    const arm = new THREE.Mesh(engineArmGeometry, silver);
    arm.rotation.y = -angle;
    ship.add(arm);
    ship.add(group);
    return { group, exhaust, arm, angle };
  });

  // Opaque raised armour plates read as shields rather than glass bubbles.
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(-0.27, -0.42);
  shieldShape.lineTo(0.16, -0.42);
  shieldShape.lineTo(0.27, -0.3);
  shieldShape.lineTo(0.27, 0.3);
  shieldShape.lineTo(0.16, 0.42);
  shieldShape.lineTo(-0.27, 0.42);
  shieldShape.closePath();
  const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.07,
    bevelEnabled: false,
  });
  shieldGeometry.rotateX(Math.PI / 2);
  const shieldStripeGeometry = new THREE.BoxGeometry(0.035, 0.014, 0.78);
  const shields = Array.from({ length: SECTION_COUNT }, (_, index) => {
    const angle = index * SECTION_ANGLE;
    const group = new THREE.Group();
    group.add(new THREE.Mesh(shieldGeometry, porcelainAlt));
    const stripe = new THREE.Mesh(shieldStripeGeometry, pink);
    stripe.position.y = 0.008;
    group.add(stripe);
    group.rotation.y = -angle;
    ship.add(group);
    return { group, angle };
  });

  // A solid, slender signal beam, not a transparent cone or post-effect.
  const beam = new THREE.Group();
  const beamShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.065, 0.95, 16),
    pink
  );
  beamShaft.position.y = 0.475;
  beam.add(beamShaft);
  for (const height of [0.32, 0.68]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.012, 6, 36),
      whiteLight
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = height;
    beam.add(ring);
  }
  beam.position.y = -0.64;
  beam.rotation.z = Math.PI;
  ship.add(beam);

  // A restrained underside core gives the silhouette some depth from low angles.
  const bottomCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.52, 0.09, 48),
    graphite
  );
  bottomCore.position.y = -0.57;
  ship.add(bottomCore);
  const bottomAccent = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.025, 8, 64),
    pink
  );
  bottomAccent.rotation.x = Math.PI / 2;
  bottomAccent.position.y = -0.619;
  ship.add(bottomAccent);

  const update = (progress: number) => {
    const antennaPhase = stagePulse(progress, 0);
    const portholePhase = stagePulse(progress, 1);
    const corePhase = stagePulse(progress, 2);
    const gyroPhase = stagePulse(progress, 3);
    const enginePhase = stagePulse(progress, 5);
    const shieldPhase = stagePulse(progress, 6);
    const beamPhase = stagePulse(progress, 7);

    antenna.scale.y = 1 + antennaPhase;
    antenna.position.y = 0.295 + antennaPhase * 0.27;
    antennaTip.position.y = 0.58 + antennaPhase * 0.54;
    signalRings.forEach((ring, index) => {
      ring.visible = antennaPhase > 0.01;
      ring.position.y = antennaTip.position.y - 0.1 - index * 0.12;
      ring.scale.setScalar(0.65 + 0.5 * antennaPhase);
    });

    const cockpitPhase = Math.max(portholePhase * 0.7, corePhase);
    cockpit.position.set(
      -0.75 * cockpitPhase,
      0.47 * cockpitPhase,
      -0.25 * cockpitPhase
    );
    core.visible = cockpitPhase > 0.01;
    core.position.y = 0.4 + 0.17 * corePhase;
    coreOrb.scale.setScalar(0.65 + 0.45 * corePhase);
    coreFlaps.forEach(({ flap, angle }) => {
      flap.visible = corePhase > 0.01;
      const radius = 0.32 + 0.25 * corePhase;
      flap.position.set(
        Math.cos(angle) * radius,
        0.12 + 0.1 * corePhase,
        Math.sin(angle) * radius
      );
      flap.rotation.y = -angle;
      flap.rotation.z = 0.28 * corePhase;
    });

    ringArcs.forEach((arcs, ringIndex) => {
      const lift = [0.16, 0.27, 0.38][ringIndex];
      const twist = [0.18, -0.23, 0.28][ringIndex];
      arcs.forEach(ring => {
        ring.position.y =
          hullHeight(ringSpecs[ringIndex].radius) + 0.015 + lift * gyroPhase;
        ring.rotation.y = twist * gyroPhase;
      });
    });

    // Open the panels in stage five and bring them back together in stage eight.
    const hullLocal = progress * SECTION_COUNT - 4;
    const reassemble = THREE.MathUtils.clamp(progress * SECTION_COUNT - 7, 0, 1);
    sections.forEach(({ group, angle, tangent }, index) => {
      const local = THREE.MathUtils.clamp(
        (hullLocal - index * 0.025) / 0.82,
        0,
        1
      );
      const smooth = local * local * (3 - 2 * local);
      const amount = smooth * (1 - reassemble);
      group.position.set(
        Math.cos(angle) * 0.34 * amount,
        0.075 * amount,
        Math.sin(angle) * 0.34 * amount
      );
      group.quaternion.setFromAxisAngle(tangent, 0.045 * amount);
    });

    engines.forEach(({ group, exhaust, arm, angle }) => {
      const radius = 2.53 + 0.35 * enginePhase;
      group.position.set(
        Math.cos(angle) * radius,
        -0.16 - 0.08 * enginePhase,
        Math.sin(angle) * radius
      );
      exhaust.visible = enginePhase > 0.01;
      exhaust.scale.y = Math.max(0.001, enginePhase);
      arm.visible = enginePhase > 0.01;
      arm.scale.x = Math.max(0.001, enginePhase);
      const armRadius = 2.55 + 0.16 * enginePhase;
      arm.position.set(Math.cos(angle) * armRadius, -0.18, Math.sin(angle) * armRadius);
    });
    shields.forEach(({ group, angle }) => {
      const radius = 2.42 + 0.38 * shieldPhase;
      group.visible = shieldPhase > 0.01;
      group.position.set(
        Math.cos(angle) * radius,
        0.05 + 0.43 * shieldPhase,
        Math.sin(angle) * radius
      );
      group.rotation.z = 0.15 * shieldPhase;
    });
    beam.visible = beamPhase > 0.01;
    beam.scale.y = Math.max(0.001, beamPhase);
  };

  update(0);
  return { ship, update };
}

const fallbackStyles = `
  :where(.uglov-ship-scene) { position: relative; width: 100%; height: 100%; min-height: 260px; overflow: hidden; }
  :where(.uglov-ship-scene canvas) { display: block; width: 100%; height: 100%; }
  :where(.uglov-ship-fallback) { position: absolute; inset: 0; overflow: hidden; color: #777276; }
  :where(.uglov-ship-fallback-art) { position: absolute; left: 50%; top: 46%; width: min(88%, 440px); aspect-ratio: 1.8; transform: translate(-50%, -50%) rotate(-5deg); }
  :where(.uglov-ship-fallback-hull) { position: absolute; left: 5%; top: 49%; width: 90%; height: 33%; border: 2px solid #4a484b; border-radius: 50%; background: linear-gradient(180deg, #f1f0ee 2%, #bdbdbb 44%, #535154 47%, #242326 70%, #777477 100%); box-shadow: 0 11px 0 -7px #302e31, 0 19px 22px -19px #201d20; }
  :where(.uglov-ship-fallback-panel) { position: absolute; left: 5%; top: 49%; width: 90%; height: 20%; border-radius: 50%; background: repeating-conic-gradient(from 0deg, transparent 0deg 43deg, #464449 44deg 45deg); opacity: .7; }
  :where(.uglov-ship-fallback-ring) { position: absolute; left: 50%; border: 1px solid #555257; border-radius: 50%; transform: translateX(-50%); }
  :where(.uglov-ship-fallback-ring-one) { top: 50%; width: 31%; height: 9%; }
  :where(.uglov-ship-fallback-ring-two) { top: 50%; width: 54%; height: 13%; }
  :where(.uglov-ship-fallback-ring-three) { top: 51%; width: 76%; height: 18%; border-color: #dbacbd; }
  :where(.uglov-ship-fallback-dome) { position: absolute; left: 35%; top: 27%; width: 30%; height: 28%; border: 2px solid #68666a; border-radius: 50% 50% 20% 20% / 95% 95% 20% 20%; background: linear-gradient(145deg, #f4f3f0, #c5c4c2); box-shadow: 0 5px 0 -1px #38363a; }
  :where(.uglov-ship-fallback-antenna) { position: absolute; left: calc(50% - 1px); top: 8%; width: 2px; height: 20%; background: #5e5a5e; }
  :where(.uglov-ship-fallback-antenna::before) { content: ''; position: absolute; left: -3px; top: -5px; width: 8px; height: 8px; border-radius: 50%; background: #f3c6d5; }
  :where(.uglov-ship-fallback-caption) { position: absolute; bottom: 7%; left: 50%; transform: translateX(-50%); width: max-content; max-width: calc(100% - 2rem); padding: 6px 10px; border-radius: 999px; background: #29272a; color: #f2eff0; text-align: center; font: 12px/1.4 system-ui, sans-serif; letter-spacing: .01em; }
`;

export function ShipScene({
  progress = 0,
  className,
  onFailure,
}: ShipSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(normalizedProgress(progress));
  const requestRenderRef = useRef<(() => void) | null>(null);
  const onFailureRef = useRef(onFailure);
  const failureReportedRef = useRef(false);
  onFailureRef.current = onFailure;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || failed) return;

    let active = true;
    let frame = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let observer: ResizeObserver | undefined;
    const scene = new THREE.Scene();
    let canvas: HTMLCanvasElement | undefined;
    let onContextLost: ((event: Event) => void) | undefined;
    let onResize: (() => void) | undefined;
    const reportFailure = () => {
      if (!active || failureReportedRef.current) return;
      failureReportedRef.current = true;
      setFailed(true);
      onFailureRef.current?.();
    };

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      container.appendChild(canvas);

      const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 50);
      camera.position.set(7.5, 5.4, 9);
      camera.lookAt(0, 0.12, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x777477, 2.0));
      const key = new THREE.DirectionalLight(0xffffff, 2.3);
      key.position.set(-4, 8, 6);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xf3c6d5, 0.85);
      fill.position.set(5, 3, -4);
      scene.add(fill);
      const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
      rimLight.position.set(-5, 2, -6);
      scene.add(rimLight);

      const { ship, update } = createShip();
      ship.rotation.y = 0.14;
      scene.add(ship);

      let lastWidth = 0;
      let lastHeight = 0;
      let lastDpr = 0;
      const draw = () => {
        frame = 0;
        if (!active || !renderer) return;
        try {
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width <= 0 || height <= 0) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (width !== lastWidth || height !== lastHeight || dpr !== lastDpr) {
            lastWidth = width;
            lastHeight = height;
            lastDpr = dpr;
            renderer.setPixelRatio(dpr);
            renderer.setSize(width, height, false);
            const aspect = width / height;
            const viewHeight = Math.max(4.8, 7.25 / aspect);
            camera.left = (-viewHeight * aspect) / 2;
            camera.right = (viewHeight * aspect) / 2;
            camera.top = viewHeight / 2;
            camera.bottom = -viewHeight / 2;
            camera.updateProjectionMatrix();
          }

          update(progressRef.current);
          renderer.render(scene, camera);
        } catch {
          reportFailure();
        }
      };
      const requestRender = () => {
        if (active && !frame) frame = window.requestAnimationFrame(draw);
      };
      requestRenderRef.current = requestRender;
      onResize = requestRender;
      window.addEventListener("resize", onResize);
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(requestRender);
        observer.observe(container);
      }
      onContextLost = (event: Event) => {
        event.preventDefault();
        reportFailure();
      };
      canvas.addEventListener("webglcontextlost", onContextLost);
      requestRender();
    } catch {
      reportFailure();
    }

    return () => {
      active = false;
      requestRenderRef.current = null;
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (onResize) window.removeEventListener("resize", onResize);
      if (canvas && onContextLost)
        canvas.removeEventListener("webglcontextlost", onContextLost);
      disposeScene(scene);
      renderer?.dispose();
      renderer?.forceContextLoss();
      if (canvas?.parentNode === container) container.removeChild(canvas);
    };
  }, [failed]);

  useEffect(() => {
    progressRef.current = normalizedProgress(progress);
    requestRenderRef.current?.();
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className={["uglov-ship-scene", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={
        failed
          ? "3D-модель недоступна, показана упрощённая схема корабля"
          : "Футуристический корабль с восьмью секциями"
      }
    >
      <style>{fallbackStyles}</style>
      {failed && (
        <div className="uglov-ship-fallback" aria-hidden="true">
          <div className="uglov-ship-fallback-art">
            <div className="uglov-ship-fallback-hull" />
            <div className="uglov-ship-fallback-panel" />
            <div className="uglov-ship-fallback-ring uglov-ship-fallback-ring-one" />
            <div className="uglov-ship-fallback-ring uglov-ship-fallback-ring-two" />
            <div className="uglov-ship-fallback-ring uglov-ship-fallback-ring-three" />
            <div className="uglov-ship-fallback-dome" />
            <div className="uglov-ship-fallback-antenna" />
          </div>
          <div className="uglov-ship-fallback-caption">
            3D-модель недоступна на этом устройстве
          </div>
        </div>
      )}
    </div>
  );
}

export default ShipScene;
