"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sparkles, Text, Center } from "@react-three/drei"
import * as THREE from "three"

function Skull() {
  const skullRef = useRef<THREE.Group>(null)
  const jawRef = useRef<THREE.Mesh>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (skullRef.current) {
      skullRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4
      skullRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    // Jaw movement (talking effect)
    if (jawRef.current) {
      jawRef.current.position.y = -0.25 + Math.sin(state.clock.elapsedTime * 8) * 0.03
    }
    // Pulsing eyes
    if (eyeLeftRef.current && eyeRightRef.current) {
      const intensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.5
      const material = eyeLeftRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = intensity
      const materialRight = eyeRightRef.current.material as THREE.MeshStandardMaterial
      materialRight.emissiveIntensity = intensity
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={skullRef}>
        {/* Main skull */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color="#1a1a2e"
            emissive="#ff3296"
            emissiveIntensity={0.2}
            roughness={0.4}
            metalness={0.8}
            distort={0.15}
            speed={2}
          />
        </mesh>

        {/* Eye sockets */}
        <mesh position={[-0.25, 0.15, 0.65]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.25, 0.15, 0.65]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Glowing eyes */}
        <mesh ref={eyeLeftRef} position={[-0.25, 0.15, 0.7]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff3296" emissive="#ff3296" emissiveIntensity={1.5} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.25, 0.15, 0.7]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff3296" emissive="#ff3296" emissiveIntensity={1.5} />
        </mesh>

        {/* Nose cavity */}
        <mesh position={[0, -0.1, 0.7]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.08, 0.15, 3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Jaw */}
        <mesh ref={jawRef} position={[0, -0.25, 0.3]}>
          <boxGeometry args={[0.5, 0.15, 0.4]} />
          <MeshDistortMaterial
            color="#1a1a2e"
            emissive="#ff3296"
            emissiveIntensity={0.15}
            roughness={0.4}
            metalness={0.8}
            distort={0.1}
            speed={1}
          />
        </mesh>

        {/* Teeth */}
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, -0.2, 0.55]}>
            <boxGeometry args={[0.06, 0.1, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ff3296" emissiveIntensity={0.3} />
          </mesh>
        ))}

        {/* Crown / flames effect */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin((i / 5) * Math.PI * 2) * 0.4,
              0.7 + Math.random() * 0.2,
              Math.cos((i / 5) * Math.PI * 2) * 0.4
            ]}
          >
            <coneGeometry args={[0.08, 0.3 + Math.random() * 0.2, 4]} />
            <meshStandardMaterial 
              color="#ff3296" 
              emissive="#ff0066" 
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

        {/* Fire particles */}
        <Sparkles
          count={50}
          scale={3}
          size={4}
          speed={1}
          color="#ff3296"
        />
      </group>
    </Float>
  )
}

function TextLogo() {
  const textRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={textRef} position={[0, -1.5, 0]}>
      <Center>
        <Text
          font="/fonts/Geist-Bold.ttf"
          fontSize={0.5}
          color="#ff3296"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#ff0066"
        >
          PITCH ROASTER
        </Text>
      </Center>
    </group>
  )
}

export function FloatingSkull() {
  return (
    <div className="w-full h-[350px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ff3296" />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00f0ff" />
        <spotLight
          position={[0, 5, 3]}
          angle={0.5}
          penumbra={0.5}
          intensity={1}
          color="#ff3296"
        />
        
        <Skull />
        <TextLogo />
      </Canvas>
      
      {/* Glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(255, 50, 150, 0.2) 0%, transparent 60%)"
        }}
      />
    </div>
  )
}
