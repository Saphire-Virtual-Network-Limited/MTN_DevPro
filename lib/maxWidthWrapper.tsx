"use client";

import { ReactNode } from "react";
import { cn } from "./utils";
import { Image, HeroUIProvider } from "@heroui/react";
import Link from "next/link";

export function MaxWidthWrapper({ className, children }: { className?: string; children: ReactNode }) {
	return (
		<main className={cn("", className)}>
			<HeroUIProvider>
				<div className="flex lg:flex-row flex-col h-full lg:h-screen overflow-hidden bg-white">

					{/* company logo on mobile */}
					<div className="flex lg:hidden items-center justify-center">
						<Link href="/">
							<Image
								src="/sapphire-credit.png"
								alt="Sapphire Logo"
								className="w-36 h-36 object-contain"
								width={144}
								height={144}
							//priority
							/>
						</Link>
					</div>

					<div className="hidden lg:flex w-1/2 flex-col relative">
						<div className="flex-1 flex items-center justify-center max-w-[585px]">
							<Image
								src="/fold-7.png"
								alt="men-in-suit"
								className="w-full h-auto object-contain rounded-none"
							/>
						</div>


					</div>

					{/* Right Side text */}
					<div className="w-full lg:w-1/2 flex bg-white px-4 lg:px-0">
						{children}
					</div>
				</div>
			</HeroUIProvider>
		</main>
	);
}
