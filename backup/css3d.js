import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

let canvas = document.getElementById('canvas');
let camera, scene, renderer;
let controls;


init();

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );
	camera.position.set( 0, 0, 300 );
	let r = 180;
	for ( let i = 0; i < 8; i ++ ) {
		const element = document.createElement( 'a' );
		element.classList.add(`card3d-i`);
		element.classList.add(`card3d`);
		element.style.width = '2px';
		element.style.height = '128px';
        element.innerHTML = i;

		
		const object = new CSS3DObject( element );
		let angle = (Math.PI/180)*(45*i);
		object.rotation.y = angle;
		object.position.x = Math.sin(angle)*r;
		object.position.z = Math.cos(angle)*r;

		scene.add(object)
	}

	renderer = new CSS3DRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	// renderer.style.position ="absolute";
	// renderer.style.top ="0";

	// renderer.outputEncoding = THREE.sRGBEncoding;
	document.body.appendChild( renderer.domElement );
    
	controls = new OrbitControls(camera, renderer.domElement)
	controls.target.set(0, 0, 0);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.rotateSpeed = 0.5;
	controls.minPolarAngle = Math.PI / 2; 
	controls.maxPolarAngle = Math.PI / 2; 
	controls.enablePan = false; 
	window.addEventListener( 'resize', onWindowResize );
}




function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.updateProjectionMatrix();
}
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}
animate();
