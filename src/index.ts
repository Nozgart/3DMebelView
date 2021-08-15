// add styles
import './style.css';

// three.js
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

const outputDir = document.querySelector(".b-popup-content");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, outputDir.clientWidth / outputDir.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
var rotation = true;
renderer.setSize(outputDir.clientWidth, outputDir.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xDDDDDD, 1);

document.querySelector(".b-popup-content").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
var myObject = new THREE.Object3D();
var id;
var smesh =0;
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
camera.add(pointLight);
scene.add(ambientLight);
scene.add(camera);
camera.position.z = 2;

var initializeModels = function(modelName){
    
    modelName=1;
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
                myObject.add(object);            
            }, 
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            }, 
            function (error) {
                console.log('An error happened: ' + error);
            });
    });

    scene.add(myObject);
    animate(myObject);
}

export var animate = function (_object: THREE.Object3D) {
    id = requestAnimationFrame(animate);
    rotateObject();
    controls.update();
    render();
};

function rotateObject() {   
    controls.autoRotate = rotation
}

function desideRotateObject() {
    rotation = !rotation;
    return rotation;
}

function render() {
    renderer.render(scene, camera);
}

function stopAnimationFrame() {

    console.log('scene.children.length: ' + scene.children.length);
    scene.remove(myObject);
    console.log('scene.children.length: ' + scene.children.length);


    console.log('myObject.children.length before remove: ' + myObject.children.length);
    while(myObject.children.length > 0){ 
       myObject.remove(myObject.children[0]); 
    } 
    console.log('myObject.children.length after remove: ' + myObject.children.length);

    myObject.rotation.y=0;
    rotation = true;
    renderer.renderLists.dispose();//что это?
    cancelAnimationFrame(id);
}

document.querySelector('.startbutton').addEventListener('click', initializeModels);
document.querySelector('.stopbutton').addEventListener('click', stopAnimationFrame);
document.querySelector('.rotatebutton').addEventListener('click', desideRotateObject);

// window.addEventListener('resize', onWindowResize, false);

// function onWindowResize() {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     render();
// }