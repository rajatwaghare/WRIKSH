"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiInstagramLine } from "react-icons/ri";
import gsap from "gsap";

export default function Home() {
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
        stagger: 0.12,
      }
    );
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full bg-zinc-50">
      <main
        ref={containerRef}
        className="flex flex-1 gap-24 w-full max-w-3xl flex-col justify-between py-32 px-16 sm:items-start"
      >
        <Image
          alt="WRIKSH Font"
          src="/logo-black.svg"
          width={100}
          height={20}
          priority
          className="gs-fade"
        />

        <div className="gs-fade flex flex-col items-center gap-6 sm:items-start sm:text-left">
          <h1 className="text-3xl leading-10 tracking-tight text-black">
            Beauty awaknes the soul to act.
          </h1>
          <p className="max-w-md text-lg leading-8">
            Search for what is good and strong and beautiful in your society and
            elaborate from there. Push outward. Always create from what you
            already have. Then you will know what to do.
          </p>
        </div>

        <div className="gs-fade flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link href="/aranya" className="flex relative text-sm font-mono items-center justify-center rounded-full transition-colors">
            Explore Aranya
            <span className="h-[1] bg-gray-700 w-full absolute bottom-[-2px]"></span>
          </Link>
          <Link href="/grain" className="flex relative text-sm font-mono items-center justify-center rounded-full transition-colors">
            Grain
            <span className="h-[1] bg-gray-700 w-full absolute bottom-[-2px]"></span>
          </Link>
        </div>

        <div className="gs-fade flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-200 px-5 transition-colors md:w-[158px]"
            href="https://www.instagram.com/wriksh_beauty/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiInstagramLine />
            Instagram
          </a>
        </div>
      </main>
    </div>
  );
}