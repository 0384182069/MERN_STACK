import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Perfume } from './models/Perfume';

const Scene = () => {
 
  return (
      <Canvas shadows camera={{ position: [0, 3, 22], fov: 40 }}>
        <OrbitControls target={[0,0,0]} enableZoom={false} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 2.1}/>
        <Environment preset='studio' background={false} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
      
        <Float speed={3.5} rotationIntensity={1} floatIntensity={1}>
          <Perfume scale={0.07} position={[0, 0, 0]} castShadow receiveShadow />
        </Float>
        <ContactShadows position={[0, -5, 0]} opacity={1} scale={12} blur={2} />
      </Canvas>
  );
}

export default Scene;
