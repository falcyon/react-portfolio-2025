import AboutMe from './AboutMe';
import Gallery from './Gallery';
import Hero from './HeroDivTry';
import { projectsArray } from "../data/projects";

export default function Landing() {
  const gridLines = [];
  const galleryHeight = 3000 + projectsArray.length * 1000;
  for (let i = 0; i <= galleryHeight; i += 200) {
    const pxMark = i;
    gridLines.push(
      <div
        key={pxMark}
        style={{
          position: "absolute",
          top: `${i}px`,
          width: "100%",
          borderTop: "1px dashed #777",
          fontSize: "12px",
          color: "#2e3359",
        }}
      >
        <span style={{ position: "absolute", left: "5px", top: "-10px" }}>
          {pxMark}px
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {gridLines}
      <Hero />
      <AboutMe />
      <Gallery />
    </div>
  );
}
