// Set up scene
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
let material, scene, camera, renderer,clock,controls;
init()
function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    clock = new THREE.Clock()
    controls = new OrbitControls(camera,renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.rotateSpeed = 0.35;
}
// Custom shaders
const loader = new THREE.TextureLoader();
const envTexture = loader.load("/backup/sunset.jpg");
envTexture.mapping = THREE.EquirectangularRefractionMapping;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./backup/sunset.jpg');


function WavingPlane() {
    const planeWidth =5;
    const planeAspect = 16/9
    const geometry = new THREE.PlaneGeometry(planeWidth, (planeWidth/planeAspect), 50, 50);
    material = new CustomShaderMaterial({
        baseMaterial: THREE.MeshPhysicalMaterial,
        color: 0xff0000,
        metalness: 0.9,
        roughness: 0.4,
        clearcoat: 1.0,
        transmission: 0.5,
        reflectivity: 0.5,
        side: THREE.DoubleSide,
        uniforms: {
          u_time: { value: 0 },
          u_mouse: { value: 0 },
          u_resolution: { value: 0 },
        },
        vertexShader: /* glsl */ `
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform vec2 u_resolution;
            varying vec2 vUv;

            void main() {
              vUv = uv;
              vec3 pos = position;
              pos.z += sin(pos.x * 3.0 + u_time) * 0.1;
              csm_Position = pos;
            }
        `
    });

    const plane = new THREE.Mesh(geometry, material);
    return plane;
}

// Usage
const wavingPlane = WavingPlane();
scene.add(wavingPlane)
scene.add(new THREE.AmbientLight(0xffffff));

const pointlight = new THREE.PointLight(0xffffff, 0.5);
pointlight.position.set(0, 10, 10);
pointlight.add(
    new THREE.Mesh(
        new THREE.SphereGeometry(2,20,20),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    )
)
scene.add(pointlight);

// Set up camera position
camera.position.z = 5;

// Animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Update time in shader
  controls.update()
  material.uniforms.u_time.value = clock.getElapsedTime()

  renderer.render(scene, camera);
};
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX ;
    const mouseY = - event.clientY ;  
    material.uniforms.u_mouse.value = new THREE.Vector2(mouseX, mouseY);
});
window.addEventListener('resize', () => {
    material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});
  
  // Set initial resolution
material.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

animate();
