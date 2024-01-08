import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const clock = new THREE.Clock();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set( 0 ,0, 50);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const spotLight = new THREE.SpotLight(new THREE.Color(0xF7FD04), 0.8, 15, 4);
spotLight.position.x = 5;
spotLight.position.y = 5;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
scene.add(spotLight);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x201F21);
window.addEventListener('resize', onWindowResize);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 2;
// controls.maxDistance = 20;
controls.update();

let sphere, icosahedron;

const loader = new THREE.TextureLoader();

const envTexture = loader.load("assets/sunset.jpg");
envTexture.mapping = THREE.EquirectangularReflectionMapping;

const backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(window.innerWidth/4, window.innerHeight/4),
    new THREE.MeshPhongMaterial({
        map: loader.load('assets/sunset.jpg')
    })
);
backgroundMesh.receiveShadow = true;
backgroundMesh.translateZ(-200)
scene.add(backgroundMesh);

function initGlassObject() {
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        envMap: envTexture,
    });
    glassMaterial.color = new THREE.Color( 1,1,1);
    glassMaterial.clearcoat = 0.8;
    glassMaterial.ior = 1;
    glassMaterial.specularIntensity = 2;
    glassMaterial.roughness = 0.0;
    glassMaterial.thickness = 5;
    glassMaterial.transmission = 1.0;

    icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(5, 0), glassMaterial);
    // icosahedron.position.z = 10;
    // icosahedron.position.x = 4;
    // icosahedron.position.y = 3;
    icosahedron.castShadow = true;
    scene.add(icosahedron);
}
initGlassObject();

animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    const delta = clock.getDelta();

    if (icosahedron) {
        icosahedron.rotation.x -= delta * 0.2;
        icosahedron.rotation.z -= delta * 0.2;
    }

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
