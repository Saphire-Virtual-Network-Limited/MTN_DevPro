import { cn, Figtree_Regular, Figtree_SemiBold } from '@/lib';
import Image from 'next/image';

export function Sidebar() {
  return (
    <div className="w-2/5 bg-[#0C49A8] text-white fixed min-h-screen hidden lg:flex flex-col items-center justify-between px-8">
      {/* Header Logos */}
      <div className="w-full lg:flex items-center mx-auto hidden lg:w-72 lg:h-20 relative mt-8">
        <Image
          src="/mtn-sapphire-white.png"
          alt="MTN-Sapphire"
          width={288}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className={cn(`font-normal text-center text-[40px] leading-tight`, Figtree_Regular)}>
          Your Device<br />
          Deserves Better.<br />
          <span className={cn(`font-semibold text-center text-[40px] leading-tight`, Figtree_SemiBold)}>
            We&apos;ve Got It Covered
          </span>
        </h1>
      </div>
      <div className="w-72 h-96 relative mx-auto mt-4">
        <Image
          src="/umbrella.png"
          alt="Phone Protection"
          width={288}
          height={384}
          className="object-contain"
          priority
        />
      </div>


      <div></div>
    </div>
  );
}