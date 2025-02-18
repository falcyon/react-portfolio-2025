## Introduction

This is the react project I'm using to create my portfolio website.

Key things to remember 

Built in react using Next.js's App Router framework
- React version 19.0.0
- Next version 15.1.7

All media in /public/media/


## Todos

Learning
- [ ] Figure out what [slug]\page.tsx does in generateStaticParams() -> Could be key to figuring out how to create images for nextjs/image during build time. 
- [ ] Understand generateMetadata function. 

Media optimization
- [ ] Find way to load images after initial page load instead of lazy-loading (how its being loaded currently)
- [ ] Find way to get placeholders for images. 
- [ ] Video component with autoplay that runs on safari 

Create pre-processor
- [ ] Write pre-processor to generate updated singular JSON file ( \data\generated\projectContent.json) from all the project infos present in \src\projects\[slug].json
- [ ] Get nodemon to monitor \src\projects folder for new jsons & updated existing jsons. Preprocess should run everytime an update happens (while on dev build) & before build time (prebuild). 



## How to run this project.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.