import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Lensflare,LensflareElement } from 'three/addons/objects/Lensflare.js';
let controls;

let camera, scene, renderer, flareLight,directionalLight;
let renderScene, composer, bloomPass;
let a, b, c, d, e,stars, loader,envTexture;

init();

function init() {
  // Scene, Camera, Renderer--------------------------------
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 70);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

  // controls--------------------
    controls = new OrbitControls(camera, renderer.domElement);

    loader = new THREE.TextureLoader();
    envTexture = loader.load("assets/sunset-min.jpg" );
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
   
    addMain();
    addStars();
    addLight();
    window.addEventListener("resize", resize);
    animate();

}
function addMain(){
    a = new THREE.Mesh(
        new THREE.IcosahedronGeometry(10, 0),
        new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(1, 1, 1),
            clearcoat: 0.8,
            ior: 1.15,
            specularIntensity: 0.6,
            roughness: 0.1,
            thickness: 1.5,
            transmission: 1.0,
            envMap: envTexture,
        })
    );
    b = new THREE.Mesh(
        new THREE.IcosahedronGeometry(15, 0),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color(1, 1, 1),
            wireframe: true,
        })
    );
    const icosahedronGeometry = new THREE.IcosahedronGeometry(10.1, 0);
    const edgesGeometry = new THREE.EdgesGeometry(icosahedronGeometry);

    const lineMaterial = new THREE.ShaderMaterial({
        vertexShader: 
        `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: 
        `
            uniform float u_time;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(sin(u_time), cos(u_time), 0.5, 1.0); // Adjust the color logic as you like
            }
        `,
        uniforms: {
            u_time: { value: 0.0 }
        }
    });

    c = new THREE.LineSegments(edgesGeometry, lineMaterial);
    scene.add(a);
    scene.add(b);
    // scene.add(c);
}


function addStars(){
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 2 });
    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}
    
function addLight(){
    directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(0, 0, 100);
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
}
function addFlare(){
    const textureLoader = new THREE.TextureLoader();  
    const textureFlare0 = textureLoader.load( '/assets/lensflare0.png' );
    const textureFlare3 = textureLoader.load( '/assets/lensflare3.png' );
    flareLight = new THREE.DirectionalLight(0xffffff, 4);
    flareLight.position.set(0, 200, -900);
    scene.add(flareLight);
    const lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare0, 50, 0, flareLight.color ) );
    flareLight.add( lensflare );
}

function addRenderPass(){
    renderScene = new RenderPass(scene, camera);
    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    
    const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
    );
    composer.addPass(outlinePass);
    outlinePass.visibleEdgeColor.set(0xffffff); 
    outlinePass.hiddenEdgeColor.set(0x000000); 
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = 1.0; 
    outlinePass.edgeStrength = 2.0;
}
// Re:size handler
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    a.rotation.y += 0.0009;
    c.rotation.y += 0.009;
    b.rotation.y += 0.0005;
    b.rotation.z -= 0.0005;
    stars.rotation.y+=0.0004;
    // flareLight.rotation.y-=0.0004;
    controls.update();
    renderer.render(scene,camera)
    // composer.render(scene, camera);
}
