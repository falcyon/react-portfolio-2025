'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import { projectsArray, Project } from "../data/projects";

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
    text?: string;
    textRotation?: number;
    __random?: boolean;
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

    projects.forEach(() => {
        stages.push({
            startStateIndex: index,
            endStateIndex: index + 1,
            scrollLength: 200,
        });
        stages.push({
            startStateIndex: index + 1,
            endStateIndex: index + 2,
            scrollLength: 800,
        });
        index += 2;
    });

    return stages;
}

const stages: Stage[] = [
    { startStateIndex: 0, endStateIndex: 1, scrollLength: 300 },
    { startStateIndex: 1, endStateIndex: 1, scrollLength: 600 },
    { startStateIndex: 1, endStateIndex: 2, scrollLength: 600 },
    { startStateIndex: 2, endStateIndex: 2, scrollLength: 800 },
    ...generateStages(projectsArray),
];

const useVhVwRatio = () => {
    const [ratio, setRatio] = useState(0);

    useEffect(() => {
        const updateRatio = () => setRatio(window.innerWidth / 100);
        updateRatio();
        window.addEventListener("resize", updateRatio);
        return () => window.removeEventListener("resize", updateRatio);
    }, []);

    return ratio;
};

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
    const verticalList = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
    const horizontalList = ["Lh", "Et", "Em", "Eb", "F1t", "F1m", "F2t", "F2m"];

    projects.forEach((project, i) => {
        const vId = verticalList[i % verticalList.length];
        const hId1 = horizontalList[(2 * i) % horizontalList.length];
        const hId2 = horizontalList[(2 * i + 1) % horizontalList.length];

        const chosen = [vId, hId1, hId2]
            .map((id) => shapeDefs.find((s) => s.id === id))
            .filter((s): s is ShapeDef => !!s);

        const yFirst = [700, 200, 600];
        const xFirst = [20, 30, 70];

        const stateA: Record<string, ShapeState> = {};
        const stateB: Record<string, ShapeState> = {};

        chosen.forEach((shape, idx) => {
            const text =
                idx === 0
                    ? project.name
                    : idx === 1
                        ? String(project.year)
                        : project.tags?.[0] ?? "";

            stateA[shape.id] = { x: xFirst[idx], y: yFirst[idx], text };
            stateB[shape.id] = { x: xFirst[idx], y: yFirst[idx] - 200, text };
        });

        states.push(stateA);
        states.push(stateB);
    });
    return states;
}

const interpolate = (start: ShapeState, end: ShapeState, t: number): ShapeState => ({
    x: (start.x ?? 0) + ((end.x ?? 0) - (start.x ?? 0)) * t,
    y: (start.y ?? 0) + ((end.y ?? 0) - (start.y ?? 0)) * t,
    w: (start.w ?? 0) + ((end.w ?? start.w ?? 0) - (start.w ?? 0)) * t,
    h: (start.h ?? 0) + ((end.h ?? start.h ?? 0) - (start.h ?? 0)) * t,
    text: start.text === end.text ? start.text : "",
});

const useScrollY = () => {
    const [scrollY, setScrollY] = useState(window.scrollY || 0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return scrollY;
};


const makeShape = (def: ShapeDef, stateArr: ShapeState[]): ShapeWithStates => {
    const fallbackX = Math.random() * 90;
    const fallbackY = 50 + Math.random() * 800;
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
        };
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
        {},
        scaleY(HeroState[s.id]) ?? {},
        scaleY(NameState[s.id]) ?? {},
        ...projectStateMaps.map((m) => m[s.id] ?? {}),
    ]);

    const [shapes, setShapes] = useState<ShapeWithStates[]>(shapesDefs.map((def, i) => makeShape(def, states[i])));
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
                        h: def.h,
                        text: st.text,
                    };
                });
                return { ...s, states: newStates };
            })
        );
    }, [ratio]);

    const scrollY = useScrollY();
    const timeRef = useRef(0);

    // NEW: refs to hold div elements for direct DOM updates
    const shapesRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    const getShapePosition = (s: ShapeWithStates) => {
        const start = s.states[currentStage.startStateIndex];
        const end = s.states[currentStage.endStateIndex];
        const base = interpolate(start, end, progress);

        const scale = 0; // tweak noise scale if needed
        const tNoise = timeRef.current;
        const noiseX = noise2D(tNoise, s.id.length) * scale;
        const noiseY = noise2D(tNoise, s.id.charCodeAt(0)) * scale;

        return {
            ...base,
            x: (base.x ?? 0) + noiseX,
            y: (base.y ?? 0) + noiseY,
        };
    };

    // Animation loop updates DOM styles directly
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            timeRef.current += 0.01;

            shapes.forEach((s, i) => {
                const el = shapesRefs.current[i];
                if (!el) return;

                const { x, y, w, h, text } = getShapePosition(s);
                const verticalIds = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
                const isVertical = verticalIds.includes(s.id);

                // Update DOM node styles directly
                el.style.left = `${x}vw`;
                el.style.top = `${y}px`;
                el.style.width = `${w}vw`;
                el.style.height = `${h}px`;
                el.style.background = s.states[currentStage.startStateIndex].__random ? '#dfdfdfff' : '#000';
                el.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";
                el.style.color = isVertical ? "#d93838ff" : "#fff";
                el.style.fontSize = isVertical ? "64px" : "18px";
                el.textContent = text ?? "";
            });

            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [shapes, currentStage, progress]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {shapes.map((s, i) => {
                const verticalIds = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
                const isVertical = verticalIds.includes(s.id);

                return (
                    <div
                        key={s.id}
                        ref={(el) => (shapesRefs.current[i] = el)} // attach ref
                        style={{
                            position: 'absolute',
                            left: "0", // will be overridden by loop
                            top: "0",
                            width: "0",
                            height: "0",
                            cursor: 'grab',
                            display: "flex",
                            alignItems: isVertical ? "auto" : "center",
                            justifyContent: isVertical ? "auto" : "center",
                            fontFamily: "sans-serif",
                            whiteSpace: "nowrap",
                            zIndex: s.states[currentStage.startStateIndex].__random ? 'auto' : "100",
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Hero;
