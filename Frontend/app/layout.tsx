import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins"
});

export const metadata: Metadata = {
    title: "Roadचल - Last Mile Connectivity",
    description: "Effortless rides from your doorstep to nearest Pune Metro station",
    icons: {
        icon: "/icon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.variable} font-sans antialiased`}>
                <Providers>
                    <Navbar />
                    <PageTransition>{children}</PageTransition>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
