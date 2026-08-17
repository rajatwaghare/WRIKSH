"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50">
      <main
        ref={containerRef}
        className="flex flex-col gap-10 w-full max-w-3xl items-center justify-center px-4 md:px-16"
      >
        <Image
          alt="WRIKSH Logo"
          src="/logo.png"
          width={200}
          height={200}
          priority
          className="gs-fade"
        />

        <div className="gs-fade flex flex-col gap-4 text-center items-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-black">
            Something Beautiful is Brewing
          </h1>
          <p className="text-base md:text-lg text-gray-900 max-w-lg">
            Our website is under construction. We're crafting something special for you.
          </p>
          <p className="text-sm md:text-base font-medium text-black tracking-wide">
            Stay Tuned
          </p>
        </div>
      </main>
    </div>
  );
}