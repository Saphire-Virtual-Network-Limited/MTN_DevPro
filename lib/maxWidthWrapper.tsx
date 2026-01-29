"use client";

import { ReactNode } from "react";
import { cn } from "./utils";
import { HeroUIProvider } from "@heroui/react";
import { Sidebar } from "@/components/reusables/customUI/Sidebar";
import Preloader from "@/components/reusables/customUI/Preloader";
import Image from "next/image";

export function MaxWidthWrapper({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<main className={cn("min-h-screen bg-white", className)}>
			<HeroUIProvider>
				<Preloader />

				<div className="flex">
					{/* Fixed Sidebar - Hidden on mobile */}
					<div className="hidden lg:block">
						<Sidebar />
					</div>

					{/* Scrollable Content Area */}
					<div
						className="w-full lg:ml-[40%] lg:w-3/5 min-h-screen overflow-y-scroll"
						style={{
							scrollbarWidth: 'thin',
							scrollbarColor: '#CBD5E0 #F7FAFC'
						}}
					>
						<div
							tabIndex={0}
							className="max-w-md mx-auto py-8 lg:py-12 px-4 focus:outline-none"
						>
							{/* Mobile Logo */}
							<div className="flex lg:hidden items-center justify-center mb-4">
								<div className="w-48 h-16 relative">
									<Image
										src="/mtn-sapphire.png"
										alt="MTN-Sapphire"
										fill
										sizes="192px"
										className="object-contain"
										priority
									/>
								</div>
							</div>

							{children}
						</div>
					</div>
				</div>
			</HeroUIProvider>
		</main>
	);
}