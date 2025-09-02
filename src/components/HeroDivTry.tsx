'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import { projectsArray } from "../data/projects";

const noise2D = createNoise2D();

/** Shape definition with defaults */
interface ShapeDef {
    id: string;
    w: number;
    h: number;
    rotation?: number;
}

/** Single state of a shape (position + optional size override) */
interface ShapeState {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    text?: string; // 👈 optional text to render in this state
    textRotation?: number; // 1 = rotate 90deg, 0/undefined = normal
}



/** Shape with multiple states */
interface ShapeWithStates extends ShapeDef {
    states: ShapeState[];
}

/** Scroll stage: start → end states, and scroll length in vh */
interface Stage {
    startStateIndex: number;
    endStateIndex: number;
    scrollLength: number;
}

function generateStages(projects: Project[]): Stage[] {
    const stages: Stage[] = [];
    let index = 2; // after intro states

    projects.forEach((_, i) => {
        // add 2 stages, one for each project state (A & B)
        stages.push({
            startStateIndex: index,
            endStateIndex: index + 1,
            scrollLength: 400,
        });
        stages.push({
            startStateIndex: index + 1,
            endStateIndex: index + 2,
            scrollLength: 600,
        });
        index += 2;
    });

    return stages;
}


/** Example stages */
const stages: Stage[] = [
    { startStateIndex: 0, endStateIndex: 1, scrollLength: 300 }, //reaches state Leff.in when 30 on top
    { startStateIndex: 1, endStateIndex: 1, scrollLength: 600 }, //stay at state leff.in till when 60 on top
    { startStateIndex: 1, endStateIndex: 2, scrollLength: 400 }, //converts to leffin. when 80 on top
    { startStateIndex: 2, endStateIndex: 2, scrollLength: 700 }, //stay a t state leffin. till when 100 on top

    // from 1400 px onwards, the shapes move with the scroll
    ...generateStages(projectsArray),
];

/** Hook to track vh/vw ratio */
const useVhVwRatio = () => {
    const [ratio, setRatio] = useState(() => window.innerWidth / 100);

    useEffect(() => {
        const updateRatio = () => setRatio(window.innerWidth / 100);
        window.addEventListener("resize", updateRatio);
        return () => window.removeEventListener("resize", updateRatio);
    }, []);

    return ratio;
};


/** Base shapes with default sizes */
const baseShapesDefs: ShapeDef[] = [
    { id: 'Lv', w: 15, h: 3, rotation: -90 },
    { id: 'Lh', w: 9, h: 3 },
    { id: 'Ev', w: 15, h: 3, rotation: -90 },
    { id: 'Et', w: 9, h: 3 },
    { id: 'Em', w: 9, h: 3 },
    { id: 'Eb', w: 9, h: 3 },
    { id: 'F1v', w: 15, h: 3, rotation: -90 },
    { id: 'F1t', w: 9, h: 3 },
    { id: 'F1m', w: 9, h: 3 },
    { id: 'F2v', w: 15, h: 3, rotation: -90 },
    { id: 'F2t', w: 9, h: 3 },
    { id: 'F2m', w: 9, h: 3 },
    { id: 'Dot', w: 3, h: 3 },
    { id: 'Iv', w: 15, h: 3, rotation: -90 },
    { id: 'Nl', w: 15, h: 3, rotation: -90 },
    { id: 'Nr', w: 15, h: 3, rotation: -90 },
    { id: 'Ns', w: 15.84, h: 3, rotation: 57.55 },
];

/** Fixed positions for state 1 */
const HeroState: Record<string, ShapeState> = {
    Lv: { x: 18 - 6, y: 0 + 6 },
    Lh: { x: 18, y: 12 },
    Ev: { x: 29 - 6, y: 0 + 6 },
    Et: { x: 29, y: 0 },
    Em: { x: 29, y: 6 },
    Eb: { x: 29, y: 12 },
    F1v: { x: 40 - 6, y: 0 + 6 },
    F1t: { x: 40, y: 0 },
    F1m: { x: 40, y: 6 },
    F2v: { x: 51 - 6, y: 0 + 6 },
    F2t: { x: 51, y: 0 },
    F2m: { x: 51, y: 6 },
    Dot: { x: 60, y: 12 },
    Iv: { x: 64 - 6, y: 0 + 6 },
    Nl: { x: 69 - 6, y: 0 + 6 },
    Nr: { x: 78 - 6, y: 0 + 6 },
    Ns: { x: 67.1, y: 6 },
};

const NameState: Record<string, ShapeState> = {
    Lv: { x: 18 - 6, y: 0 + 6 },
    Lh: { x: 18, y: 12 },
    Ev: { x: 29 - 6, y: 0 + 6 },
    Et: { x: 29, y: 0 },
    Em: { x: 29, y: 6 },
    Eb: { x: 29, y: 12 },
    F1v: { x: 40 - 6, y: 0 + 6 },
    F1t: { x: 40, y: 0 },
    F1m: { x: 40, y: 6 },
    F2v: { x: 51 - 6, y: 0 + 6 },
    F2t: { x: 51, y: 0 },
    F2m: { x: 51, y: 6 },
    Iv: { x: 61 - 6, y: 0 + 6 },
    Nl: { x: 66 - 6, y: 0 + 6 },
    Nr: { x: 75 - 6, y: 0 + 6 },
    Ns: { x: 64.1, y: 6 },
    Dot: { x: 79, y: 12 },
};

function generateProjectStates(
    projects: Project[],
    shapeDefs: ShapeDef[]
): Record<string, ShapeState>[] {
    const states: Record<string, ShapeState>[] = [];

    // Define shape lists
    const verticalList = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
    const horizontalList = ["Lh", "Et", "Em", "Eb", "F1t", "F1m", "F2t", "F2m"];

    projects.forEach((project, i) => {
        // Pick IDs by cycling
        const vId = verticalList[i % verticalList.length];
        const hId1 = horizontalList[(2 * i) % horizontalList.length];
        const hId2 = horizontalList[(2 * i + 1) % horizontalList.length];

        // Find actual shapeDefs by ID
        const chosen = [vId, hId1, hId2]
            .map((id) => shapeDefs.find((s) => s.id === id))
            .filter((s): s is ShapeDef => !!s); // drop undefined

        // Positioning
        const yFirst = [1100, 600, 1000]; // vertical is lower for name
        const xFirst = [20, 30, 70];    // adjust X positions

        const stateA: Record<string, ShapeState> = {};
        const stateB: Record<string, ShapeState> = {};

        chosen.forEach((shape, idx) => {
            const text =
                idx === 0
                    ? project.name        // vertical: name
                    : idx === 1
                        ? String(project.year)  // horizontal: year
                        : project.tags?.[0] ?? ""; // horizontal: first tag

            stateA[shape.id] = { x: xFirst[idx], y: yFirst[idx], text };
            stateB[shape.id] = { x: xFirst[idx], y: yFirst[idx] - 600, text };
        });

        // push states sequentially without merging
        states.push(stateA);

        states.push(stateB);
    });
    console.log("generated project states:", states);
    return states;
}




/** Linear interpolation */
const interpolate = (start: ShapeState, end: ShapeState, t: number): ShapeState => ({
    x: (start.x ?? 0) + ((end.x ?? 0) - (start.x ?? 0)) * t,
    y: (start.y ?? 0) + ((end.y ?? 0) - (start.y ?? 0)) * t,
    w: (start.w ?? 0) + ((end.w ?? start.w ?? 0) - (start.w ?? 0)) * t,
    h: (start.h ?? 0) + ((end.h ?? start.h ?? 0) - (start.h ?? 0)) * t,
    text: start.text === end.text ? start.text : "",

});

const useScrollY = () => {
    const [scrollY, setScrollY] = useState(0);
    const targetY = 500; // minimum scroll
    const isScrollingRef = useRef(false);

    useEffect(() => {
        let animationFrameId: number;
        let timeoutId: NodeJS.Timeout;

        const updateScroll = () => {
            const currentY = window.scrollY;

            if (currentY < targetY && !isScrollingRef.current) {
                const nextY = currentY + (targetY - currentY) * 0.03; // your preferred speed
                window.scrollTo({ top: nextY });
                animationFrameId = requestAnimationFrame(updateScroll);
                setScrollY(nextY);
            } else {
                setScrollY(currentY);
            }
        };

        // Delay start by 1 second
        timeoutId = setTimeout(() => {
            updateScroll();
        }, 1000);

        const onScroll = () => {
            isScrollingRef.current = true;
            setScrollY(window.scrollY);

            // Reset "isScrolling" after a short delay (100ms)
            setTimeout(() => {
                isScrollingRef.current = false;
                if (window.scrollY < targetY) {
                    updateScroll();
                }
            }, 100);
        };

        window.addEventListener('scroll', onScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return scrollY;
};






/** Generate shapes with resolved states (random once per shape, reused) */
const makeShape = (def: ShapeDef, stateArr: ShapeState[]): ShapeWithStates => {
    // const fallbackX = 5 + Math.random() * 80;
    // const fallbackY = 150 + Math.random() * 600;
    const fallbackX = + Math.random() * 90;
    const fallbackY = 50 + Math.random() * 800;
    // const fallbackX = 5;
    // const fallbackY = 150;
    const s = stateArr.map((st) => {
        const hasExplicitPos = st?.x !== undefined || st?.y !== undefined;
        const isRandom = !hasExplicitPos;

        return {
            x: st?.x ?? fallbackX,
            y: st?.y ?? fallbackY,
            w: (st?.w ?? def.w),
            h: (st?.h ?? def.h),
            text: st?.text,
            __random: isRandom,
        } as ShapeState & { __random?: boolean };
    });

    return { ...def, states: s };
};



const Hero: React.FC = () => {
    const ratio = useVhVwRatio();
    const shapesDefs = baseShapesDefs.map((s) => ({
        ...s,
        h: s.h * ratio,
    }));

    const scaleY = (state?: ShapeState) =>
        state ? { ...state, y: state.y !== undefined ? state.y * ratio + 350 : undefined } : state;

    const projectStateMaps = generateProjectStates(projectsArray, baseShapesDefs);

    const states: ShapeState[][] = shapesDefs.map((s) => [
        {},                          // 0
        scaleY(HeroState[s.id]),     // 1
        scaleY(NameState[s.id]),     // 2
        ...projectStateMaps.map((m) => m[s.id] ?? {}), // 3,4,5,...
    ]);

    const [shapes, setShapes] = useState<ShapeWithStates[]>(shapesDefs.map((def, i) => makeShape(def, states[i])));

    // Track mouse position for Dot
    const mousePos = useRef({ x: 60, y: 12 }); // default Dot pos
    const smoothedPos = useRef({ x: 60, y: 12 }); // for smooth follow
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = e.clientY; // keep px for y
            mousePos.current = { x, y };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollY = useScrollY();
    const vh = window.innerHeight;
    const timeRef = useRef(0);
    const [, setFrame] = useState(0); // trigger re-render

    // Animation loop for noise
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            timeRef.current += 0.01;
            setFrame((f) => f + 1);
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const getStageProgress = () => {
        let acc = 0;
        for (let i = 0; i < stages.length; i++) {
            const stagePx = stages[i].scrollLength;
            if (scrollY <= acc + stagePx) {
                const t = (scrollY - acc) / stagePx;
                return { stageIndex: i, progress: Math.min(Math.max(t, 0), 1) };
            }
            acc += stagePx;
        }
        return { stageIndex: stages.length - 1, progress: 1 };
    };

    const { stageIndex, progress } = getStageProgress();
    const currentStage = stages[stageIndex];

    /** Compute interpolated + noise position */
    const getShapePosition = (s: ShapeWithStates) => {
        if (s.id === "Dot" && stageIndex >= 2) {
            // Smooth follow logic
            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
            const t = 0.15; // smoothing factor

            smoothedPos.current.x = lerp(smoothedPos.current.x, mousePos.current.x - 1, t);
            smoothedPos.current.y = lerp(smoothedPos.current.y, mousePos.current.y - 20, t);

            // Add subtle wobble
            const scale = 0.8;
            const noiseX = noise2D(timeRef.current, s.id.length) * scale;
            const noiseY = noise2D(timeRef.current, s.id.charCodeAt(0)) * scale;

            return { ...s.states[0], x: smoothedPos.current.x + noiseX, y: smoothedPos.current.y + noiseY, w: s.w, h: s.h };
        }

        const start = s.states[currentStage.startStateIndex];
        const end = s.states[currentStage.endStateIndex];
        const base = interpolate(start, end, progress);

        // Noise offsets
        const scale = 0;
        const tNoise = timeRef.current;
        const noiseX = noise2D(tNoise, s.id.length) * scale;
        const noiseY = noise2D(tNoise, s.id.charCodeAt(0)) * scale;

        return {
            ...base,
            x: (base.x ?? 0) + noiseX,
            y: (base.y ?? 0) + noiseY,
        };
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {shapes.map((s, i) => {
                const { x, y, w, h, text } = getShapePosition(s);
                const verticalIds = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
                const isVertical = verticalIds.includes(s.id);
                return (
                    <div
                        key={s.id}
                        style={{
                            position: 'absolute',
                            left: `${x}vw`,
                            top: `${y}px`,
                            width: `${w}vw`,
                            height: `${h}px`,
                            background: s.id === "Dot" ? '#000' : s.states[currentStage.startStateIndex].__random ? '#dfdfdfff' : '#000',
                            cursor: 'grab',
                            transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined,
                            display: "flex",
                            alignItems: isVertical ? "auto" : "center",
                            justifyContent: isVertical ? "auto" : "center",
                            color: isVertical ? "#d93838ff" : "#fff",
                            fontSize: isVertical ? "64px" : "18px",   // 👈 size logic
                            fontFamily: "sans-serif",
                            whiteSpace: "nowrap",
                            zIndex: s.id === "Dot" ? 200 : s.states[currentStage.startStateIndex].__random ? 'auto' : 100,
                        }}
                    >
                        {text ?? ""}
                    </div>
                );
            })}
        </div>
    );
};

export default Hero;
