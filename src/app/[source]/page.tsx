"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { trackingSources } from "@/config/trackingSources";

export default function SourceRedirect() {
    const router = useRouter();
    const params = useParams();
    const source = params.source as string;

    useEffect(() => {
        const trackingName = trackingSources[source];

        if (trackingName) {
            // Valid tracking source - track and redirect
            window.umami?.track("source", { from: trackingName });
            router.replace("/");
        } else {
            // Unknown route - redirect to 404
            router.replace("/not-found");
        }
    }, [source, router]);

    return null;
}
