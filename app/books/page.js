"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftLine, RiExternalLinkLine } from "react-icons/ri";
import gsap from "gsap";

// ─── DATA ────────────────────────────────────────────────────────────────────

const books = [
  {
    id: "b-1",
    title: "The Sense of Beauty",
    author: "George Santayana",
    cover: "/books/santayana.jpg",
    note: "Written in 1896, this is still the cleanest attempt to answer why anything feels beautiful at all. Santayana argues beauty is pleasure objectified — we project it outward and forget it came from within. A book that changes how you look at everything.",
    url: "https://www.amazon.in/dp/0486202380",
  },
  {
    id: "b-2",
    title: "Ways of Seeing",
    author: "John Berger",
    cover: "/books/berger.jpg",
    note: "Seven essays, four of them wordless. Berger teaches you to distrust your first reading of any image — painting, advertisement, photograph. Once you see what he sees, you cannot unsee it.",
    url: "https://www.amazon.in/dp/014013515X",
  },
  {
    id: "b-3",
    title: "The Poetics of Space",
    author: "Gaston Bachelard",
    cover: "/books/bachelard.jpg",
    note: "A phenomenology of inhabited space — the attic, the cellar, the nest, the corner. Bachelard argues that our first experiences of shelter shape how we imagine the world. Quietly one of the most beautiful books ever written.",
    url: null, // no link — just omit or set null
  },
  {
    id: "b-4",
    title: "Wabi-Sabi for Artists, Designers, Poets & Philosophers",
    author: "Leonard Koren",
    cover: "/books/koren.jpg",
    note: "Thin, but one of those books where every sentence earns its place. Koren excavates the Japanese aesthetic of impermanence and imperfection — not as nostalgia, but as a complete worldview about what things are for.",
    url: "https://www.amazon.in/dp/0981484603",
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function BookCard({ title, author, cover, note, url }) {
  const inner = (
    <div className={`flex flex-col sm:flex-row gap-5 bg-white  rounded-xl p-5 transition-colors ${url ? "border-zinc-200 hover:border-zinc-400 group cursor-pointer" : "border-zinc-200"}`}>
      {/* Cover */}
      <div className="flex-shrink-0 w-full sm:w-24">
        <div className="relative w-full sm:w-24 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-100">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 justify-center flex-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base tracking-tight text-black leading-snug">{title}</h2>
            {url && (
              <RiExternalLinkLine className="flex-shrink-0 mt-0.5 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
            )}
          </div>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{author}</p>
        </div>
        {note && <p className="text-sm leading-6 text-zinc-500">{note}</p>}
      </div>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="gs-fade block">
        {inner}
      </a>
    );
  }

  return <div className="gs-fade">{inner}</div>;
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
      <Link href="/" className="flex items-center gap-1 hover:text-zinc-700 transition-colors">
        <RiArrowLeftLine />
        Home
      </Link>
      <span>/</span>
      <span className="text-zinc-600">Books</span>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Books() {
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current.querySelectorAll(".gs-fade");
    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }
    );
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center relative z-10 pb-24">
      <main ref={containerRef} className="flex flex-1 w-full max-w-2xl flex-col gap-10 py-24 pb-0 px-3 md:px-8">

        <Image alt="WRIKSH" src="/logo-black.svg" width={100} height={20} priority className="gs-fade" />

        <div className="gs-fade"><Breadcrumb /></div>

        <div className="gs-fade flex flex-col gap-4">
          <h1 className="text-3xl tracking-tight text-black">Books</h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600">
            Books that changed how I see. Not recommendations — more like evidence.
          </p>
        </div>

        <div className="gs-fade h-px w-12 bg-zinc-300" />

        <div className="flex flex-col gap-5">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

      </main>
    </div>
  );
}