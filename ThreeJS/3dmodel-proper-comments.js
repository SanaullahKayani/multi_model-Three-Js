



//  <script type="module"> 

	import * as THREE from 'three';

	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

	let camera, scene, renderer;

	init();
	render();

	function init() {

		const container = document.createElement( 'div' );
		document.getElementById("denv").appendChild( container );
		
		const fov    = 100; 		// Camera frustum vertical field of view
		const aspect = (window.innerWidth) / (window.innerHeight); // came 2d width height
		const near   =  1;    // Camera frustum  near plane
		const far    = 8000;	 // Camera frustum  far plane
		
		camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
		camera.position.set( -50, 100, 100 );  // x, y, and 3rd = height 
		camera.lookAt(new THREE.Vector3(0,50,50)); //its Euclidean distance (straight-line distance) from (0, 0, 0) to (x, y, z)

		scene = new THREE.Scene();

		// new RGBELoader()
		// 	.setPath( 'ThreeJS/textures/equirectangular/' )
		// 	.load( 'quarry_01_1k.hdr', function ( texture ) {

		// 		// background texture
		// 		texture.mapping = THREE.EquirectangularReflectionMapping;

		// 		scene.background = texture;
		// 		scene.environment = texture;

		// 		render();

				// model

				const loader = new GLTFLoader().setPath( 'ThreeJS/models/gltf/' );
				loader.load( 'cotton-candy.glb', function ( gltf ) {

					gltf.scene.position.x = 0;
					gltf.scene.position.y = 0;
					gltf.scene.position.z = 0;
					gltf.scene.scale.set(0.1, 0.1, 0.1);
					scene.add( gltf.scene );

					render();

				} );

			// } );

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setClearColor( 0x000000, 0 ); //make background transparent
		renderer.setPixelRatio( window.devicePixelRatio ); //Sets device pixel ratio, used for HiDPI device to prevent blurring output canvas.
		renderer.setSize( window.innerWidth, window.innerHeight ); //( width : Integer, height : Integer, updateStyle : Boolean ), Resizes the output canvas to (width, height) with device pixel ratio
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( renderer.domElement );

		const controls = new OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render ); // use if there is no animation loop
		controls.minDistance = 10;
		controls.maxDistance = 100;
		controls.target.set( 0, 60, - 0.2 );
		controls.update();

// self
	var hlight = new THREE.AmbientLight (0xffffff,2.8);
	scene.add(hlight);

	// var directionalLight = new THREE.DirectionalLight(0xffffff,0.8);
	// directionalLight.position.set(300,100, 100);
	// directionalLight.castShadow = true;
	// scene.add(directionalLight);

	// directionalLight.shadow.mapSize.width = 0;
	// directionalLight.shadow.mapSize.height = 0; 
	// directionalLight.shadow.camera.near = 1; 
	// directionalLight.shadow.camera.far = 200;
	// directionalLight.shadow.camera.left = 50;
	// directionalLight.shadow.camera.right = 50;
	// directionalLight.shadow.camera.top = 50;
	// directionalLight.shadow.camera.bottom = 50;
// self end
		window.addEventListener( 'resize', onWindowResize );

	}

	function onWindowResize() {

		camera.aspect = (window.innerWidth) / (window.innerHeight);
		camera.updateProjectionMatrix();

		renderer.setSize( (window.innerWidth),( window.innerHeight) );

		render();

	}

	//

	function render() {

		renderer.render( scene, camera );

	}

//  </script> 