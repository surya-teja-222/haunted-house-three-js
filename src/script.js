import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import Stats from "stats-js"
import gsap from "gsap"
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const stats = new Stats()
stats.showPanel(1)
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog("#262837", 1, 15)
scene.fog = fog

// Loading Manager
const LoadingManager = new THREE.LoadingManager()
LoadingManager.onLoad = () => {
	gsap.set(".load", {
		display: "none",
		ease: "ease-in-out",
	})
	gsap.set(".load", {
		backgroundColor: "white",
	})
	const tl = new gsap.timeline()
	tl.to(".loader-childern", {
		translateY: "-100%",
		stagger: {
			from: "start",
			amount: 0.2,
		},
		ease: "ease-in-out",
	})
	tl.to(".pre-loader", {
		translateY: "-100%",
		ease: "ease-in-out",
	})
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader(LoadingManager)

// Door Textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
)
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

// Bricks Textures
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg")
const brickAomaptexture = textureLoader.load(
	"/textures/bricks/ambientOcclusion.jpg"
)
const brickNormaltexture = textureLoader.load("/textures/bricks/normal.jpg")
const brickRoughnesstexture = textureLoader.load(
	"/textures/bricks/roughness.jpg"
)

// Grass Textures
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg")
const grassAomaptexture = textureLoader.load(
	"/textures/grass/ambientOcclusion.jpg"
)
const grassNormaltexture = textureLoader.load("/textures/grass/normal.jpg")
const grassRoughnesstexture = textureLoader.load(
	"/textures/grass/roughness.jpg"
)

// Roof
const roofColorTexture = textureLoader.load("/textures/roof/roofbasecolor.jpg")
const roofAomaptexture = textureLoader.load(
	"/textures/roof/roofambientOcclusion.jpg"
)
const roofNormaltexture = textureLoader.load("/textures/roof/roofnormal.jpg")
const roofRoughnesstexture = textureLoader.load(
	"/textures/roof/roofroughness.jpg"
)
const roofHeighttexture = textureLoader.load("/textures/roof/roofheight.png")

// Grave
const graveColorTexture = textureLoader.load("/textures/grave/BaseColor.jpg")
const graveAomaptexture = textureLoader.load(
	"/textures/grave/AmbientOcclusion.jpg"
)
const graveNormaltexture = textureLoader.load("/textures/grave/Normal.jpg")
const graveRoughnesstexture = textureLoader.load(
	"/textures/grave/Roughness.jpg"
)
const graveHeighttexture = textureLoader.load("/textures/grave/Height.png")

grassColorTexture.repeat.set(8, 8)
grassAomaptexture.repeat.set(8, 8)
grassNormaltexture.repeat.set(8, 8)
grassRoughnesstexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAomaptexture.wrapS = THREE.RepeatWrapping
grassNormaltexture.wrapS = THREE.RepeatWrapping
grassRoughnesstexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAomaptexture.wrapT = THREE.RepeatWrapping
grassNormaltexture.wrapT = THREE.RepeatWrapping
grassRoughnesstexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: bricksColorTexture,
		aoMap: brickAomaptexture,
		transparent: true,
		normalMap: brickNormaltexture,
		roughnessMap: brickRoughnesstexture,
	})
)

walls.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = walls.geometry.parameters.height * 0.5
house.add(walls)

// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofAomaptexture,
		transparent: true,
		normalMap: roofNormaltexture,
		roughnessMap: roofRoughnesstexture,
		displacementMap: roofHeighttexture,
		displacementScale: 0.01,
	})
)

roof.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
)
roof.rotation.y = Math.PI * 0.25
roof.position.y =
	roof.geometry.parameters.height * 0.5 + walls.geometry.parameters.height
house.add(roof)

// door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.1,
		normalMap: doorNormalTexture,
		metalnessMap: doorMetalnessTexture,
		roughnessMap: doorRoughnessTexture,
	})
)

door.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 2 * 0.5
door.position.z = walls.geometry.parameters.depth * 0.5 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
	color: "#89c854",
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: grassAomaptexture,
	transparent: true,
	displacementMap: graveHeighttexture,
	displacementScale: 0.0001,
	normalMap: graveNormaltexture,
	roughnessMap: graveRoughnesstexture,
})

for (let i = 0; i < 50; i++) {
	const angle = Math.random() * Math.PI * 2 // Random angle
	const radius = 3 + Math.random() * 6 // Random radius
	const x = Math.cos(angle) * radius // Get the x position using cosinus
	const z = Math.sin(angle) * radius // Get the z position using sinus
	// Create the mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial)
	// Position
	grave.position.set(x, 0.3, z)
	// Rotation
	grave.rotation.y = (Math.random() - 0.5) * 0.4
	grave.rotation.z = (Math.random() - 0.5) * 0.4
	// Add to the graves container
	graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grassColorTexture,
		aoMap: grassAomaptexture,
		transparent: true,
		normalMap: grassNormaltexture,
		roughnessMap: grassRoughnesstexture,
	})
)

floor.geometry.setAttribute(
	"uv2",
	new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.2)
moonLight.position.set(2.5, 2, -3)
gui.add(moonLight, "intensity").min(0).max(1).step(0.001)
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Light Helpers
 */
const moonLightCameraHelper = new THREE.DirectionalLightHelper(moonLight)
moonLightCameraHelper.visible = false
scene.add(moonLightCameraHelper)

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight("#00ffff", 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight("#ffff00", 2, 3)
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.x = 3
camera.position.y = 2
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#262837")

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.type = THREE.BasicShadowMap

// if mobile use Basic else PCF Soft ShadowMap
renderer.shadowMap.type =
	window.innerWidth < 600 ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

graves.children.forEach((grave) => {
	grave.castShadow = true
})

floor.receiveShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	stats.begin()

	const elapsedTime = clock.getElapsedTime()

	// Update Ghosts
	const ghost1Angle = elapsedTime * 0.5
	ghost1.position.x = Math.cos(ghost1Angle) * 4
	ghost1.position.y = Math.sin(elapsedTime * 3)
	ghost1.position.z = Math.sin(ghost1Angle) * 4

	const ghost2Angle = -elapsedTime * 0.32
	ghost2.position.x = Math.cos(ghost2Angle) * 5
	ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5)
	ghost2.position.z = Math.sin(ghost2Angle) * 5

	const ghost3Angle = -elapsedTime * 0.18
	ghost3.position.x =
		Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
	ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 0.5)
	ghost3.position.z =
		Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	stats.end()

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
