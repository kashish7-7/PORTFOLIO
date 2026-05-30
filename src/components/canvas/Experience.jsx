import { useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import InfiniteCorridorManager from './corridor/InfiniteCorridorManager';
import TeleportRoom from './corridor/TeleportRoom';
import RoomWarmup from './corridor/RoomWarmup';

import useInfiniteCamera from '../../hooks/useInfiniteCamera';
import { useScene } from '../../context/SceneContext';

/**
 * CLEAN EXPERIENCE COMPONENT
 * 
 * Directly opens into portfolio experience
 * without intro doors or loading entrance.
 */

const Experience = ({ onSceneReady, performanceTier }) => {

    // Scene state
    const {
        hasEntered,
        markEntered,
        enterRoom,
        isTeleporting,
        isInRoom
    } = useScene();

    const { camera } = useThree();

    /**
     * AUTO ENTER PORTFOLIO
     * Skips entrance sequence completely
     */
    useEffect(() => {
        markEntered();
    }, []);

    /**
     * Camera controls
     */
    const { setCameraOverride } = useInfiniteCamera({
        segmentLength: 80,
        scrollSpeed: 0.025,
        parallaxIntensity: 0.4,
        smoothing: 0.06,

        scrollEnabled:
            hasEntered &&
            !isTeleporting &&
            !isInRoom,

        parallaxEnabled:
            hasEntered &&
            !isTeleporting &&
            !isInRoom
    });

    /**
     * Door enter handler
     */
    const handleDoorEnter = useCallback((doorId) => {
        enterRoom(doorId);
    }, [enterRoom]);

    /**
     * Performance optimization
     */
    const isLowTier = performanceTier === 'LOW';

    return (
        <>
            {/* ========================= */}
            {/* ROOM WARMUP */}
            {/* ========================= */}

            <RoomWarmup
                onWarmupComplete={onSceneReady}
                isLowTier={isLowTier}
            />

            {/* ========================= */}
            {/* MAIN INFINITE CORRIDOR */}
            {/* ========================= */}

            <InfiniteCorridorManager
                onDoorEnter={handleDoorEnter}

                // Always visible now
                hideDoorsForSegments={[]}

                // No clipping anymore
                clipSegmentNeg1={false}

                setCameraOverride={setCameraOverride}
            />

            {/* ========================= */}
            {/* TELEPORT ROOM */}
            {/* ========================= */}

            <TeleportRoom />
        </>
    );
};

export default Experience;