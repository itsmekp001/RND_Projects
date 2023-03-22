      // Create the scene
      const scene = new THREE.Scene()
      // Create the camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      camera.lookAt(scene.position)
      // Create the renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      const canvasContainer = document.getElementById('canvas-container');
      canvasContainer.appendChild(renderer.domElement);
      renderer.setClearColor('hsl(210, 50%, 90%)'); // Set background color to light blue
      // Create the light
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light)
      // Create the GLTFLoader
      const loader = new THREE.GLTFLoader()
      // Load the glTF file
      let mixer;
      let model;
      let clips;
      
      loader.load(
        'model.glb',
        function (gltf) {
        model = gltf.scene;
        model.position.y = -2;
          scene.add(model);
          mixer = new THREE.AnimationMixer(model);
          clips = gltf.animations;

          // Find animation clip by name
          const clipName = 'IDLE';
          const clip = THREE.AnimationClip.findByName(clips, clipName);

          if (clip) {
              // Create a THREE.AnimationAction and play it
              const action = mixer.clipAction(clip);
              action.play();
              console.log(`animation playing  ${clipName}`);
          } else {
              console.warn(`Animation clip ${clipName} not found.`);
          }
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
          console.error(error);
        }
      )
      // Create the animation loop
      const clock = new THREE.Clock();
      const animate = function () {
          requestAnimationFrame(animate);
          
          // Update the animation mixer
          if (mixer) {
            mixer.update(clock.getDelta());
          }
          
          renderer.render(scene, camera);
        };
        
      animate();

      // Create a function to change the animation action
function changeAnimationAction(animationName) {
    // Find animation clip by name
    const clip = THREE.AnimationClip.findByName(clips, animationName);
  
    if (clip) {
      // Stop the current action and create a new one with the new clip
      if (mixer) {
        mixer.stopAllAction();
      }
      
      const newAction = mixer.clipAction(clip);
      newAction.play();
  
      console.log(`animation playing  ${animationName}`);
    } else {
      console.warn(`Animation clip ${animationName} not found.`);
    }
  }
  
  // Add event listener to the dropdown
  const dropdown = document.getElementById("my-dropdown");
  
  dropdown.addEventListener("change", (event) => {
    const selectedOption = event.target.value;
    console.log(selectedOption);
  
    // Call the changeAnimationAction function with the selected option

    changeAnimationAction("IDLE")

    setTimeout(() => changeAnimationAction(selectedOption), 500);
    
  });