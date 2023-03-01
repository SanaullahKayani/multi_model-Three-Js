<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Metaverse Environment</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <style>
        body {
            margin: 0;
            overflow: hidden
        }

        #loader {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh;
        }

        #loader .img {
            background-image: url("/images/loading.gif");
            position: relative;
            background-repeat: no-repeat;
            width: 20%;
            height: 200px;
        }
    </style>
    <!-- <link href="css/style.css" rel="stylesheet"> -->
</head>

<body>
    <div class="loader" id="loader">
        <div class="img"></div>
    </div>
    <div id="interior"></div>
    <!-- <div class="metamenu">
        <button class="btn btn-info" onclick="metabtn()">Enter into Metaverse</button>
    </div> -->
    <script>
        function metabtn() {
            alert("clicked");
        }
    </script>

    <script type="text/javascript" src="lib/dat.gui.js"></script>

    <script type="importmap">
        {
            "imports": {
                "three": "./ThreeJS/build/three.module.js",
                "three/addons/": "./ThreeJS/jsm/"
            }
        }
    </script>
    <!-- <script type="module" src="ThreeJS/three_mmi.js"></script> -->
    <script type="module" src="ThreeJS/interior_building.js"></script>
</body>

</html>