export interface Project {
  name: string;
  slug: string;
  thumbnail: string;
  height: number;
  width: number;
  year: number;
  tags: string[];
  size: "s" | "q" | "t" | "h" | "1" | "f";
  position?: 1 | 2 | 3 | 4 | 5 | 6;
  description: string;
}

export const projectsArray: Project[] = [
  {
    name: "Constructor",
    slug: "constructor",
    thumbnail: "/media/thumbnails/constructor.mp4",
    height:4320,
    width:4320,
    year: 2025,
    tags: ["Motion Accumulator", "Design", "Installation"],
    size: "h",
    position: 2,
    description: "A piece created by designing a motion accumulator."
  },
  {
    name: "...And Words Will Echo in My Soul",
    slug: "andWordsWillEchoInMySoul",
    thumbnail: "/media/thumbnails/insecurityMirror.mp4",
    height: 1080,
    width: 1080,
    year: 2024,
    tags: ["Performance", "Installation", "Conversation"],
    size: "h",
    position: 2,
    description: "A performance installation converting conversations into pieces of thread."
  },
  {
    name: "Palimpsest",
    slug: "palimpsest",
    thumbnail: "/media/thumbnails/palimpsest2.mp4",
    width:1920,
    height:1080,
    year: 2023,
    tags: ["Performance", "Installation"],
    size: "f",
    description: "A performance installation converting conversations into pieces of thread."
  },
  {
    name: "Notes to Self",
    slug: "notesToSelf",
    thumbnail: "/media/thumbnails/notes.mp4",
    height: 1080,
    width: 1080,
    year: 2021,
    tags: ["Interactive", "Installation"],
    size: "h",
    position: 1,
    description: "An interactive installation where users engage in a conversation with their digital self."
  },
  {
    name: "Stained Mask",
    slug: "stainedMask",
    thumbnail: "/media/thumbnails/StainedMask.mp4",
    width: 540,
    height: 540,
    year: 2021,
    tags: ["Interactive", "Installation", "Social Commentary"],
    size: "h",
    position: 3,
    description: "An interactive installation critiquing the Church's opinion on masks during Covid."
  },
  {
    name: "AI Discovers Fire",
    slug: "aiDiscoversFire",
    thumbnail: "/media/thumbnails/fire-gif.mp4",
    width: 800,
    height: 464,
    year: 2021,
    tags: ["AI", "Media Art", "DCGAN"],
    size: "1",
    position: 2,
    description: "Media Art created using DCGAN trained on images of fire."
  },
  {
    name: "Human Condition",
    slug: "humanCondition",
    thumbnail: "/media/thumbnails/portraiture.mp4",
    width:500,
    height: 590,
    year: 2021,
    tags: ["Performance", "Interpretation", "Human Condition"],
    size: "h",
    position: 1,
    description: "An interpretive performance exploring the human condition."
  },
  {
    name: "Read my Lips",
    slug: "readMyLips",
    thumbnail: "/media/thumbnails/ReadMyLips2.mp4",
    width: 720,
    height:850,
    year: 2021,
    tags: ["Interactive", "Emotion", "AI"],
    size: "h",
    position: 3,
    description: "An interactive installation isolating viewers' lips and predicting their emotions."
  },
  {
    name: "Petmania",
    slug: "petmania",
    thumbnail: "/media/thumbnails/petmania.mp4",
    width:720,
    height:1158,
    year: 2022,
    tags: ["App Design", "Product Design"],
    size: "t",
    position: 2,
    description: "Product Design for an app for dogs to find companions."
  },
  {
    name: "Conversation Sculpture",
    slug: "conversationSculpture",
    thumbnail: "/media/thumbnails/pop2.mp4",
    width: 1080,
    height: 1080,
    year: 2022,
    tags: ["Sculpture", "Nihilism", "Philosophy"],
    size: "1",
    description: "A sculpture made up of conversations about nihilism."
  },
  {
    name: "unIIcode",
    slug: "uniicode",
    thumbnail: "/media/thumbnails/uniicode_2.mp4",
    width: 1440,
    height: 1080,
    year: 2021,
    tags: ["Character Design", "Unicode", "Art"],
    size: "q",
    position: 1,
    description: "Generation of new character sets to fill up spaces in Unicode."
  },
  {
    name: "Organic Metal",
    slug: "organicMetal",
    thumbnail: "/media/thumbnails/rings.jpeg",
    width: 3072,
    height: 2807,
    year: 2022,
    tags: ["Sculpture", "Design", "Metal"],
    size: "q",
    position: 2,
    description: "Rings made out of metal but in a fluid and organic form."
  },
  {
    name: "Crew App Branding",
    slug: "crew",
    thumbnail: "/media/thumbnails/crew.mp4",
    width: 1080,
    height: 1080,
    year: 2023,
    tags: ["Branding", "Design System", "Logo"],
    size: "q",
    position: 3,
    description: "Branding, logo design, and design system for a social media startup."
  },
  {
    name: "Humble Bee",
    slug: "humbleBee",
    thumbnail: "/media/thumbnails/humblebee_sq.jpg",
    width: 1500,
    height: 1500,
    year: 2017,
    tags: ["MAV", "Military", "Design"],
    size: "q",
    position: 4,
    description: "An MAV for military use."
  },
  {
    name: "Unraveling",
    slug: "unraveling",
    thumbnail: "/media/thumbnails/unraveling.mp4",
    width: 700,
    height: 700,
    year: 2021,
    tags: ["Digital Art", "Visual Art"],
    size: "t",
    position: 1,
    description: "Digital art visualizing a slow burn breakdown or an 'unraveling' of the self."
  },
  {
    name: "Bit by Bit",
    slug: "bitByBit",
    thumbnail: "/media/thumbnails/bitbybit.mp4",
    width: 720,
    height: 720,
    year: 2021,
    tags: ["Digital Art", "Time", "Binary"],
    size: "t",
    position: 2,
    description: "Digital art visualizing the passage of time in binary."
  },
  {
    name: "Ephemeral",
    slug: "ephemeral",
    thumbnail: "/media/thumbnails/ephemeral.mp4",
    width: 720,
    height: 720,
    year: 2021,
    tags: ["Digital Art", "Memory", "Time"],
    size: "t",
    position: 3,
    description: "Digital art referencing the transitory nature of time in our memories."
  },
  {
    name: "Grimmer Tales",
    slug: "grimmerTales",
    thumbnail: "/media/thumbnails/Book.mp4",
    width: 720,
    height: 1080,
    year: 2022,
    tags: ["Illustration", "Fairy Tales", "Absurdist"],
    size: "t",
    position: 2,
    description: "An illustrated absurdist children's fairy tale book."
  },
  {
    name: "Discourse Parkour",
    slug: "discourseParkour",
    thumbnail: "/media/thumbnails/discourse.mp4",
    width: 1098,
    height: 700,
    year: 2021,
    tags: ["Interactive", "Installation"],
    size: "1",
    description: "An interactive installation where players read through a monologue as they play."
  },
  {
    name: "Quantum Touch",
    slug: "quantumTouch",
    thumbnail: "/media/thumbnails/qtouch.mp4",
    width: 720,
    height: 420,
    year: 2022,
    tags: ["Collaboration", "IBM Quantum", "Interactive"],
    size: "h",
    position: 1,
    description: "A collaboration with IBM Quantum & TouchDesigner to create an interactive installation."
  },
  {
    name: "Quantum Triptych",
    slug: "quantumTriptych",
    thumbnail: "/media/thumbnails/triptych2.mp4",
    year: 2021,
    width: 720,
    height: 420,
    tags: ["IBM Quantum", "Film", "Art"],
    size: "h",
    position: 2,
    description: "Using IBM's Quantum Composer to act as an editor for a short film."
  }
];
