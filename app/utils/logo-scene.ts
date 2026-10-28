import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import artworkUrl from '~/assets/img/EB_LOGO_SOURCE.svg'
import modelSource from '~/assets/models/EB_LOGO.obj?raw'

// The SVG's Calque-2 transform and front-face anchors calibrate the OBJ's
// isometric projection. Keep these in artwork coordinates, before centering.
const artworkScale = 138.87
const artworkOrigin = new THREE.Vector2(501.5804, 1028.1539)
const svgScale = 4.166667 * 0.86097
const svgOffset = new THREE.Vector2(72.66071, 55.490825).multiplyScalar(4.166667)
const right = new THREE.Vector3(1, 0, -1).normalize()
const up = new THREE.Vector3(-1, 2, -1).normalize()

export async function createLogoScene(host: HTMLElement, onReady: (ready: boolean) => void) {
  // Reuse the fallback image's URL/cache rather than bundling the SVG twice.
  const response = await fetch(artworkUrl)
  if (!response.ok) throw new Error('The logo artwork could not load')
  const artwork = await response.text()
  const svg = new DOMParser().parseFromString(artwork, 'image/svg+xml')
  const frontPath = [...svg.querySelectorAll('path')].find(path => path.getAttribute('d')?.startsWith('M0,840.967'))
  if (!frontPath) throw new Error('The logo front profile is missing')
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
  camera.position.set(12, 12, 12)
  camera.lookAt(0, 0, 0)

  // Shade actual faces in model space. Projecting the entire SVG also paints
  // its silhouette/cutouts onto exposed sides, making them appear sliced.
  const material = new THREE.ShaderMaterial({
    uniforms: { entranceReveal: { value: 0 } },
    vertexShader: `
      uniform float entranceReveal;
      varying vec3 localPosition;
      varying vec3 localNormal;
      void main() {
        localPosition = position;
        localNormal = normal;
        // The B protrudes beyond the E's -4 edge. Shorten that overhang only
        // for the opening pose, restoring the full curve as the model turns.
        vec3 animatedPosition = position;
        animatedPosition.z = mix(position.z, max(position.z, -4.0), entranceReveal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float entranceReveal;
      varying vec3 localPosition;
      varying vec3 localNormal;
      void main() {
        vec3 face = normalize(localNormal);
        // Match the SVG's #3e3e3e left edge and the two E-face fades.
        float left = (62.0 / 255.0) * clamp((localPosition.x + 4.0) / 5.0, 0.0, 1.0);
        float eFace = 0.9 * clamp(localPosition.y - 4.0, 0.0, 1.0);
        float shade = face.x > 0.5
          ? (localPosition.x > 0.5 ? 1.0 : eFace)
          // The upward faces are fully shadowed in the artwork. An ambient
          // minimum would reveal a gray cap above the two gradient faces.
          : left * max(face.z, 0.0);
        // Match the solid E rendered in the initial HTML, then restore the
        // face shading as the model rotates into the isometric view.
        shade = mix(shade, 1.0, entranceReveal);
        // The artwork tones are sRGB; the renderer expects linear output.
        float linearShade = shade <= 0.04045 ? shade / 12.92 : pow((shade + 0.055) / 1.055, 2.4);
        gl_FragColor = vec4(vec3(linearShade), 1.0);
        #include <colorspace_fragment>
      }
    `
  })
  const model = new OBJLoader().parse(modelSource)
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const originals = Array.isArray(child.material) ? child.material : [child.material]
      originals.forEach(original => original.dispose())
      child.material = material
      // Retain the POC's E. Its circular B approximates the original Bézier
      // profile, so replace that part with an extrusion of the actual path.
      const geometry = child.geometry as THREE.BufferGeometry
      const positions = geometry.getAttribute('position')
      const indices: number[] = []
      for (let i = 0; i < positions.count; i += 3) {
        if (Math.min(positions.getX(i), positions.getX(i + 1), positions.getX(i + 2)) < -0.00001) {
          indices.push(i, i + 1, i + 2)
        }
      }
      geometry.setIndex(indices)
    }
  })
  const front = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg">${frontPath.outerHTML}</svg>`)
  const profile = front.paths.flatMap(path => path.toShapes())
  const frontGeometry = new THREE.ExtrudeGeometry(profile, { depth: 1, bevelEnabled: false, curveSegments: 64 })
  const horizontal = artworkScale / Math.SQRT2
  const vertical = artworkScale * Math.sqrt(2 / 3)
  frontGeometry.applyMatrix4(new THREE.Matrix4().set(
    0, 0, -1, 1,
    -0.5 / horizontal, -1 / vertical, 0, (artworkOrigin.y - 300.5751) / vertical + 1,
    -1 / horizontal, 0, 0, 1,
    0, 0, 0, 1
  ))
  model.add(new THREE.Mesh(frontGeometry, material))
  const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3())
  model.position.sub(center)
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)
  host.appendChild(renderer.domElement)

  // Frame the full SVG viewBox, including its original margins. This keeps
  // the fallback and resting model in the same place at every screen size.
  const frameWidth = 4356 / svgScale / artworkScale
  const frameHeight = 4789 / svgScale / artworkScale
  const frameX = ((4356 / 2 - svgOffset.x) / svgScale - artworkOrigin.x) / artworkScale - center.dot(right)
  const frameY = (artworkOrigin.y - (4789 / 2 - svgOffset.y) / svgScale) / artworkScale - center.dot(up)
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const pointer = matchMedia('(hover: hover) and (pointer: fine)')
  const target = new THREE.Vector2()
  const current = new THREE.Vector2()
  // Rotate around screen-right and world-up, preserving the isometric home.
  const pitch = new THREE.Quaternion()
  const yaw = new THREE.Quaternion()
  const yawAxis = new THREE.Vector3(0, 1, 0)
  // Look up at the E's underside, with -Z reading right and +X reading up.
  // Align this frame to the camera to remove the isometric 45-degree slant.
  const eFrame = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, -1, 0)
  ))
  const entranceRotation = camera.quaternion.clone().multiply(eFrame.invert())
  const homeRotation = new THREE.Quaternion()
  let frame = 0
  let disposed = false
  let contextAvailable = true
  let visible = true
  let started = performance.now()
  let previous = started
  let entrance = !motion.matches

  function render(now: number) {
    frame = 0
    if (disposed || !contextAvailable || !visible || document.hidden) return
    const dt = Math.min((now - previous) / 1000, 0.05)
    previous = now
    // Keep the opening E still briefly so the initial HTML and first WebGL
    // frame are continuous before the turn begins.
    const progress = motion.matches ? 1 : THREE.MathUtils.clamp((now - started - 500) / 1800, 0, 1)
    const eased = progress < 0.5
      ? 4 * progress ** 3
      : 1 - (-2 * progress + 2) ** 3 / 2
    const intro = entrance ? 1 - eased : 0
    // Grow from 62% as the flat E turns into the isometric EB monogram.
    const zoom = entrance ? 0.62 + 0.38 * eased + 0.09 * Math.sin(Math.PI * progress) ** 2 : 1
    pivot.scale.setScalar(zoom)
    if (progress === 1) entrance = false
    current.lerp(target, motion.matches ? 1 : 1 - Math.exp(-dt * 8))
    material.uniforms.entranceReveal!.value = intro
    if (entrance) {
      pivot.quaternion.slerpQuaternions(entranceRotation, homeRotation, eased)
    } else {
      pitch.setFromAxisAngle(right, current.y)
      yaw.setFromAxisAngle(yawAxis, current.x)
      pivot.quaternion.copy(yaw).multiply(pitch)
    }
    renderer.render(scene, camera)
    onReady(true)
    if (entrance || current.distanceTo(target) > 0.00001) schedule()
  }

  function schedule() {
    if (!disposed && contextAvailable && !frame && visible && !document.hidden) frame = requestAnimationFrame(render)
  }

  function resize() {
    const width = Math.max(host.clientWidth, 1)
    const height = Math.max(host.clientHeight, 1)
    const aspect = width / height
    const fitHeight = Math.max(frameHeight, frameWidth / aspect)
    camera.left = frameX - fitHeight * aspect / 2
    camera.right = frameX + fitHeight * aspect / 2
    camera.top = frameY + fitHeight / 2
    camera.bottom = frameY - fitHeight / 2
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)
    schedule()
  }

  function resetPointer() {
    target.set(0, 0)
    schedule()
  }

  function move(event: PointerEvent) {
    // Let the entrance settle into the home pose before accepting mouse input.
    if (entrance || motion.matches || !pointer.matches || event.pointerType !== 'mouse') return
    target.set(
      THREE.MathUtils.clamp(event.clientX / window.innerWidth * 2 - 1, -1, 1) * 0.09,
      THREE.MathUtils.clamp(event.clientY / window.innerHeight * 2 - 1, -1, 1) * 0.055
    )
    schedule()
  }

  function motionChanged() {
    entrance = false
    if (motion.matches) current.set(0, 0)
    resetPointer()
  }

  function visibilityChanged() {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      frame = 0
      resetPointer()
    } else {
      previous = performance.now()
      schedule()
    }
  }

  function contextLost(event: Event) {
    event.preventDefault()
    contextAvailable = false
    onReady(false)
    cancelAnimationFrame(frame)
    frame = 0
  }

  function contextRestored() {
    contextAvailable = true
    resize()
  }

  const resizeObserver = new ResizeObserver(resize)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting)
    if (visible) {
      started = entrance ? performance.now() : started
      previous = performance.now()
      schedule()
    } else {
      cancelAnimationFrame(frame)
      frame = 0
    }
  })
  resizeObserver.observe(host)
  intersectionObserver.observe(host)
  window.addEventListener('pointermove', move, { passive: true })
  document.documentElement.addEventListener('pointerleave', resetPointer)
  window.addEventListener('blur', resetPointer)
  document.addEventListener('visibilitychange', visibilityChanged)
  motion.addEventListener('change', motionChanged)
  pointer.addEventListener('change', resetPointer)
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  renderer.domElement.addEventListener('webglcontextrestored', contextRestored)
  resize()

  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    window.removeEventListener('pointermove', move)
    document.documentElement.removeEventListener('pointerleave', resetPointer)
    window.removeEventListener('blur', resetPointer)
    document.removeEventListener('visibilitychange', visibilityChanged)
    motion.removeEventListener('change', motionChanged)
    pointer.removeEventListener('change', resetPointer)
    renderer.domElement.removeEventListener('webglcontextlost', contextLost)
    renderer.domElement.removeEventListener('webglcontextrestored', contextRestored)
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose()
    })
    material.dispose()
    renderer.dispose()
    renderer.domElement.remove()
  }
}
