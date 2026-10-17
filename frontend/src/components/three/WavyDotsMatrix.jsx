import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WavyDotsMatrix({
  color = '#ffffff',
  size = 0.09,
  opacity = 0.85,
  gridX = 90,
  gridZ = 44,
  spanX = 22,
  spanZ = 12,
  cameraY = 5.5,
  fov = 55,
  ampX = 0.6,
  ampZ = 0.5,
  freqX = 0.6,
  freqZ = 0.7,
  speedX = 1.2,
  speedZ = 1.0,
  className = '',
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 1
    let height = container.clientHeight || 1

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100)
    const halfFov = (fov * Math.PI) / 360
    const fitDist = Math.max(
      spanZ / (2 * Math.tan(halfFov)),
      spanX / (2 * Math.tan(halfFov) * (width / height))
    )
    camera.position.set(0, cameraY, fitDist)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    if (renderer.domElement.style) {
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
    }
    container.appendChild(renderer.domElement)

    // Step 1: Geometry - a 2D grid of points
    const count = gridX * gridZ
    const positions = new Float32Array(count * 3)
    const baseX = new Float32Array(count)
    const baseZ = new Float32Array(count)
    let p = 0
    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridZ; j++) {
        const x = (i / (gridX - 1) - 0.5) * spanX
        const z = (j / (gridZ - 1) - 0.5) * spanZ
        baseX[p] = x
        baseZ[p] = z
        positions[p * 3] = x
        positions[p * 3 + 1] = 0
        positions[p * 3 + 2] = z
        p++
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Step 2: Material - particle array / wavy dots matrix
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      depthWrite: false,
    })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Step 3: Animate with a sine wave over elapsed time
    const timer = new THREE.Timer()
    let raf
    const animate = () => {
      timer.update()
      const t = timer.getElapsed()
      const pos = geometry.attributes.position.array
      for (let k = 0; k < count; k++) {
        const x = baseX[k]
        const z = baseZ[k]
        pos[k * 3 + 1] =
          Math.sin(x * freqX + t * speedX) * ampX + Math.cos(z * freqZ + t * speedZ) * ampZ
      }
      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      width = container.clientWidth || 1
      height = container.clientHeight || 1
      camera.aspect = width / height
      const nextFit = Math.max(
        spanZ / (2 * Math.tan(halfFov)),
        spanX / (2 * Math.tan(halfFov) * (width / height))
      )
      camera.position.z = nextFit
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [color, size, opacity, gridX, gridZ, spanX, spanZ, cameraY, fov, ampX, ampZ, freqX, freqZ, speedX, speedZ])

  return <div ref={containerRef} className={className} />
}
