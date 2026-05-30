import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../../context/SceneContext';
import { useAchievements } from '../../../../context/AchievementsContext';
import { useAudio } from '../../../../context/AudioManager';
import PaperAirplane from '../About/PaperAirplane';
//import InfiniteSkyManager from '../path/to/InfiniteSkyManager';

// Config
const CHUNK_LENGTH = 40;
const SEGMENT_SPACING = 40;

export const AUDIO_SETTINGS = {
    volume: 2.0,
    distance: 2,
    rolloff: 0.8
};

const experienceText = `Backend Engineer Intern\nCompany: AndAI (November 2025 – February 2026)\n• Contributed to live backend systems, supporting development and testing in production environments.\n• Worked extensively on backend development using FastAPI and MCP concepts, including building, testing, maintaining and integrating LLM-based services.\n• Performed backend testing and prototyping, building dummy backends with Supabase, experimenting with vector databases, and creating automation workflows using n8n / Flow Enterprise.`;

const skillsText = `Programming Languages: Python, Basic Java, C/C++, JavaScript, PHP, R

Backend & API Development: FastAPI, API Integration, MCP (Model Context Protocol)

AI, LLMs & Agent Systems: Chatbot Development, Autonomous AI Agents, Function Calling, Agent Orchestration, RAG, Prompt Engineering, LangChain

Databases & Data Systems: SQL, Supabase (PostgreSQL), Vector Databases (embeddings, similarity search)

Automation & Workflows: n8n, Flow Enterprise, API-driven Workflow Automation

MLOps & Developer Tools: Git, GitHub, GitHub Actions (basic), DevOps Fundamentals, Basic Docker, Basic Postman

Web Technologies: HTML, CSS

Cloud & Platforms: Siemens Insights Hub

Data Science: Exploratory Data Analysis (EDA), Feature Engineering, Model Validation, Excel

Soft Skills: Backend Problem-Solving, Analytical Thinking, Adaptability in Fast-Paced Environments`;
const StudioRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
    const roomRef = useRef();
    const airplaneGroupRef = useRef();
    const cloud1Ref = useRef();
    const cloud2Ref = useRef();
    const { camera } = useThree();
    const { isTeleporting } = useScene();
    const { showTutorial, unlockAchievement, hidePopup } = useAchievements();
    const { globalVolume, isMuted } = useAudio();
    const effectiveVolume = isMuted ? 0 : AUDIO_SETTINGS.volume * globalVolume;

    const audioRef = useRef();
    useEffect(() => {
        if (audioRef.current && audioRef.current.setVolume) {
            audioRef.current.setVolume(effectiveVolume);
        }
    }, [effectiveVolume]);

    // Momentum scroll state
    const scrollPosition = useRef(0);
    const scrollVelocity = useRef(0);

    // Flight effect
    const currentBank = useRef(0);
    const currentPitch = useRef(0);
    const isFlightActive = useRef(false);
    const baseCameraRotation = useRef({ x: 0, y: 0, z: 0 });

    // Ready detection
    const hasSignaledReady = useRef(false);
    const frameCount = useRef(0);
    const FRAMES_TO_WAIT = 25;

    useFrame((state, delta) => {
        if (isTeleporting) return;

        // Apply momentum
        scrollPosition.current += scrollVelocity.current * delta * 60;
        scrollVelocity.current *= 0.95;
        if (Math.abs(scrollVelocity.current) < 0.001) scrollVelocity.current = 0;

        // Loop positions
        const cycleLength = SEGMENT_SPACING * 2;
        if (scrollPosition.current > cycleLength) scrollPosition.current -= cycleLength;
        if (scrollPosition.current < -cycleLength) scrollPosition.current += cycleLength;

        // Flight activation
        if (!isFlightActive.current && Math.abs(scrollPosition.current) > 0.5) {
            isFlightActive.current = true;
            baseCameraRotation.current = { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z };
        }

        if (isFlightActive.current) {
            const chunkProgress = (scrollPosition.current % CHUNK_LENGTH) / CHUNK_LENGTH;
            let bankAngle = Math.sin(chunkProgress * Math.PI * 2) * 0.12;
            let pitchAngle = Math.sin(chunkProgress * Math.PI * 4) * 0.05;
            const flightProgress = Math.min(1, Math.abs(scrollPosition.current) / 5.0);
            bankAngle *= flightProgress;
            pitchAngle *= flightProgress;
            const lerpSpeed = 1 - Math.pow(0.02, delta);
            currentBank.current = THREE.MathUtils.lerp(currentBank.current, bankAngle, lerpSpeed);
            currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, pitchAngle, lerpSpeed);
            camera.rotation.x = baseCameraRotation.current.x + currentPitch.current;
            camera.rotation.z = baseCameraRotation.current.z + currentBank.current;
        } else {
            currentBank.current = 0;
            currentPitch.current = 0;
        }

        if (airplaneGroupRef.current) {
            airplaneGroupRef.current.rotation.x = currentPitch.current * 3 + 0.1;
            airplaneGroupRef.current.rotation.z = -currentBank.current * 2;
        }

        // Update cloud positions to follow scroll
        if (cloud1Ref.current) {
            cloud1Ref.current.position.z = -15 + scrollPosition.current;
        }
        if (cloud2Ref.current) {
            cloud2Ref.current.position.z = -15 - SEGMENT_SPACING + scrollPosition.current;
        }

        if (!hasSignaledReady.current) {
            frameCount.current++;
            if (frameCount.current >= FRAMES_TO_WAIT) {
                hasSignaledReady.current = true;
                onReady?.();
                if (!isWarmup) setTimeout(() => showTutorial('studio_interact'), 2000);
            }
        }
    });

    useEffect(() => {
        if (isExiting || isTeleporting) hidePopup();
    }, [isExiting, isTeleporting, hidePopup]);

    // Wheel & touch handlers
    useEffect(() => {
        const handleWheel = (e) => {
            scrollVelocity.current += e.deltaY * 0.002;
            unlockAchievement('studio_interact');
        };
        let lastTouchY = 0;
        const handleTouchStart = (e) => { if (e.touches.length === 1) lastTouchY = e.touches[0].clientY; };
        const handleTouchMove = (e) => {
            if (e.touches.length === 1) {
                const deltaY = lastTouchY - e.touches[0].clientY;
                lastTouchY = e.touches[0].clientY;
                scrollVelocity.current += deltaY * 0.005;
                unlockAchievement('studio_interact');
            }
        };
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [unlockAchievement]);

    return (
        <>
       {/* EXPERIENCE CLOUD */}
<Float speed={0.8} rotationIntensity={0.04} floatIntensity={0.25}>
    <group ref={cloud1Ref} position={[0, 2, -15]}>

       {/* <mesh>
            <planeGeometry args={[0, 0]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.95}
                side={THREE.DoubleSide}
            />
        </mesh>*/}
<Text
    position={[-3.4, 1.7, 0.1]}
    fontSize={0.9}
    color="#111111"
    font="/fonts/CabinSketch-Bold.ttf"
    anchorX="centre"
    anchorY="center"
>
    EXPERIENCE
</Text>

<Text
    position={[-3.4, 0.8, 0.1]}
    fontSize={0.22}
    color="#333333"
    font="/fonts/CabinSketch-Regular.ttf"
    anchorX="left"
    anchorY="top"
    maxWidth={6.8}
    textAlign="left"
    lineHeight={1.35}
>
    {experienceText}
</Text>

    </group>
</Float>

{/* TECHNICAL SKILLS CLOUD */}
<Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.2}>
    <group ref={cloud2Ref} position={[0, 2, -15 - SEGMENT_SPACING]}>

       {/* <mesh>
            <planeGeometry args={[5, 4]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.95}
                side={THREE.DoubleSide}
            />
        </mesh>*/}

       <Text
    position={[-3.4, 1.5, 0.1]}
    fontSize={0.80}
    color="#111111"
    font="/fonts/CabinSketch-Bold.ttf"
    anchorX="middle"
    anchorY="middle"
>
    TECHNICAL SKILLS
</Text>

<Text
    position={[-3.4, 1.0, 0.1]}
    fontSize={0.22}
    color="#333333"
    font="/fonts/CabinSketch-Regular.ttf"
    anchorX="left"
    anchorY="top"
    maxWidth={6.8}
    textAlign="left"
    lineHeight={1.2}
>
    {skillsText}
</Text>
    </group>
</Float>
        </>
    );
};

export default StudioRoom;
