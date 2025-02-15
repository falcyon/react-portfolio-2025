// Type: TypeScript file. 
// TODO: Change this to be more like a JSON file or something better for editing later.


export interface Project {
  name: string;
  slug: string;
  thumbnail: string;
  tags: string[];
  columns?: 1 | 2 | 3 | 4;
  content: string;
}

export const projectsArray: Project[] = [
  {
      name: "AI Discovers Fire",
      slug: "ai-discovers-fire",
      thumbnail: "/media/thumbnails/fire-gif.mp4",
      tags: ["AI", "Anthropology", "Installation"],
      content: "An exploration of AI's role in early human-like discoveries."
  },
  {
      name: "Tetris Scheduling",
      slug: "tetris-scheduling",
      thumbnail: "/videos/tetris-demo.mp4",
      tags: ["Software", "UI/UX", "Scheduling"],
      columns: 3,
      content: "A software tool for efficient manufacturing scheduling."
  },
  {
      name: "Luma Festival Projection",
      slug: "luma-festival-projection",
      thumbnail: "/images/luma-projection.jpg",
      tags: ["Projection", "Festival", "Interactive"],
      columns: 4,
      content: "A software tool for efficient manufacturing scheduling."
  }
];
