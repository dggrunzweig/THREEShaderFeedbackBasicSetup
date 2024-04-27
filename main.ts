import * as THREE from 'three'

import fb_fragment from './fb_fragment.ts';

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const in_scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);

const renderer = new THREE.WebGLRenderer();
let material_in: THREE.ShaderMaterial;
let material_out: THREE.MeshBasicMaterial;

let textureA = new THREE.WebGLRenderTarget(
    window.innerWidth, window.innerHeight,
    {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
let textureB = new THREE.WebGLRenderTarget(
    window.innerWidth, window.innerHeight,
    {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});

const initial_texture = new THREE.TextureLoader().load('./circles.jpg');

function sceneSetup() {
  // initial texture
  const plane_in = new THREE.PlaneGeometry(2, 2);
  const uniforms_input = {
    u_in_buffer: {value: textureA.texture},
    u_init_buffer: {value: initial_texture},
    u_resolution:
        {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    u_time: {value: 0.},
  };
  material_in = new THREE.ShaderMaterial(
      {uniforms: uniforms_input, fragmentShader: fb_fragment});
  const mesh_init = new THREE.Mesh(plane_in, material_in);
  in_scene.add(mesh_init);

  const plane_out = new THREE.PlaneGeometry(2, 2);
  material_out = new THREE.MeshBasicMaterial({map: initial_texture});
  const mesh_out = new THREE.Mesh(plane_out, material_out);
  scene.add(mesh_out);

  // Set up renderer
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // start clock
  clock.start();
}

function render() {
  requestAnimationFrame(render);

  // Update time
  material_in.uniforms.u_time.value = clock.getElapsedTime();

  // render the first scene to textureB
  renderer.setRenderTarget(textureB);
  renderer.render(in_scene, camera);

  // swap the textures for feedback
  var t = textureA;
  textureA = textureB;
  textureB = t;
  // update the output scene with the recently rendered texture
  material_out.map = textureB.texture;
  // pass the output texture back to the input of the feedback shader
  material_in.uniforms.u_in_buffer.value = textureA.texture;

  // returns the render to using the canvas
  renderer.setRenderTarget(null);
  // render output scene
  renderer.render(scene, camera);
}

// call functions
sceneSetup();
render();
