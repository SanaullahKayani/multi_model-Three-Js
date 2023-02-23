
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer;


var url = window.location.href;
var params = url.split('/');
var flavor = params.pop();

init();
render();

var url = window.location.href;
var params = url.split('/');
var flavor = params.pop();
var model = flavor+'.glb';

function init() {

	const container = document.createElement( 'div' );
	document.getElementById("flavour3js").appendChild( container );
	
	const fov    = 45; 	//how the came be wide	// Camera frustum vertical field of view 
	const aspect = (window.innerWidth) / (window.innerHeight); // came 2d width height
	const near   =  1;  //camera view start from here  // Camera frustum  near plane
	const far    = 1800; //camera view end it here	 // Camera frustum  far plane
	
	camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 50, 700 );  // x, y, and 3rd = z-axis(can near to model via this) 
	// camera.lookAt(new THREE.Vector3( 0, 0, 100)); //its Euclidean distance (straight-line distance) from (0, 0, 0) to (x, y, z)

	camera.position.z = 1500;
	scene = new THREE.Scene();

	// Custom loader 
	// Create a new loading manager
	var loadingManager = new THREE.LoadingManager();

	// Set up the loading manager to display a loading screen
	loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	// Show the loading screen
	document.getElementById("flavour3js").style.display = "none";
	document.getElementById("loading").style.display = "block";
	};

	loadingManager.onLoad = function ( ) {
	// Hide the loading screen
	document.getElementById("loading").style.display = "none";
	document.getElementById("flavour3js").style.display = "block";
	};
	// Custom loader End

	new RGBELoader()
		.setPath( 'ThreeJS/textures/equirectangular/' )
		.load( 'quarry_01_1k.hdr', function ( texture ) {

			// background texture
			texture.mapping = THREE.EquirectangularReflectionMapping;

			// scene.background = texture;
			// scene.environment = texture;

			render();

			// model

			const loader = new GLTFLoader(loadingManager).setPath( 'ThreeJS/models/gltf/' );
			loader.load( model, function ( gltf ) {

				const box = new THREE.Box3().setFromObject( gltf.scene );
				const center = box.getCenter( new THREE.Vector3() );
		
				gltf.scene.position.x += ( gltf.scene.position.x - center.x );
				gltf.scene.position.y += ( gltf.scene.position.y - center.y );
				gltf.scene.position.z += ( gltf.scene.position.z - center.z );

				scene.add( gltf.scene );
				render();
			} );

		} );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setClearColor( 0x000000, 0 ); //make background transparent
	renderer.setPixelRatio( window.devicePixelRatio ); //Sets device pixel ratio, used for HiDPI device to prevent blurring output canvas.
	renderer.setSize( window.innerWidth/2, window.innerHeight/2 ); //( width : Integer, height : Integer, updateStyle : Boolean ), Resizes the output canvas to (width, height) with device pixel ratio
	// renderer.toneMapping = THREE.ACESFilmicToneMapping;
	// renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	const controls = new OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render ); // use if there is no animation loop
	controls.minDistance = 1000;
	controls.maxDistance = 1200;
	// controls.target.set( 0, 0, 0 );
	// controls.enableZoom = false;
	// controlsPerspective.enablePan = false;
	// controlsPerspective.enableDamping = true;
	controls.update();

// self Lightning
	const ambientLight = new THREE.AmbientLight( 0xffffff, 0.7 );
	ambientLight.position.set(0,0,300);
	scene.add( ambientLight );

	const ambientLight2 = new THREE.AmbientLight( 0xffffff, 0.7 );
	ambientLight2.position.set(0,0,-300);
	scene.add( ambientLight2 );



	var directionalLight = new THREE.DirectionalLight(0xffffff,0.1);
	directionalLight.position.set(0,0, 300);
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff,0.1);
	directionalLight.position.set(0,0, -300);
	directionalLight.castShadow = true;
	scene.add(directionalLight);

	directionalLight.shadow.mapSize.width = 0;
	directionalLight.shadow.mapSize.height = 0; 
	directionalLight.shadow.camera.near = 1; 
	directionalLight.shadow.camera.far = 200;
	directionalLight.shadow.camera.left = 50;
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom = 50;


// self end
	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {
		camera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
		camera.updateProjectionMatrix();
		renderer.setSize( (window.innerWidth/2),( window.innerHeight/2) );
		render();
}

//

function render() {

	renderer.render( scene, camera );

}

//  </script> 