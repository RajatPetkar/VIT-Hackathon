
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Text, Float, useTexture, Environment, Stars } from "@react-three/drei";
import { Mesh, Group, Vector3 } from "three";

// Book component that shows a 3D book
const Book = ({ position, rotation, color = "#4c80f0" }) => {
  const bookRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (bookRef.current) {
      bookRef.current.rotation.y += delta * 0.2;
    }
  });
  
  return (
    <group ref={bookRef} position={position} rotation={rotation}>
      {/* Book cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      
      {/* Book pages */}
      <mesh position={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[1.9, 2.9, 0.05]} />
        <meshStandardMaterial color="#fff" roughness={0.3} />
      </mesh>
      
      {/* Book title */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.3}
        color="#1a1a1a"
        font="/fonts/Inter-Bold.woff"
        maxWidth={1.5}
        textAlign="center"
      >
        EduVerse
      </Text>
    </group>
  );
};

// Subject Sphere - represents course subjects that float around
const SubjectSphere = ({ position, color, label, size = 1 }) => {
  const sphereRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  
  useFrame((state) => {
    if (sphereRef.current) {
      // Make sphere pulse slightly
      sphereRef.current.scale.x = sphereRef.current.scale.y = sphereRef.current.scale.z = 
        size * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      
      if (hovered) {
        sphereRef.current.rotation.y += 0.03;
      } else {
        sphereRef.current.rotation.y += 0.01;
      }
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={sphereRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive(!active)}
        scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.3} 
          metalness={0.2} 
        />
      </mesh>
      
      <Text
        position={[0, size * 1.5, 0]}
        fontSize={size * 0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

// Floating particles that move randomly through the scene
const Particles = ({ count = 50 }) => {
  const points = useRef<Group>(null);
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.2;
    }
  });
  
  return (
    <group ref={points}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#4c80f0" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// Orbit - a ring with a planet orbiting around
const Orbit = ({ position, rotation, radius = 3, planetColor = "#4c80f0" }) => {
  const orbitRef = useRef<Group>(null);
  const planetRef = useRef<Mesh>(null);
  const [planetPos, setPlanetPos] = useState(new Vector3(radius, 0, 0));
  
  useFrame((state) => {
    if (orbitRef.current && planetRef.current) {
      orbitRef.current.rotation.y += 0.005;
      
      // Calculate planet position
      const angle = state.clock.elapsedTime * 0.5;
      setPlanetPos(new Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
    }
  });
  
  return (
    <group position={position} rotation={rotation} ref={orbitRef}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
        <meshBasicMaterial color="#8ba4e8" transparent opacity={0.4} side={2} />
      </mesh>
      
      {/* Planet */}
      <mesh ref={planetRef} position={planetPos} castShadow>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial 
          color={planetColor} 
          roughness={0.3} 
          metalness={0.5} 
          emissive={planetColor}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// Main scene component that uses Three.js
const Scene = () => {
  return (
    <>
      <color attach="background" args={["#050816"]} />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        minDistance={6}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      {/* Main book */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Book position={[0, 0, 0]} rotation={[0.2, 0.5, 0]} />
      </Float>
      
      {/* Subject spheres */}
      <SubjectSphere position={[-4, 2, -2]} color="#4c80f0" label="Math" size={0.8} />
      <SubjectSphere position={[4, -1, -3]} color="#f04c4c" label="Science" size={0.7} />
      <SubjectSphere position={[-3, -2, 1]} color="#4cf08e" label="History" size={0.6} />
      <SubjectSphere position={[3, 3, 1]} color="#f0db4c" label="Arts" size={0.7} />
      
      {/* Orbits */}
      <Orbit position={[0, 0, 0]} rotation={[0.3, 0.5, 0]} radius={5} planetColor="#4cf0e3" />
      <Orbit position={[0, 0, 0]} rotation={[0.7, 0.2, 0.5]} radius={7} planetColor="#f04ca6" />
      
      {/* Particles */}
      <Particles count={100} />
      
      {/* Stars background */}
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
      
      {/* Environment lighting */}
      <Environment preset="night" />
    </>
  );
};

// Main ThreeCanvas component
const ThreeCanvas = () => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} className="w-full h-full">
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
