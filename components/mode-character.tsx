"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sparkles, Trail, Environment } from "@react-three/drei"
import * as THREE from "three"

interface ModeCharacterProps {
  mode: "savage" | "nice"
}

function DevilCharacter() {
  const groupRef = useRef<THREE.Group>(null)
  const tridentRef = useRef<THREE.Group>(null)
  const eyeLeftRef = useRef<THREE.Mesh>(null)
  const eyeRightRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
    if (tridentRef.current) {
      tridentRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1
    }
    // Pulsing eyes
    if (eyeLeftRef.current && eyeRightRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2
      eyeLeftRef.current.scale.setScalar(scale)
      eyeRightRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshDistortMaterial
            color="#ff2060"
            emissive="#ff0040"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
            distort={0.2}
            speed={2}
          />
        </mesh>

        {/* Left Horn */}
        <mesh position={[-0.35, 1.4, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.12, 0.5, 8]} />
          <meshStandardMaterial color="#1a0010" emissive="#ff0040" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Right Horn */}
        <mesh position={[0.35, 1.4, 0]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.12, 0.5, 8]} />
          <meshStandardMaterial color="#1a0010" emissive="#ff0040" emissiveIntensity={0.3} />
        </mesh>

        {/* Eyes */}
        <mesh ref={eyeLeftRef} position={[-0.2, 0.9, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffff00" emissive="#ff6600" emissiveIntensity={2} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.2, 0.9, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffff00" emissive="#ff6600" emissiveIntensity={2} />
        </mesh>

        {/* Evil Grin */}
        <mesh position={[0, 0.6, 0.55]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Body */}
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 8, 16]} />
          <MeshDistortMaterial
            color="#cc1040"
            emissive="#ff0030"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.6}
            distort={0.15}
            speed={1.5}
          />
        </mesh>

        {/* Trident */}
        <group ref={tridentRef} position={[0.9, 0, 0]}>
          {/* Handle */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
            <meshStandardMaterial color="#2a0a0a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Center prong */}
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.06, 0.4, 6]} />
            <meshStandardMaterial color="#ff3060" emissive="#ff0040" emissiveIntensity={0.8} metalness={0.9} />
          </mesh>
          {/* Left prong */}
          <mesh position={[-0.15, 0.55, 0]} rotation={[0, 0, 0.3]}>
            <coneGeometry args={[0.05, 0.3, 6]} />
            <meshStandardMaterial color="#ff3060" emissive="#ff0040" emissiveIntensity={0.8} metalness={0.9} />
          </mesh>
          {/* Right prong */}
          <mesh position={[0.15, 0.55, 0]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.05, 0.3, 6]} />
            <meshStandardMaterial color="#ff3060" emissive="#ff0040" emissiveIntensity={0.8} metalness={0.9} />
          </mesh>
        </group>

        {/* Tail */}
        <Trail
          width={0.3}
          length={6}
          color="#ff2060"
          attenuation={(t) => t * t}
        >
          <mesh position={[-0.5, -0.6, -0.3]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#ff0040" emissive="#ff0040" emissiveIntensity={1} />
          </mesh>
        </Trail>

        {/* Fire particles */}
        <Sparkles
          count={30}
          scale={2}
          size={3}
          speed={0.8}
          color="#ff4020"
        />
      </group>
    </Float>
  )
}

function AngelCharacter() {
  const groupRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const wingLeftRef = useRef<THREE.Mesh>(null)
  const wingRightRef = useRef<THREE.Mesh>(null)
  
  const wingShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.3, 0.2, 0.6, 0.5, 0.5, 0.8)
    shape.bezierCurveTo(0.4, 1.1, 0.1, 1.2, 0, 1)
    shape.bezierCurveTo(-0.05, 0.7, -0.02, 0.3, 0, 0)
    return shape
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
    // Wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flapAngle = Math.sin(state.clock.elapsedTime * 4) * 0.2
      wingLeftRef.current.rotation.y = -0.3 + flapAngle
      wingRightRef.current.rotation.y = 0.3 - flapAngle
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <MeshDistortMaterial
            color="#f0f8ff"
            emissive="#00ffcc"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.4}
            distort={0.1}
            speed={1}
          />
        </mesh>

        {/* Halo */}
        <mesh ref={haloRef} position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.06, 16, 32]} />
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffaa00" 
            emissiveIntensity={2}
            metalness={1}
            roughness={0}
          />
        </mesh>

        {/* Eyes - kind */}
        <mesh position={[-0.18, 0.85, 0.48]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00ccff" emissive="#00ffff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.18, 0.85, 0.48]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00ccff" emissive="#00ffff" emissiveIntensity={1} />
        </mesh>

        {/* Smile */}
        <mesh position={[0, 0.6, 0.52]} rotation={[Math.PI, 0, 0]}>
          <torusGeometry args={[0.15, 0.025, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#ff9999" />
        </mesh>

        {/* Body */}
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.38, 0.5, 8, 16]} />
          <MeshDistortMaterial
            color="#e8f4f8"
            emissive="#00ffcc"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.3}
            distort={0.08}
            speed={1}
          />
        </mesh>

        {/* Left Wing */}
        <mesh
          ref={wingLeftRef}
          position={[-0.5, 0.3, -0.2]}
          rotation={[0.2, -0.3, 0.1]}
          scale={[1.2, 1.2, 0.1]}
        >
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#88ffff"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Right Wing */}
        <mesh
          ref={wingRightRef}
          position={[0.5, 0.3, -0.2]}
          rotation={[0.2, 0.3, -0.1]}
          scale={[-1.2, 1.2, 0.1]}
        >
          <shapeGeometry args={[wingShape]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#88ffff"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Wand */}
        <group position={[0.7, 0.2, 0.3]} rotation={[0, 0, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Star on wand */}
          <mesh position={[0, 0.5, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffff88" 
              emissiveIntensity={2}
            />
          </mesh>
        </group>

        {/* Heavenly sparkles */}
        <Sparkles
          count={40}
          scale={2.5}
          size={2}
          speed={0.4}
          color="#88ffff"
        />
        <Sparkles
          count={20}
          scale={2}
          size={3}
          speed={0.3}
          color="#ffd700"
        />
      </group>
    </Float>
  )
}

function Scene({ mode }: { mode: "savage" | "nice" }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color={mode === "savage" ? "#ff4040" : "#88ffff"} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color={mode === "savage" ? "#ff0040" : "#ffd700"} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.5}
        penumbra={0.5}
        intensity={1}
        color={mode === "savage" ? "#ff2060" : "#00ffcc"}
      />
      
      <Environment preset={mode === "savage" ? "night" : "dawn"} />
      
      {mode === "savage" ? <DevilCharacter /> : <AngelCharacter />}
    </>
  )
}

export function ModeCharacter({ mode }: ModeCharacterProps) {
  return (
    <div className="w-full h-[280px] relative">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Scene mode={mode} />
      </Canvas>
      
      {/* Glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: mode === "savage" 
            ? "radial-gradient(circle at 50% 50%, rgba(255, 32, 96, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(0, 255, 204, 0.15) 0%, transparent 70%)"
        }}
      />
    </div>
  )
}
