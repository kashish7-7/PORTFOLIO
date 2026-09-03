import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import SkyChunk, { CHUNK_LENGTH, ROOM_Z } from './SkyChunk';

/**
 * InfiniteSkyManager Component
 * 
 * Manages dynamic generation/removal of sky chunks for infinite scroll.
 * World group moves with scroll, chunks stay at fixed positions relative to group.
 * Loops through Intro and Education milestones!
 */

// Two milestones per cycle (2 chunks = 80 units)
const STORY_CYCLE_LENGTH = 80;

// Clipping Z coordinate to prevent elements from entering the corridor
const MILESTONE_CORRIDOR_CLIP_Z = -8.0;

const InfiniteSkyManager = ({ scrollProgressRef }) => {
    const [activeChunks, setActiveChunks] = useState([-1, 0, 1, 2]);
    const [activeStoryCycles, setActiveStoryCycles] = useState([-1, 0, 1]);
    const worldRef = useRef();

    // Track current chunk for recycling
    const getCurrentChunk = (worldZ) => {
        return Math.floor(worldZ / CHUNK_LENGTH);
    };

    // Track current story cycle
    const getCurrentStoryCycle = (worldZ) => {
        return Math.floor(worldZ / STORY_CYCLE_LENGTH);
    };

    // Update chunks based on world position
    useFrame(() => {
        if (!worldRef.current) return;

        const scrollProgress = scrollProgressRef?.current || 0;

        // Move world group along Z axis
        worldRef.current.position.z = scrollProgress;

        // Recycle sky chunks
        const currentChunk = getCurrentChunk(scrollProgress);
        const shouldBeActiveChunks = [
            currentChunk - 1,
            currentChunk,
            currentChunk + 1,
            currentChunk + 2,
        ];

        const chunksNeedUpdate = shouldBeActiveChunks.some(c => !activeChunks.includes(c)) ||
            activeChunks.some(c => !shouldBeActiveChunks.includes(c));

        if (chunksNeedUpdate) {
            setActiveChunks(shouldBeActiveChunks);
        }

        // Recycle story cycles
        const currentStoryCycle = getCurrentStoryCycle(scrollProgress);
        const shouldBeActiveCycles = [
            currentStoryCycle - 1,
            currentStoryCycle,
            currentStoryCycle + 1,
        ];

        const cyclesNeedUpdate = shouldBeActiveCycles.some(c => !activeStoryCycles.includes(c)) ||
            activeStoryCycles.some(c => !shouldBeActiveCycles.includes(c));

        if (cyclesNeedUpdate) {
            setActiveStoryCycles(shouldBeActiveCycles);
        }
    });

    return (
        <group ref={worldRef}>
            {/* === SKY CHUNKS WITH CLOUDS === */}
            {activeChunks.map((chunkIndex) => (
                <SkyChunk
                    key={`sky-chunk-${chunkIndex}`}
                    chunkIndex={chunkIndex}
                    seed={42}
                    scrollProgressRef={scrollProgressRef}
                />
            ))}

            {/* === STORY MILESTONES (loop every 80 units) === */}
            {activeStoryCycles.map((cycleIndex) => (
                <group key={`story-cycle-${cycleIndex}`}>
                    {/* === INTRO MILESTONE === */}
                    <IntroMilestone
                        z={-(cycleIndex * STORY_CYCLE_LENGTH + 15)}
                        scrollProgressRef={scrollProgressRef}
                    />

                    {/* === EDUCATION MILESTONE === */}
                    <EducationMilestone
                        z={-(cycleIndex * STORY_CYCLE_LENGTH + 55)}
                        scrollProgressRef={scrollProgressRef}
                    />
                </group>
            ))}
        </group>
    );
};

/**
 * INTRO Milestone - Kashish & Description
 * Spreads apart when you fly close
 */
const IntroMilestone = ({ z, scrollProgressRef }) => {
    const groupRef = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        // Hard clip world Z position to hide elements in the corridor
        const scrollProgress = scrollProgressRef?.current || 0;
        const worldZ = ROOM_Z + scrollProgress + z;
        groupRef.current.visible = worldZ < MILESTONE_CORRIDOR_CLIP_Z;

        if (!groupRef.current.visible) return;

        const distanceZ = z + scrollProgress - 55;

        // Spread effect as elements approach the camera
        const spreadStart = -70;
        const spreadEnd = -50;
        let spreadFactor = 0;

        if (distanceZ > spreadStart && distanceZ < spreadEnd) {
            spreadFactor = (distanceZ - spreadStart) / (spreadEnd - spreadStart);
            spreadFactor = Math.min(1, Math.max(0, spreadFactor));
            spreadFactor = spreadFactor * spreadFactor;
        } else if (distanceZ >= spreadEnd) {
            spreadFactor = 1;
        }

        const maxSpread = 15;

        if (titleRef.current) {
            // Drift slightly and spread left
            titleRef.current.position.x = -spreadFactor * maxSpread * 0.8;
            titleRef.current.position.y = 2.5 + Math.sin(time * 0.5) * 0.1;
        }
        if (descriptionRef.current) {
            // Drift slightly and spread right
            descriptionRef.current.position.x = spreadFactor * maxSpread * 0.8;
            descriptionRef.current.position.y = 0.2 + Math.sin(time * 0.4) * 0.08;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, z]}>
            {/* Main title - Name */}
            <Text
                ref={titleRef}
                position={[0, 2.5, 0.1]}
                fontSize={1.5}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/fonts/RubikScribble-Regular.ttf"
            >
                KASHISH
            </Text>

            {/* Description */}
            <Text
                ref={descriptionRef}
                position={[0, 0.2, 0.1]}
                fontSize={0.32}
                color="#4a4a4a"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Regular.ttf"
                maxWidth={9}
                textAlign="center"
                lineHeight={1.3}
            >
                Backend & AI Systems Engineer with hands-on expertise in architecting and deploying FastAPI backend services, LLM-powered integrations, and autonomous AI agents. Skilled in workflow automation, vector database search, and scalable backend architecture, backed by practical experience in live production environments.
            </Text>
        </group>
    );
};

/**
 * EDUCATION Milestone - MCA & BCA details
 * Spreads apart when you fly close
 */
const EducationMilestone = ({ z, scrollProgressRef }) => {
    const groupRef = useRef();
    const titleRef = useRef();
    const mcaRef = useRef();
    const bcaRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;

        const scrollProgress = scrollProgressRef?.current || 0;
        const worldZ = ROOM_Z + scrollProgress + z;
        groupRef.current.visible = worldZ < MILESTONE_CORRIDOR_CLIP_Z;

        if (!groupRef.current.visible) return;

        const distanceZ = z + scrollProgress - 55;

        // Spread effect as elements approach the camera
        const spreadStart = -70;
        const spreadEnd = -50;
        let spreadFactor = 0;

        if (distanceZ > spreadStart && distanceZ < spreadEnd) {
            spreadFactor = (distanceZ - spreadStart) / (spreadEnd - spreadStart);
            spreadFactor = Math.min(1, Math.max(0, spreadFactor));
            spreadFactor = spreadFactor * spreadFactor;
        } else if (distanceZ >= spreadEnd) {
            spreadFactor = 1;
        }

        const maxSpread = 15;

        if (titleRef.current) {
            titleRef.current.position.y = 5.5 + spreadFactor * 2;
        }
        if (mcaRef.current) {
            mcaRef.current.position.x = -3.5 - spreadFactor * maxSpread * 0.7;
        }
        if (bcaRef.current) {
            bcaRef.current.position.x = 3.5 + spreadFactor * maxSpread * 0.7;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, z]}>
            {/* Title */}
            <Text
                ref={titleRef}
                position={[0, 5.5, 0.1]}
                fontSize={1.2}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/fonts/RubikScribble-Regular.ttf"
            >
                EDUCATION
            </Text>

            {/* Master of Computer Applications (MCA) */}
            <group ref={mcaRef} position={[-3.5, 2, 0]}>
                <Text
                    position={[0, 0.8, 0.1]}
                    fontSize={0.4}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Bold.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    Master of Computer Applications
                </Text>
                <Text
                    position={[0, 0.1, 0.1]}
                    fontSize={0.3}
                    color="#4a4a4a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Regular.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    Generative AI
                </Text>
                <Text
                    position={[0, -0.4, 0.1]}
                    fontSize={0.28}
                    color="#555555"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Regular.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    SRM University of Science and Technology, Kattankulathur, Tamil Nadu (2025 - Present)
                </Text>
                <Text
                    position={[0, -1.1, 0.1]}
                    fontSize={0.35}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Bold.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    GPA Semester 1: 9.00/10.00
                </Text>
            </group>

            {/* Bachelor of Computer Applications (BCA) */}
            <group ref={bcaRef} position={[3.5, 2, 0]}>
                <Text
                    position={[0, 0.8, 0.1]}
                    fontSize={0.4}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Bold.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    Bachelor of Computer Applications
                </Text>
                <Text
                    position={[0, 0.1, 0.1]}
                    fontSize={0.3}
                    color="#4a4a4a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Regular.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    BCA
                </Text>
                <Text
                    position={[0, -0.4, 0.1]}
                    fontSize={0.28}
                    color="#555555"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Regular.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    MIT World Peace University, Pune, Maharashtra (Aug 2022 - June 2025)
                </Text>
                <Text
                    position={[0, -1.1, 0.1]}
                    fontSize={0.35}
                    color="#1a1a1a"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/CabinSketch-Bold.ttf"
                    maxWidth={5.5}
                    textAlign="center"
                >
                    CGPA: 8.00/10.00
                </Text>
            </group>
        </group>
    );
};

export default InfiniteSkyManager;
