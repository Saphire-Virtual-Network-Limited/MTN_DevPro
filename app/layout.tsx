import type { Metadata, Viewport } from "next";
import { MaxWidthWrapper, cn, ThemeProvider } from "@/lib";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Header } from "@/components/reusables";
import DynamicSeo from "@/lib/dynamicSeo";



const appColor = "#0F52BA";

export const viewport: Viewport = {
	themeColor: appColor,
	width: "device-width",
	initialScale: 1,
	userScalable: true,
};

export const metadata: Metadata = DynamicSeo(0);


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<body className={cn("m-auto min-h-screen bg-background bg-center bg-no-repeat scroll-smooth antialiased")}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange>
					<NextTopLoader
						color="#000000"
						showSpinner={false}
						easing="ease"
					/>
					<Header />
					<MaxWidthWrapper>{children}</MaxWidthWrapper>

					<Toaster
						position="top-right"
						expand={false}
					/>
					<GoogleAnalytics gaId="" />
					<GoogleTagManager gtmId="" />
				</ThemeProvider>
			</body>
		</html>
	);
}
