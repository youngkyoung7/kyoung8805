import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

window.addEventListener('load', function () {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha:true,

  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;//그림자 옵션켜기
  document.body.appendChild(renderer.domElement);
//scene
  const scene = new THREE.Scene();
//카메라
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );
  const controls = new OrbitControls(camera, renderer.domElement)
  //마우스로 움직이면 카메라 위치가 변함.
  controls.autoRotate = true;//자동회전
  controls.autoRotateSpeed = 10;//회전속도
  controls.enableDamping = true;
  controls.enableZoom=true;//카메라 줌
  
  camera.position.set(0,0,5);
//오브젝트 추가

const gltfLoader = new GLTFLoader();

const gltf = await gltfLoader.loadAsync('./models/shoe/scene.gltf');
const shoes = gltf.scene;
/* glft값을 scene안에 저장.
실제 모델들은 scene안에 포함되어 있는 값들이기때문에
scene가 아니라 모델들이 탐색이 되어야 그림자가 생김
그래서 traverse 메서드를 사용해서 Group내의 모든 Mesh를 탐색할 수 있다.

*/
shoes.castShadow = true;
// shoes.receiveShadow = true;
shoes.traverse(object => {
  if (object.isMesh) {
    object.castShadow = true;
  }
});
shoes.rotation.y = -150;
shoes.rotation.x = -150;




shoes.scale.set(0.5,0.5,0.5);
scene.add(shoes);


//조명에 그림자 추가(castShadow-그림자 드리움)
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 20;
  directionalLight.position.y = 2//그림자가 잘려서 조명의 위치를 조절
scene.add( directionalLight )
// const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( helper );
const spotLight = new THREE.SpotLight(0xffffff, 2, 30, Math.PI * 0.15, 1, 0.5);

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.radius = 20;

spotLight.position.set(0, 20, 0);

scene.add(spotLight);
 /** Plane 바닥에 그림자 옵션추가*/
 const planeGeometry = new THREE.PlaneGeometry( 10, 10,32, 32 );
const planeMaterial = new THREE.MeshPhongMaterial( { 
  color: 0xffffff,
transparent : true,
opcity : 5,

} )
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
// plane.position.set(0,-2,0);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;

//receiveShadow : 그림자를 받음
plane.receiveShadow = true;
scene.add( plane );

//그림자

  //반응형
  render();

  function render() {
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', handleResize);
}