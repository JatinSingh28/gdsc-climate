import * as THREE from "https://unpkg.com/three@0.145.0/build/three.module.js";
// import vertexShader from './shaders/vertex.glsl'
// var vertexShader = require(`webpack-glsl!./shaders/vertex.glsl`;
import gsap from "gsap";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

import atmosphereVertexShader from "../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../shaders/atmosphereFragment.glsl";
import globeimg from "../img/Globe.jpg";

// import { Float32BufferAttribute } from "three";

// console.log(vertexShader);

const canvasContainer = document.querySelector("#canvasContainer");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);
// console.log(scene);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas"),
});

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

//create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    // color: 0xff0000,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load(globeimg),
      },
    },
    // map: new THREE.TextureLoader().load("./img/Globe.jpg"),
  })
);

//create atmosphere

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.15, 1.15, 1.15);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -(Math.random() * 3000);
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
// console.log(stars)
scene.add(stars);

camera.position.z = 12;

const mouse = {
  x: 1,
  y: 1,
};

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  // console.log(mouse);
});

// addEventListener("mousedown ", (event) => {
//   mouse.x = (event.clientX / innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / innerHeight) * 2 + 1;
//   console.log(mouse);
// });

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.009;
  // group.rotation.y = mouse.x * 0.3;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.9,
    y: mouse.x * 0.9,
    duration: 2,
  });
}
animate();
