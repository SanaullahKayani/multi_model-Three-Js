
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

var scene, camera, renderer;
var mesh;
var USE_WIREFRAME = false;
var meshFloor, ambientLight, light;
// let camera, scene, renderer;
// Set Up Ground Environment
function setUpGround(size){
	const ground_texture = new THREE.TextureLoader().load('ThreeJS/textures/crate/crate0_diffuse.jpg' );
	ground_texture.wrapS = THREE.RepeatWrapping;
	ground_texture.wrapT = THREE.RepeatWrapping;
	let tSize = size*0.01;
	ground_texture.repeat.set(tSize, tSize);

	var ground_Mesh = new THREE.Mesh( 
		new THREE.PlaneGeometry(size, size),
		new THREE.MeshStandardMaterial({
			 map: ground_texture })
		);
	ground_Mesh.rotateX(-Math.PI*0.5);
	scene.add(ground_Mesh);
} 
function onWindowResize() {
	camera.aspect = (window.innerWidth) / (window.innerHeight);
	camera.updateProjectionMatrix();
	renderer.setSize( (window.innerWidth),( window.innerHeight) );
	// render();
}


function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth, window.innerHeight, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// let size = 8000;
	// setUpGround(size);
	// meshFloor = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(20,20, 10,10),
	// 	new THREE.MeshPhongMaterial({color:0x00ff00, wireframe:USE_WIREFRAME})
	// );
	// meshFloor.rotation.x -= Math.PI / 2;
	// meshFloor.receiveShadow = true;
	// scene.add(meshFloor);
	const ground_texture = new THREE.TextureLoader().load('ThreeJS/textures/crate/crate0_diffuse.jpg' );
	ground_texture.wrapS = THREE.RepeatWrapping;
	ground_texture.wrapT = THREE.RepeatWrapping;
	let tSize = size*0.01;
	ground_texture.repeat.set(8000, 8000);

	var ground_Mesh = new THREE.Mesh( 
		new THREE.PlaneGeometry(8000, 8000),
		new THREE.MeshStandardMaterial({
			 map: ground_texture })
		);
	ground_Mesh.rotateX(-Math.PI*0.5);
	scene.add(ground_Mesh);

	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color:0xff4400, wireframe:USE_WIREFRAME})
	);
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);

	
	// Add a light
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	// Set the camera position

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	animate();

	window.addEventListener( 'resize', onWindowResize );
}
window.onload = init;

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
