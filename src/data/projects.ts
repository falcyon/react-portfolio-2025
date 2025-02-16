export interface Project {
  name: string;
  slug: string;
  thumbnail: string;
  year: number;
  tags: string[];
  width: "s" | "q" | "t" | "h" | "1" | "f";
  position?: 1 | 2 | 3 | 4 | 5 | 6;
  description: string;
}

export const projectsArray: Project[] = [
  {
    name: "Constructor",
    slug: "constructor",
    thumbnail: "/media/thumbnails/constructor.mp4",
    year: 2025,
    tags: ["Motion Accumulator", "Design", "Installation"],
    width: "h",
    position: 2,
    description: "A piece created by designing a motion accumulator."
  },
  {
    name: "...And Words Will Echo in My Soul",
    slug: "andWordsWillEchoInMySoul",
    thumbnail: "/media/thumbnails/insecurityMirror.mp4",
    year: 2024,
    tags: ["Performance", "Installation", "Conversation"],
    width: "h",
    position: 2,
    description: "A performance installation converting conversations into pieces of thread."
  },
  {
    name: "Palimpsest",
    slug: "palimpsest",
    thumbnail: "/media/thumbnails/palimpsest2.mp4",
    year: 2023,
    tags: ["Performance", "Installation"],
    width: "f",
    description: "A performance installation converting conversations into pieces of thread."
  },
  {
    name: "Notes to Self",
    slug: "notesToSelf",
    thumbnail: "/media/thumbnails/notes.mp4",
    year: 2021,
    tags: ["Interactive", "Installation"],
    width: "h",
    position: 1,
    description: "An interactive installation where users engage in a conversation with their digital self."
  },
  {
    name: "Stained Mask",
    slug: "stainedMask",
    thumbnail: "/media/thumbnails/StainedMask.mp4",
    year: 2021,
    tags: ["Interactive", "Installation", "Social Commentary"],
    width: "h",
    position: 3,
    description: "An interactive installation critiquing the Church's opinion on masks during Covid."
  },
  {
    name: "AI Discovers Fire",
    slug: "aiDiscoversFire",
    thumbnail: "/media/thumbnails/fire-gif.mp4",
    year: 2021,
    tags: ["AI", "Media Art", "DCGAN"],
    width: "1",
    position: 2,
    description: "Media Art created using DCGAN trained on images of fire."
  },
  {
    name: "Human Condition",
    slug: "humanCondition",
    thumbnail: "/media/thumbnails/portraiture.mp4",
    year: 2021,
    tags: ["Performance", "Interpretation", "Human Condition"],
    width: "h",
    position: 1,
    description: "An interpretive performance exploring the human condition."
  },
  {
    name: "Read my Lips",
    slug: "readMyLips",
    thumbnail: "/media/thumbnails/ReadMyLips2.mp4",
    year: 2021,
    tags: ["Interactive", "Emotion", "AI"],
    width: "h",
    position: 3,
    description: "An interactive installation isolating viewers' lips and predicting their emotions."
  },
  {
    name: "Petmania",
    slug: "petmania",
    thumbnail: "/media/thumbnails/petmania.mp4",
    year: 2022,
    tags: ["App Design", "Product Design"],
    width: "t",
    position: 2,
    description: "Product Design for an app for dogs to find companions."
  },
  {
    name: "Conversation Sculpture",
    slug: "conversationSculpture",
    thumbnail: "/media/thumbnails/pop2.mp4",
    year: 2022,
    tags: ["Sculpture", "Nihilism", "Philosophy"],
    width: "1",
    description: "A sculpture made up of conversations about nihilism."
  },
  {
    name: "unIIcode",
    slug: "uniicode",
    thumbnail: "/media/thumbnails/uniicode_2.mp4",
    year: 2021,
    tags: ["Character Design", "Unicode", "Art"],
    width: "q",
    position: 1,
    description: "Generation of new character sets to fill up spaces in Unicode."
  },
  {
    name: "Organic Metal",
    slug: "organicMetal",
    thumbnail: "media/thumbnails/rings.jpeg",
    year: 2022,
    tags: ["Sculpture", "Design", "Metal"],
    width: "q",
    position: 2,
    description: "Rings made out of metal but in a fluid and organic form."
  },
  {
    name: "Crew App Branding",
    slug: "crew",
    thumbnail: "/media/thumbnails/crew.mp4",
    year: 2023,
    tags: ["Branding", "Design System", "Logo"],
    width: "q",
    position: 3,
    description: "Branding, logo design, and design system for a social media startup."
  },
  {
    name: "Humble Bee",
    slug: "humbleBee",
    thumbnail: "media/thumbnails/humblebee_sq.jpg",
    year: 2017,
    tags: ["MAV", "Military", "Design"],
    width: "q",
    position: 4,
    description: "An MAV for military use."
  },
  {
    name: "Unraveling",
    slug: "unraveling",
    thumbnail: "/media/thumbnails/unraveling.mp4",
    year: 2021,
    tags: ["Digital Art", "Visual Art"],
    width: "t",
    position: 1,
    description: "Digital art visualizing a slow burn breakdown or an 'unraveling' of the self."
  },
  {
    name: "Bit by Bit",
    slug: "bitByBit",
    thumbnail: "/media/thumbnails/bitbybit.mp4",
    year: 2021,
    tags: ["Digital Art", "Time", "Binary"],
    width: "t",
    position: 2,
    description: "Digital art visualizing the passage of time in binary."
  },
  {
    name: "Ephemeral",
    slug: "ephemeral",
    thumbnail: "/media/thumbnails/ephemeral.mp4",
    year: 2021,
    tags: ["Digital Art", "Memory", "Time"],
    width: "t",
    position: 3,
    description: "Digital art referencing the transitory nature of time in our memories."
  },
  {
    name: "Grimmer Tales",
    slug: "grimmerTales",
    thumbnail: "/media/thumbnails/Book.mp4",
    year: 2022,
    tags: ["Illustration", "Fairy Tales", "Absurdist"],
    width: "t",
    position: 2,
    description: "An illustrated absurdist children's fairy tale book."
  },
  {
    name: "Discourse Parkour",
    slug: "discourseParkour",
    thumbnail: "/media/thumbnails/discourse.mp4",
    year: 2021,
    tags: ["Interactive", "Installation"],
    width: "1",
    description: "An interactive installation where players read through a monologue as they play."
  },
  {
    name: "Quantum Touch",
    slug: "quantumTouch",
    thumbnail: "/media/thumbnails/qtouch.mp4",
    year: 2022,
    tags: ["Collaboration", "IBM Quantum", "Interactive"],
    width: "h",
    position: 1,
    description: "A collaboration with IBM Quantum & TouchDesigner to create an interactive installation."
  },
  {
    name: "Quantum Triptych",
    slug: "quantumTriptych",
    thumbnail: "/media/thumbnails/triptych2.mp4",
    year: 2021,
    tags: ["IBM Quantum", "Film", "Art"],
    width: "h",
    position: 2,
    description: "Using IBM's Quantum Composer to act as an editor for a short film."
  }
];
