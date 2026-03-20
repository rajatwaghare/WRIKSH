import Image from "next/image";
import { RiInstagramLine } from "react-icons/ri";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50">
      <main className="flex flex-1 w-full max-w-3xl flex-col justify-between py-32 px-16 sm:items-start">
        <Image alt="WRIKSH Font" src="/logo-black.svg" width={100} height={20} priority />
        <div className="flex flex-col items-center gap-6 sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 tracking-tight text-black">Beauty Awaknes The Soul To Act.</h1>
          <p className="max-w-md text-lg leading-8">Search for what is good and strong and beautiful in your society and elaborate from there. Push outward. Always create from what you already have. Then you will know what to do.</p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-200 px-5 transition-colors md:w-[158px]" href="https://www.instagram.com/wriksh.beauty/" target="_blank" rel="noopener noreferrer">
            <RiInstagramLine />
            Instagram
          </a>
        </div>
      </main>
    </div>
  );
}
