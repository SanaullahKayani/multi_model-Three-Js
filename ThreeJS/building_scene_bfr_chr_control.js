
import * as THREE from 'three';
// import MouseMeshInteraction from './three_mmi.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// import { Interaction } from '../node_modules/three.interaction';
// import Stats from 'three/examples/jsm/libs/stats.module'
// import { GUI } from 'dat.gui'

var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light, light2, light3;

var crate, crateTexture, crateNormalMap, crateBumpMap;
var character;
var keyboard = {};
var player = { height:5.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

var raycaster, mouse;
var skybox;
var loadingScreen = {
	scene: new THREE.Scene(),
	// camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
	camera: new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 100),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;
// Meshes index
var meshes = {};

var models = {
	B3: {
		glb:"building_3.glb",
		// glb:"B5_fixed.glb",
		model_mesh: null,
		dimensions_x : 0,
		dimensions_y : 13,
		dimensions_z : 0
	}
	,
	RCBuildingShowcase: {
		glb:"RC_Building_Showcase_woL.glb",
		model_mesh: 'ground',
		dimensions_x : 0,
		dimensions_y : 0,
		dimensions_z : 0
	}
	,
	soldier: {
		glb:"soldier.glb",
		model_mesh: null,
		dimensions_x : 55,
		dimensions_y : 1,
		dimensions_z : 15
	},
	skybox: {
		glb:"skybox2_meshShowcase.glb",
		model_mesh: 'ground',
		dimensions_x : 0,
		dimensions_y : -10,
		dimensions_z : 0
	}
	
};

//Set Up Ground Environment
function setUpGround(size){
	const ground_texture = new THREE.TextureLoader().load('ThreeJS/textures/crate/ground.jpg' );
	// const ground_texture = new THREE.TextureLoader().load('ThreeJS/textures/crate/background2.jpg' );
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
function addLights(){
	ambientLight = new THREE.AmbientLight(0xffffff, 1);
	
	light =  new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(10,135,10); 
	
	// light2 =  new THREE.DirectionalLight(0xffffff, 1);
	// light2.position.set(-10,135,-10); 

	// light3 =  new THREE.DirectionalLight(0xffffff, 1);
	// light3.position.set(20,40,20); 

}
function applySkybox(){

	var loader = new THREE.CubeTextureLoader();
	loader.setPath( 'ThreeJS/textures/crate/' );
	var textureCube = loader.load( [
		'bluecloud_lf.jpg', 'bluecloud_rt.jpg',
		'bluecloud_dn.jpg', 'bluecloud_up.jpg',
		'bluecloud_ft.jpg', 'bluecloud_bk.jpg'

	] );

	var skyboxShader = THREE.ShaderLib[ "cube" ];
	skyboxShader.uniforms[ "tCube" ].value = textureCube;

	var skyboxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: skyboxShader.fragmentShader,
		vertexShader: skyboxShader.vertexShader,
		uniforms: skyboxShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );
	var skyboxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
	skybox = new THREE.Mesh( skyboxGeometry, skyboxMaterial );
}
function characterMovementcontrol(){
	// character movement
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	 character = new THREE.Mesh(geometry, material);

	// Set the initial position of the character
	character.position.set(0, 0, 40);
	document.addEventListener('keydown', (event) => {
		switch (event.key) {
		case 'ArrowUp':
			character.translateZ(-1);
			break;
		case 'ArrowDown':
			character.translateZ(1);
			break;
		case 'ArrowLeft':
			character.rotateY(Math.PI / 4);
			break;
		case 'ArrowRight':
			character.rotateY(-Math.PI / 4);
			break;
		}
	});
// character movement END
}

function init(){
	scene = new THREE.Scene();
	// camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	camera = new THREE.PerspectiveCamera(90,(window.innerWidth) / (window.innerHeight), 0.1, 1000);
	
	
	const gridHelper = new THREE.GridHelper(250, 20);
	scene.add(gridHelper);

	const axesHelper = new THREE.AxesHelper( 200 );
	scene.add( axesHelper );
	
	raycaster = new THREE.Raycaster();
  	mouse = new THREE.Vector2()

	loadingScreen.box.position.set(0,0,0);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};

	
	applySkybox();
	scene.add( skybox );

	// characterMovementcontrol();
	// scene.add(character);
	
	// create a mesh with a geometry and material
	// var geometry = new THREE.BoxGeometry(5, 5, 5);
	// var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	// var mesh = new THREE.Mesh(geometry, material);
	// mesh.name = 'pointermesh';
	// mesh.position.set(40, 40, 40);
	// // add the mesh to the scene
	// scene.add(mesh);


	// let size = 8000;
	// setUpGround(size);
	
	addLights();
	scene.add(ambientLight);
	scene.add(light);
	// scene.add(light2);
	// scene.add(light3);
	
	
	const sphereSize = 1;
	const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
	scene.add( pointLightHelper )

	const gui = new dat.GUI();
	const cubeFolder = gui.addFolder('Cube')
		// cubeFolder.add(mesh.rotation, 'x', 0, Math.PI * 2)
		// cubeFolder.add(mesh.rotation, 'y', 0, Math.PI * 2)
		// cubeFolder.add(mesh.rotation, 'z', 0, Math.PI * 2)
		// cubeFolder.open()
	const cameraFolder = gui.addFolder('Camera')
	cameraFolder.add(camera.position, 'z', -100, 100)
	cameraFolder.add(camera.position, 'x', -100, 100)
	cameraFolder.add(camera.position, 'y', -100, 100)
	cameraFolder.open()

	var textureLoader = new THREE.TextureLoader(loadingManager);
	crateTexture = textureLoader.load("ThreeJS/textures/crate/crate0_diffuse.jpg");
	crateBumpMap = textureLoader.load("ThreeJS/textures/crate/crate0_bump.jpg");
	crateNormalMap = textureLoader.load("ThreeJS/textures/crate/crate0_normal.jpg");

	camera.position.set(70, player.height, 0);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;



	const controls = new OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI*0.49;
	// controls.addEventListener( 'change', animate ); // use if there is no animation loop
	controls.minDistance = 0;
	controls.maxDistance = 500;
	controls.target.set( 0, 5, 0);
	controls.update();

	renderer.domElement.addEventListener('click', onClick, false);

	document.body.appendChild(renderer.domElement);
	
	window.addEventListener( 'resize', onWindowResize );
	animate();
}

function onWindowResize() {
	camera.aspect = (window.innerWidth) / (window.innerHeight);
	camera.updateProjectionMatrix();
	renderer.setSize( (window.innerWidth),( window.innerHeight) );
	animate();
}

// Runs when all resources are loaded
function onResourcesLoaded(){
	for( var _key in models ){
		(function(key){
			console.log(models[key].glb);
			const loader = new GLTFLoader().setPath( 'ThreeJS/models/gltf/' );
			loader.load( models[key].glb, function ( gltf ) {
				gltf.scene.traverse(function (node) {
					if (node instanceof THREE.Mesh) {
						node.castShadow = true;
					}
				});

				if(models[key].model_mesh == null ){
					gltf.scene.scale.set(8, 8 , 8);
				}else{
					gltf.scene.scale.set(1, 1 , 1); 
				}
				gltf.scene.position.set( models[key].dimensions_x , models[key].dimensions_y, models[key].dimensions_z); 
				
				scene.add( gltf.scene );
				animate();
			}, undefined, function ( error ) {
				console.log("Model Load Error");
				console.error( error );
			} ); 
		})(_key);
	}
}

function onClick() {

  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {

	var clickedObject = intersects[0].object;
    console.log('Intersection:=>', intersects[0]);
    console.log('clickedObject :=>', clickedObject);

  }

}

function animate(){

	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}

	requestAnimationFrame(animate);
	
	// mesh.rotation.x += 0.01;
	// mesh.rotation.y += 0.02;
	// crate.rotation.y += 0.01;
	// Uncomment for absurdity!
	// meshes["pirateship"].rotation.z += 0.01;
	
	if(keyboard[87]){ // W key
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	
	// camera.position.set(
	// 	character.position.x,
	// 	character.position.y + 1,
	// 	character.position.z + 5
	//   );
	//   camera.lookAt(character.position);

	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

