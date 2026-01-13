"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";
import { loadedMedia } from "./mediaLoadStore";
import { useVideoVisibility } from "./hooks";

interface ProjectCardProps {
    name: string;
    slug: string;
    thumbnail: string;
    year: string;
    tags: string[];
    width: number;
    height: number;
}


export default function ProjectCard({
    name,
    slug,
    thumbnail,
    year,
    tags,
    width,
    height,
}: ProjectCardProps) {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(thumbnail);
    const tagString = tags.join(", ");
    const aspectRatio = `${width} / ${height}`;

    const alreadyLoaded = loadedMedia.has(thumbnail);
    const [canLoadMedia, setCanLoadMedia] = useState(alreadyLoaded);

    const videoRef = useRef<HTMLVideoElement>(null);
    useVideoVisibility(videoRef, isVideo && canLoadMedia);

    useEffect(() => {
        if (!alreadyLoaded) {
            setCanLoadMedia(true);
        }
    }, [alreadyLoaded]);

    const handleMediaLoaded = () => {
        loadedMedia.add(thumbnail);
    };

    return (
        <article className={styles.projectCardWrapper}>
            <Link
                href={`/projects/${slug}`}
                aria-label={`View project ${name} from ${year}. Tags: ${tagString}`}
            >
                {!canLoadMedia && (
                    <div
                        className={styles.mediaPlaceholder}
                        style={{ "--aspect-ratio": aspectRatio } as React.CSSProperties}
                    />
                )}

                {canLoadMedia && isVideo && (
                    <video
                        ref={videoRef}
                        src={thumbnail}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className={styles.projectVideo}
                        onLoadedData={handleMediaLoaded}
                        aria-label={`${name} project preview video (${year})`}
                    />
                )}

                {canLoadMedia && !isVideo && (
                    <Image
                        src={thumbnail}
                        alt={`${name} project thumbnail (${year})`}
                        width={width}
                        height={height}
                        className={styles.projectImage}
                        onLoad={handleMediaLoaded}
                    />
                )}

                <h3 className="sr-only">{`${name} (${year})`}</h3>
                <p className="sr-only">{`Tags: ${tagString}`}</p>
            </Link>
        </article>
    );
}
