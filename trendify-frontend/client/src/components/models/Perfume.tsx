import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Bottle: THREE.Mesh
    Bottle001: THREE.Mesh
    Bottle002: THREE.Mesh
    Dispenser: THREE.Mesh
    DispenserRing: THREE.Mesh
    Lid: THREE.Mesh
    Tube: THREE.Mesh
  }
  materials: {
    Glass: THREE.MeshPhysicalMaterial
    ['Material.003']: THREE.MeshStandardMaterial
    ['Material.005']: THREE.MeshPhysicalMaterial
    ['Car plastic dark']: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
  }
}

export function Perfume(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('./models/perfume.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Bottle.geometry} material={materials.Glass} position={[-0.015, 1.79, -0.002]} scale={1497.823} castShadow>
        <mesh geometry={nodes.Bottle001.geometry} material={materials['Material.003']} scale={1.018} castShadow/>
        <mesh geometry={nodes.Bottle002.geometry} material={materials['Material.005']} scale={[0.991, 0.99, 0.991]} castShadow/>
        <mesh geometry={nodes.Dispenser.geometry} material={materials['Car plastic dark']} position={[0.001, 0.052, 0]} castShadow/>
        <mesh geometry={nodes.DispenserRing.geometry} material={materials['Car plastic dark']} position={[0, 0.054, 0]} castShadow/>
        <mesh geometry={nodes.Lid.geometry} material={materials['Car plastic dark']} position={[0, 0.054, 0]} rotation={[Math.PI, -0.659, 0]} castShadow/>
        <mesh geometry={nodes.Tube.geometry} material={materials.Material} position={[0.003, 0.018, 0]} />
      </mesh>
    </group>
  )
}

useGLTF.preload('./models/perfume.glb')
