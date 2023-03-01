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

        .metamenu {
            position: absolute;
            bottom: 50px;
            left: 45vw;
        }

        .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border: none;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.3rem;
            transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        }

        .metamenu .btn-info:hover {
            background-image: linear-gradient(180deg, #124703, #8FFF8F) !important;
            cursor: pointer;
        }

        .btn-info {
            color: #fff;
            background-image: linear-gradient(180deg, #8FFF8F, #124703);
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

        /* #blocker {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }

        #instructions {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            text-align: center;
            font-size: 14px;
            cursor: pointer;
        } */
    </style>
    <!-- <link href="css/style.css" rel="stylesheet"> -->
</head>

<body>
    <!-- <div id="denv">
        <h3>POINTER HERE</h3>
    </div>
    <div id="scn">
        <h3>OKAy</h3>
    </div> -->
    <!-- <div id="dubai_environment"></div> -->
    <!-- <div id="blocker">
        <div id="instructions">
            <p style="font-size:36px">
                Click to play
            </p>
            <p>
                Move: WASD<br />
                Jump: SPACE<br />
                Look: MOUSE
            </p>
        </div>
    </div> -->
    <div class="loader" id="loader">
        <div class="img"></div>
    </div>

    <div id="bulding_environment"></div>
    <div class="metamenu">
        <button class="btn btn-info" onclick="metabtn()">Enter into Metaverse</button>
    </div>
    <script>
        function metabtn() {
            location.replace("interior.php");
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
    <script type="module" src="ThreeJS/building_scene.js"></script>

    <script type="text/javascript">
        document.onreadystatechange = function() {
            if (document.readyState !== "complete") {
                document.querySelector(
                    "body").style.visibility = "hidden";
                document.querySelector(
                    "#loader").style.visibility = "visible";
            } else {
                document.querySelector(
                    "#loader").style.display = "none";
                document.querySelector(
                    "body").style.visibility = "visible";
            }
        };
    </script>
</body>

</html>