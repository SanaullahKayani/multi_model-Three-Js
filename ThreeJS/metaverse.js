
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import Stats from 'three/examples/jsm/libs/stats.module'
// import { GUI } from 'dat.gui'

var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

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

// Models index
// var models = {
// 	tent: {
// 		obj:"models/Tent_Poles_01.obj",
// 		mtl:"models/Tent_Poles_01.mtl",
// 		mesh: null
// 	},
// 	campfire: {
// 		obj:"models/Campfire_01.obj",
// 		mtl:"models/Campfire_01.mtl",
// 		mesh: null
// 	},
// 	pirateship: {
// 		obj:"models/Pirateship.obj",
// 		mtl:"models/Pirateship.mtl",
// 		mesh: null
// 	}
// };

var models = {
	B3: {
		glb:"ThreeJS/models/gltf/B3-230223.glb",
		model_mesh: null
	},
	B5: {
		glb:"ThreeJS/models/gltf/B5.glb",
		model_mesh: null
	},
	B6: {
		glb:"ThreeJS/models/gltf/B6.glb",
		model_mesh: null
	}
};

//Set Up Ground Environment
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

// Meshes index
var meshes = {};


function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.1, 1000);
	
	const axesHelper = new THREE.AxesHelper( 50 );
	scene.add( axesHelper );
	
	loadingScreen.box.position.set(0,0,5);
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
	
	
	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	);
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add(mesh);
	
	let size = 8000;
	// const environmentTexture = new THREE.CubeTextureLoader().load(CubeTexture)
	// scene.background = environmentTexture;
	setUpGround(size);
	// meshFloor = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(20,20, 10,10),
	// 	new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
	// );
	// meshFloor.rotation.x -= Math.PI / 2;
	// meshFloor.receiveShadow = true;
	// scene.add(meshFloor);
	
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
	const sphereSize = 1;
	const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
	scene.add( pointLightHelper )

	const gui = new dat.GUI();
	const cubeFolder = gui.addFolder('Cube')
		cubeFolder.add(mesh.rotation, 'x', 0, Math.PI * 2)
		cubeFolder.add(mesh.rotation, 'y', 0, Math.PI * 2)
		cubeFolder.add(mesh.rotation, 'z', 0, Math.PI * 2)
		cubeFolder.open()
		const cameraFolder = gui.addFolder('Camera')
		cameraFolder.add(camera.position, 'z', -10, 10)
		cameraFolder.open()

	var textureLoader = new THREE.TextureLoader(loadingManager);
	crateTexture = textureLoader.load("ThreeJS/textures/crate/crate0_diffuse.jpg");
	crateBumpMap = textureLoader.load("ThreeJS/textures/crate/crate0_bump.jpg");
	crateNormalMap = textureLoader.load("ThreeJS/textures/crate/crate0_normal.jpg");
	
	crate = new THREE.Mesh(
		new THREE.BoxGeometry(3,3,3),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			map:crateTexture,
			bumpMap:crateBumpMap,
			normalMap:crateNormalMap
		})
	);
	scene.add(crate);
	crate.position.set(2.5, 3/2, 2.5);
	crate.receiveShadow = true;
	crate.castShadow = true;
	
	// Load models
	// REMEMBER: Loading in Javascript is asynchronous, so you need
	// to wrap the code in a function and pass it the index. If you
	// don't, then the index '_key' can change while the model is being
	// downloaded, and so the wrong model will be matched with the wrong
	// index key.

	for( var _key in models ){
		(function(key){
			
			// var glbLoader = new THREE.GLTFLoader();
			const glbLoader = new GLTFLoader(loadingManager);
			glbLoader.load(models[key].glb, function(gltf) {

				mesh.traverse(function(node){
					if(node instanceof THREE.Mesh){
						node.castShadow = true;
						node.receiveShadow = true;
					}else{
						node.layers.disableAll();
					}
				});
				models[key].model_mesh = mesh;

				// console.log("models",models);

				// scene.add( gltf.scene );

				// // materials.preload();
				// mesh.traverse(function(node){
				// 	if( node instanceof THREE.Mesh ){
				// 		node.castShadow = true;
				// 		node.receiveShadow = true;
				// 	}
				// });
				// models[key].mesh = mesh;

			// // get the root object from the loaded scene
			// var model = gltf.scene;
			// // add the model to the scene

			// model.position.set(10, 10, 12);
			// model.scale.set(2,2,2);
			// scene.add(model);
			// // render the scene
			// renderer.render(scene, camera);
			});



			// var mtlLoader = new THREE.MTLLoader(loadingManager);
			// mtlLoader.load(models[key].mtl, function(materials){
			// 	materials.preload();
				
			// 	var objLoader = new THREE.OBJLoader(loadingManager);
				
			// 	objLoader.setMaterials(materials);
			// 	objLoader.load(models[key].obj, function(mesh){
					
			// 		mesh.traverse(function(node){
			// 			if( node instanceof THREE.Mesh ){
			// 				node.castShadow = true;
			// 				node.receiveShadow = true;
			// 			}
			// 		});
			// 		models[key].mesh = mesh;
					
			// 	});
			// });
			
		})(_key);
	}
	
	// const controls = new OrbitControls( camera, renderer.domElement );
	// controls.addEventListener( 'change', render ); // use if there is no animation loop
	// controls.minDistance = 1000;
	// controls.maxDistance = 1200;
	// // controls.target.set( 0, 0, 0 );
	// // controls.enableZoom = false;
	// // controlsPerspective.enablePan = false;
	// // controlsPerspective.enableDamping = true;
	// controls.update();

	camera.position.set(5, player.height, -12);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
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
	// Clone models into meshes.
	meshes["B3"] = models.B3.model_mesh.clone();
	meshes["B5"] = models.B5.model_mesh.clone();
	meshes["B6"] = models.B6.model_mesh.clone();
	
	// Reposition individual meshes, then add meshes to scene
	meshes["B3"].position.set(4, 4, 4);
	meshes["B3"].scale.set(3,3,3);
	
	console.log("Meshes :: ", meshes["B3"]);
	
	scene.add(meshes["B3"]);
	
	meshes["B5"].position.set(-8, 0, 4);
	meshes["B5"].position.y = + 5;
	scene.add(meshes["B5"]);
	
	meshes["B6"].position.set(-5, 0, 1);
	meshes["B6"].position.y = + 5;	
	scene.add(meshes["B6"]);
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
	
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	crate.rotation.y += 0.01;
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

