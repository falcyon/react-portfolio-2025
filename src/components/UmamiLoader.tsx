"use client";

import { useEffect } from "react";

// Two trackers while the self-hosted Umami (pulse.leff.in) runs alongside Umami Cloud for comparison.
// Custom events (window.umami.track) go to both. Session replay and heatmaps come from the self-hosted one.
const CLOUD_SRC = "/stats/script.js";
const CLOUD_HOST_URL = "/stats";
const CLOUD_WEBSITE_ID = "836b2b5c-a53a-48d3-88d4-06959b33b93d";
const PULSE = "https://pulse.leff.in";
const PULSE_WEBSITE_ID = "894fbec3-0292-4226-9c57-036c3c0124e0";

function addScript(src: string, data: Record<string, string>): Promise<void> {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.defer = true;
        script.src = src;
        Object.assign(script.dataset, data);
        script.onload = () => resolve();
        script.onerror = () => resolve(); // a tracker that fails to load never affects the page
        document.head.appendChild(script);
    });
}

export default function UmamiLoader() {
    useEffect(() => {
        if (localStorage.getItem("umami.disabled") === "true") return;

        let loaded = false;

        async function loadUmami() {
            if (loaded) return;
            loaded = true;
            events.forEach((e) => window.removeEventListener(e, loadUmami));

            // Each tracker only claims window.umami if it is free, and the replay recorder talks to whichever
            // holds it. So: the self-hosted one first, set it aside, let the cloud one load into the free slot,
            // then hand window.umami back to the self-hosted one with track() going to both.
            await addScript(`${PULSE}/p.js`, { websiteId: PULSE_WEBSITE_ID, domains: "leff.in", hostUrl: PULSE });
            const pulse = window.umami;
            window.umami = undefined;
            await addScript(CLOUD_SRC, { websiteId: CLOUD_WEBSITE_ID, domains: "leff.in", hostUrl: CLOUD_HOST_URL });
            const cloud = Reflect.get(window, "umami") as Window["umami"]; // re-read: TS still thinks it is undefined
            window.umami = pulse && cloud
                ? {
                      ...pulse,
                      track: (event: string, data?: Record<string, string | number>) => {
                          cloud.track(event, data);
                          pulse.track(event, data);
                      },
                  }
                : pulse ?? cloud;
            addScript(`${PULSE}/recorder.js`, { websiteId: PULSE_WEBSITE_ID });
        }

        const events: (keyof WindowEventMap)[] = [
            "mousemove",
            "scroll",
            "click",
            "touchstart",
            "keydown",
        ];

        events.forEach((e) =>
            window.addEventListener(e, loadUmami, { once: true, passive: true })
        );

        return () => {
            events.forEach((e) => window.removeEventListener(e, loadUmami));
        };
    }, []);

    return null;
}
