"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiExternalLinkLine, RiArrowLeftLine } from "react-icons/ri";
import gsap from "gsap";

// ─── DATA ────────────────────────────────────────────────────────────────────

const findings = [
  {
    type: "youtube",
    id: "yt-1",
    title: "Pu La Deshpande speech reminiscing about Bal Gandharva",
    description: "Pu La Deshpande — Maharashtra's most beloved writer — speaks about Bal Gandharva not as a music critic, but as someone who was simply struck by beauty and never recovered. In this rare recording, PuLa recalls what it felt like to witness Bal Gandharva perform — how a man dressed as a woman could silence an entire generation, not through technique alone, but through something truer and harder to name. A reminder that beauty doesn't explain itself. It just arrives, and changes you.",
    videoId: "vLX28CWbIsQ",
  },
  {
    type: "article",
    id: "art-1",
    title: "The Shape of Wonder — N.J. Berrill on the Deepest Meaning of Beauty",
    description: "A 1955 marine biologist writes that beauty is not something the universe contains — it is something the universe does. As our minds grew complex enough to perceive it, beauty emerged both as sensation and as creation. We know it when we meet it. And we make it when we can.",
    url: "https://www.themarginalian.org/2024/09/09/berrill-emerging-mind/",
    source: "The Marginalian",
  },
  {
    type: "image",
    id: "img-1",
    title: "Flamingo — An Almanac of Birds",
    description: "Under the surface of the present exists a sea of possibility. To reach it, a person must wade in the muddy rivers of change and traverse the uncertain without sinking. A botanical illustration turned into a quiet instruction for how to live.",
    src: "/Flamingo.jpg",
    alt: "Flamingo illustration with found poetry — Almanac of Birds",
  },
];

// ─── BLOCK COMPONENTS ────────────────────────────────────────────────────────

function YoutubeBlock({ title, description, videoId }) {
  return (
    <div className="gs-fade flex flex-col gap-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <BlockMeta title={title} description={description} />
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function ArticleBlock({ title, description, url, source }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="gs-fade group flex flex-col gap-3 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-400 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">{source}</span>
        <RiExternalLinkLine className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
      </div>
      <BlockMeta title={title} description={description} />
    </a>
  );
}

function ImageBlock({ title, description, src, alt }) {
  return (
    <div className="gs-fade flex flex-col gap-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto rounded-lg"
      />
      <BlockMeta title={title} description={description} />
    </div>
  );
}

function BlockMeta({ title, description }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-base tracking-tight text-black">{title}</h2>
      {description && (
        <p className="text-sm leading-6 text-zinc-500">{description}</p>
      )}
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
      <Link href="/" className="flex items-center gap-1 hover:text-zinc-700 transition-colors">
        <RiArrowLeftLine />
        Home
      </Link>
      <span>/</span>
      <span className="text-zinc-600">Aranya</span>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Aranya() {
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current.querySelectorAll(".gs-fade");

    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      }
    );
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center relative z-10 pb-24">
      <main ref={containerRef} className="flex flex-1 w-full max-w-2xl flex-col gap-10 py-24 pb-0 px-3 md:px-8">

        <Image alt="WRIKSH Font" src="/logo-black.svg" width={100} height={20} priority className="gs-fade" />

        <Breadcrumb />

        {/* Header */}
        <div className="gs-fade flex flex-col gap-4">
          <h1 className="text-3xl tracking-tight text-black">
            Aranya{" "}
            <span className="text-xl" style={{ fontFamily: "var(--font-sahitya)" }}>
              (अरण्य)
            </span>
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            In every forest, a wanderer finds what they were always looking for.
            These are the ones where beauty first awakened.
          </p>
        </div>

        {/* Divider */}
        <div className="gs-fade h-px w-12 bg-zinc-300" />

        {/* Findings — each card animates individually */}
        <div className="flex flex-col gap-5">
          {findings.map((item) => {
            if (item.type === "youtube") return <YoutubeBlock key={item.id} {...item} />;
            if (item.type === "article") return <ArticleBlock key={item.id} {...item} />;
            if (item.type === "image") return <ImageBlock key={item.id} {...item} />;
            return null;
          })}
        </div>

      </main>
    </div>
  );
}