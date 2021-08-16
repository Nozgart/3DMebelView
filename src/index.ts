// add styles
import './style.css';

// three.js
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

const outputDir = document.querySelector(".fancybox-image");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, outputDir.clientWidth / outputDir.clientHeight, 0.1, 10);
const renderer = new THREE.WebGLRenderer();
var maxDistance = 5;
var minDistance = 3;
renderer.setSize(outputDir.clientWidth, outputDir.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xDDDDDD, 1);

document.querySelector(".fancybox-image").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxDistance = maxDistance;
controls.minDistance = minDistance;

controls.maxPolarAngle =  1.5;
//controls.minPolarAngle = 2;
//controls.maxAzimuthAngle =  1;
//controls.minAzimuthAngle = -1;

var myObject = new THREE.Object3D();
var id;
var rotation;
var smesh =0;
var modelName;
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
camera.add(pointLight);
scene.add(ambientLight);
scene.add(camera);
camera.position.z = minDistance;
rotateSetUp();

var initializeModels = function()
{    
    console.log('pagetitle: ' + document.querySelector('div.page-top-main #pagetitle').textContent);
    modelName = document.querySelector('div.page-top-main #pagetitle').textContent;

    modelName = modelName.replaceAll('*','');
    
    if(modelName)
    {
        //if(modelName>5){ modelName = 1; }

        const manager = new THREE.LoadingManager();
        manager.addHandler(/\.dds$/i, new DDSLoader());

        new MTLLoader(manager).setPath('models/' + modelName +'/')
            .load(modelName + '.mtl', function (materials) {
                materials.preload();
                new OBJLoader(manager).setMaterials(materials).setPath('models/' + modelName +'/')
                .load(modelName + '.obj',
                function (object) {
                    object.scale.set(0.001, 0.001, 0.001);
                    //myObject.position.x += smesh;
                    //smesh += 1;
                    //modelName++;
                    myObject.add(object);            
                }, 
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                }, 
                function (error) {
                    console.log('An error happened: ' + error);
                });
        });
        controls.target = myObject.position;
        scene.add(myObject);
        animate();
    }
}

export var animate = function () 
{
    id = requestAnimationFrame(animate);
    rotateObject();
    controls.update();
    render();
};

function desideRotateObject() 
{
    rotation = !rotation;
    return rotation;
}

function rotateObject() { controls.autoRotate = rotation; }

function rotateSetUp() { rotation = false; }

function render() { renderer.render(scene, camera); }

function stopAnimationFrame() 
{
    console.log('camera.position.y: ' + camera.position.y);
    console.log('camera.position.x: ' + camera.position.x);
    camera.position.set(0,0,minDistance);
    console.log('camera.position.y: ' + camera.position.y);
    console.log('camera.position.x: ' + camera.position.x);


    console.log('scene.children.length: ' + scene.children.length);
    scene.remove(myObject);
    console.log('scene.children.length: ' + scene.children.length);


    console.log('myObject.children.length before remove: ' + myObject.children.length);
    while(myObject.children.length > 0) { myObject.remove(myObject.children[0]); } 
    console.log('myObject.children.length after remove: ' + myObject.children.length);


    rotateSetUp();
    renderer.renderLists.dispose();//что это?
    cancelAnimationFrame(id);
}

document.querySelector('.startbutton').addEventListener('click', initializeModels);
document.querySelector('.fancybox-item.fancybox-close.stopbutton').addEventListener('click', stopAnimationFrame);
document.querySelector('.fancybox-item.fancybox-rotate.rotatebutton').addEventListener('click', desideRotateObject);

// window.addEventListener('resize', onWindowResize, false);

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     render();
// }