'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

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

/** Example stages */
const stages: Stage[] = [
    { startStateIndex: 0, endStateIndex: 1, scrollLength: 300 }, //reaches state Leff.in when 30 on top
    { startStateIndex: 1, endStateIndex: 1, scrollLength: 300 }, //stay at state leff.in till when 60 on top
    { startStateIndex: 1, endStateIndex: 2, scrollLength: 200 }, //converts to leffin. when 80 on top
    { startStateIndex: 2, endStateIndex: 2, scrollLength: 400 }, //stay at state leffin. till when 100 on top

    // from 1400 px onwards, the shapes move with the scroll
    { startStateIndex: 2, endStateIndex: 3, scrollLength: 200 }, //convert to state 4 when 160 on top
    { startStateIndex: 3, endStateIndex: 4, scrollLength: 200 }, //convert to chaos when 160 on top
    { startStateIndex: 4, endStateIndex: 5, scrollLength: 100 },
    { startStateIndex: 5, endStateIndex: 6, scrollLength: 500 },
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
    { id: 'Ev', w: 3, h: 15 },
    { id: 'Et', w: 9, h: 3 },
    { id: 'Em', w: 9, h: 3 },
    { id: 'Eb', w: 9, h: 3 },
    { id: 'F1v', w: 3, h: 15 },
    { id: 'F1t', w: 9, h: 3 },
    { id: 'F1m', w: 9, h: 3 },
    { id: 'F2v', w: 3, h: 15 },
    { id: 'F2t', w: 9, h: 3 },
    { id: 'F2m', w: 9, h: 3 },
    { id: 'Dot', w: 3, h: 3 },
    { id: 'Iv', w: 3, h: 15 },
    { id: 'Nl', w: 3, h: 15 },
    { id: 'Nr', w: 3, h: 15 },
    { id: 'Ns', w: 15.84, h: 3, rotation: 57.55 },
];

/** Fixed positions for state 1 */
const HeroState: Record<string, ShapeState> = {
    Lv: { x: 18 - 6, y: 0 + 6 },
    Lh: { x: 18, y: 12 },
    Ev: { x: 29, y: 0 },
    Et: { x: 29, y: 0 },
    Em: { x: 29, y: 6 },
    Eb: { x: 29, y: 12 },
    F1v: { x: 40, y: 0 },
    F1t: { x: 40, y: 0 },
    F1m: { x: 40, y: 6 },
    F2v: { x: 51, y: 0 },
    F2t: { x: 51, y: 0 },
    F2m: { x: 51, y: 6 },
    Dot: { x: 60, y: 12 },
    Iv: { x: 64, y: 0 },
    Nl: { x: 69, y: 0 },
    Nr: { x: 78, y: 0 },
    Ns: { x: 67.1, y: 6 },
};

const NameState: Record<string, ShapeState> = {
    Lv: { x: 18, y: 0 },
    Lh: { x: 18, y: 12 },
    Ev: { x: 29, y: 0 },
    Et: { x: 29, y: 0 },
    Em: { x: 29, y: 6 },
    Eb: { x: 29, y: 12 },
    F1v: { x: 40, y: 0 },
    F1t: { x: 40, y: 0 },
    F1m: { x: 40, y: 6 },
    F2v: { x: 51, y: 0 },
    F2t: { x: 51, y: 0 },
    F2m: { x: 51, y: 6 },
    Iv: { x: 61, y: 0 },
    Nl: { x: 66, y: 0 },
    Nr: { x: 75, y: 0 },
    Ns: { x: 64.1, y: 6 },
    Dot: { x: 79, y: 12 },
};


/** Fixed positions for state 3 */
const state0: Record<string, ShapeState> = {
    Lh: { x: 20, y: 700, text: "2025" },
};

const state200: Record<string, ShapeState> = {
    Lh: { x: 20, y: 500, text: "2025" },
    Lv: { x: 25, y: 700, text: "PAPLIMPSEST" },
};

const state300: Record<string, ShapeState> = {
    Lh: { x: 20, y: 400, text: "2025" },
    Lv: { x: 25, y: 800, text: "PAPLIMPSEST" },
};

const state800: Record<string, ShapeState> = {
    Lh: { x: 20, y: -100 },
    Lv: { x: 25, y: 100 },
};



/** Linear interpolation */
const interpolate = (start: ShapeState, end: ShapeState, t: number): ShapeState => ({
    x: (start.x ?? 0) + ((end.x ?? 0) - (start.x ?? 0)) * t,
    y: (start.y ?? 0) + ((end.y ?? 0) - (start.y ?? 0)) * t,
    w: (start.w ?? 0) + ((end.w ?? start.w ?? 0) - (start.w ?? 0)) * t,
    h: (start.h ?? 0) + ((end.h ?? start.h ?? 0) - (start.h ?? 0)) * t,
    text: end.text ?? start.text,
});

/** Hook to get scrollY */
const useScrollY = () => {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return scrollY;
};

/** Generate shapes with resolved states (random once per shape, reused) */
const makeShape = (def: ShapeDef, stateArr: ShapeState[]): ShapeWithStates => {
    // Generate one fallback random position per shape
    const fallbackX = 5 + Math.random() * 90;
    const fallbackY = Math.random() * 1000;

    const s = stateArr.map((st) => {
        const hasExplicitPos = st?.x !== undefined || st?.y !== undefined;
        return {
            x: st?.x ?? fallbackX,
            y: st?.y ?? fallbackY,
            w: st?.w ?? def.w,
            h: st?.h ?? def.h,
            text: st?.text,           // <- preserve text from the state
            __random: !hasExplicitPos, // mark if this state was unresolved originally
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

    /** All 4 states: 0 & 2 random, 1 = state2, 3 = state4 */
    const states: ShapeState[][] = shapesDefs.map((s) => [
        {},
        scaleY(HeroState[s.id]),   // y scaled
        scaleY(NameState[s.id]),   // y scaled
        state0[s.id],              // unchanged
        state200[s.id],
        state300[s.id],
        state800[s.id],
        {},
    ]);
    const [shapes, setShapes] = useState<ShapeWithStates[]>(shapesDefs.map((def, i) => makeShape(def, states[i])));
    // Recompute shapes whenever ratio changes
    useEffect(() => {
        setShapes((prevShapes) =>
            prevShapes.map((s) => {
                const def = shapesDefs.find((d) => d.id === s.id)!;
                const newStates = s.states.map((st, idx) => {
                    let newY = st.y;
                    if (idx === 1) newY = scaleY(HeroState[s.id])?.y ?? st.y;
                    if (idx === 2) newY = scaleY(NameState[s.id])?.y ?? st.y;

                    return {
                        ...st,
                        y: newY,
                        h: def.h,       // scale height for all states
                        text: st.text,  // <-- make sure text is preserved
                    };
                });
                return { ...s, states: newStates };
            })
        );
    }, [ratio]);

    const scrollY = useScrollY();
    const vh = window.innerHeight;
    const timeRef = useRef(0);
    const [, setFrame] = useState(0); // trigger re-render

    /** Animation loop for noise */
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            timeRef.current += 0.01;
            setFrame((f) => f + 1); // re-render
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    /** Determine stage & progress */
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
    /** Compute interpolated + noise position */
    const getShapePosition = (s: ShapeWithStates) => {
        const start = s.states[currentStage.startStateIndex];
        const end = s.states[currentStage.endStateIndex];
        const base = interpolate(start, end, progress);

        // --- distance-based interpolation ---
        const dx = (end.x ?? 0) - (start.x ?? 0);
        const dy = (end.y ?? 0) - (start.y ?? 0);
        const totalDist = Math.sqrt(dx * dx + dy * dy);

        const curDx = (base.x ?? 0) - (start.x ?? 0);
        const curDy = (base.y ?? 0) - (start.y ?? 0);
        const curDist = Math.sqrt(curDx * curDx + curDy * curDy);

        const distProgress = totalDist > 0 ? curDist / totalDist : 0;

        // --- intensity logic ---
        let intensity: number;
        if (start.__random || end.__random) {
            // if either side is random → wobble continues always
            intensity = Math.sin(distProgress * Math.PI) + 0.2;
            // the +0.2 keeps a baseline wobble at ends
        } else {
            // normal case → peaks at mid, zero at ends
            intensity = Math.sin(distProgress * Math.PI);
        }

        // --- noise offsets ---
        const scale = 0.8;
        const t = timeRef.current;

        const noiseX = noise2D(t, s.id.length) * scale * intensity;
        const noiseY = noise2D(t, s.id.charCodeAt(0)) * scale * intensity;

        return {
            ...base,
            x: (base.x ?? 0) + noiseX,
            y: (base.y ?? 0) + noiseY,
        };
    };


    /** Drag handler */
    const startDrag = useCallback(
        (index: number, e: React.MouseEvent) => {
            e.preventDefault();
            let lastX = e.clientX;
            let lastY = e.clientY;

            const onMove = (ev: MouseEvent) => {
                const deltaX = ((ev.clientX - lastX) / window.innerWidth) * 100;
                const deltaY = ((ev.clientY - lastY) / window.innerWidth) * 100;

                setShapes((prev) =>
                    prev.map((s, i) => {
                        if (i !== index) return s;
                        const editableIndex = currentStage.startStateIndex;
                        const updatedStates = [...s.states];
                        updatedStates[editableIndex] = {
                            ...updatedStates[editableIndex],
                            x: (updatedStates[editableIndex]?.x ?? 0) + deltaX,
                            y: (updatedStates[editableIndex]?.y ?? 0) + deltaY,
                        };
                        return { ...s, states: updatedStates };
                    })
                );

                lastX = ev.clientX;
                lastY = ev.clientY;
            };

            const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        },
        [currentStage.startStateIndex]
    );

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {shapes.map((s, i) => {
                const { x, y, w, h, text } = getShapePosition(s);

                return (
                    <div
                        key={s.id}
                        onMouseDown={(e) => startDrag(i, e)}
                        style={{
                            position: 'absolute',
                            left: `${x}vw`,
                            top: `${y}px`,
                            width: `${w}vw`,
                            height: `${h}px`,
                            background: '#000',
                            cursor: 'grab',
                            transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "16px",
                            fontFamily: "sans-serif",
                            zIndex: s.states[currentStage.startStateIndex].__random ? 'auto' : 100,
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
