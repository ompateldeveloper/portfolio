import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Lensflare,LensflareElement } from 'three/addons/objects/Lensflare.js';

 const canvas = document.querySelector("#canvas");

let camera, scene, renderer, cube, ring1, ring2, ring3, pointlight, line;
let a, b, c, d, e, f, g, h, bg, loader;
let renderScene, composer, bloomPass;
// const vertexShader = `
//   varying vec2 vUv;

//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const fragmentShader = `
//   varying vec2 vUv;

//   void main() {
//     gl_FragColor = vec4(vUv.x, vUv.y, 0.5, 1.0);
//   }
// `;
// let controls = new OrbitControls(camera,renderer);

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.toneMapping = THREE.CineonToneMapping;
  document.body.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  // cube = new THREE.Mesh(
  //     new THREE.IcosahedronGeometry(40,0),
  //     new THREE.ShaderMaterial({
  //         vertexShader: vertexShader,
  //         fragmentShader: fragmentShader,
  //         wireframe:true
  //     })
  //     // new THREE.MeshPhongMaterial({
  //     // 	color:0xff00ff,
  //     //   wireframe:true
  //     // })
  // );

  // -----------------------------------------Magic circles------------------------------------
  // scene.add(cube);
  ring1 = new THREE.Mesh(
    new THREE.RingGeometry(10, 15, 32),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('./backup/pngfind.png'),
      side: THREE.DoubleSide,
      transparent: true,
    })
  );
  scene.add( ring1 );
  ring2 = new THREE.Mesh(
    new THREE.RingGeometry(17, 22, 38),
     new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('./backup/pngfind.png'),
      side: THREE.DoubleSide,
      transparent: true,
    })
  );
  scene.add( ring2 );



  // ring3 = new THREE.Mesh(
  //   new THREE.CylinderGeometry(15, 15, 1, 48, 1,true),
  //   new THREE.MeshBasicMaterial({
  //     // color:0xff00ff,
  //     map: new THREE.TextureLoader().load('./pngfind.png'),
  //     // map: texture,
  //     side: THREE.DoubleSide,
  //     transparent: true,
  //   })
  // );
  // scene.add(ring3);


  loader = new THREE.TextureLoader();
  const envTexture = loader.load("assets/sunset.jpg");
  envTexture.mapping = THREE.EquirectangularRefractionMapping;

  bg = new THREE.Mesh(
    new THREE.PlaneGeometry(window.innerWidth / 4, window.innerHeight / 4),
    new THREE.MeshPhongMaterial({
      // map: loader.load("assets/sunset.jpg"),
      map: envTexture,
    })
  );
  bg.translateZ(-200);
  // scene.add(bg)

  a = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3, 0),
    new THREE.MeshPhysicalMaterial(
      {
        color:new THREE.Color(1,1,1),
        clearcoat:0.8,
        ior:3.15,
        specularIntensity:0.6,
        roughness:0.1,
        thickness:1.5,
        transmission:1.0,
        envMap:envTexture,
      }
    )
  );
  a.castShadow = true;
  scene.add(a);

  pointlight = new THREE.PointLight(0xffffff, 0.5);
  pointlight.position.set(0, 0, -20);
  pointlight.add(
  	new THREE.Mesh(
  		new THREE.SphereGeometry(2,20,20),
  		new THREE.MeshBasicMaterial( { color: 0xffffff } )
  	)
  )
  scene.add(pointlight);
  camera.position.set(0, 0, 70);
  renderScene = new RenderPass(scene, camera);
  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    1,
    0
  );
  composer.addPass(bloomPass)
  // const testpass = new DotScreenPass();



// -----------------------------------------flare ------------------------
  // const textureLoader = new THREE.TextureLoader();  
  // const textureFlare0 = textureLoader.load( '/assets/lensflare0.png' );
  // const textureFlare3 = textureLoader.load( '/assets/lensflare3.png' );

  // addLight( 0.55, 0.9, 0.5, 0, 0, 0 );

  // function addLight( h, s, l, x, y, z ) {

  //   const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
  //   light.color.setHSL( h, s, l );
  //   light.position.set( x, y, z );
  //   scene.add( light );

  //   const lensflare = new Lensflare();
  //   lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
  //   lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
  //   lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
  //   lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
  //   lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
  //   light.add( lensflare );

  // }
  // composer.addPass( testpass );
  // const glitchPass = new GlitchPass();
  // composer.addPass( glitchPass );
  // composer.setClearColor(0x000000,1);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);

// window.addEventListener("mousemove",mousemove)

function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.001;
  // a.rotation.x += 0.001;
  a.rotation.y += 0.005;
  // cube.rotation.y += 0.001;
  // circle.rotation.x +=0.01;

  ring1.rotation.x += 0.003;
  ring1.rotation.y+=0.001;
  ring1.rotation.z += 0.003;

  ring2.rotation.x+=0.002;
  ring2.rotation.y+=0.002;
  ring2.rotation.z -= 0.002;

  // ring3.rotation.x = 20;
  // ring3.rotation.y += 0.001;
  // ring3.rotation.z += 0.01;
  // line.rotation.y += 0.01;
  // renderer.render(scene, camera);
  composer.render(scene, camera);
}
animate();
