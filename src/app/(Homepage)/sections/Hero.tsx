"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Property } from "@/lib/webflow";
import { useRouter } from "next/navigation";
import { CTA_IDS } from "@/lib/cta-ids";
import Marquee from "@/components/ui/image-tiles";
import Image from "next/image";

interface HeroProps {
    properties?: Property[];
}

// Custom easing for a "classy" feel
const CLASSY_EASE: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export const Hero = ({ properties = [] }: HeroProps) => {
    const router = useRouter();

    // Static images from public/banner-images
    const heroImages = React.useMemo(() => {
        return [
            "/banner-images/Banner (3).webp",
            "/banner-images/Banner (5).webp",
            "/banner-images/DSC00070-HDR.webp",
            "/banner-images/DSC03105-HDR.webp",
            "/banner-images/DSC04699-HDR (4).webp",
            "/banner-images/DSC06369-HDR (2).webp"
        ];
    }, []);

    // Transform heroImages for marquee component
    const heroMarqueeItems = React.useMemo(() => {
        return heroImages.map((src, index) => ({
            src,
            alt: `Flent Home ${index + 1}`
        }));
    }, [heroImages]);

    return (
        <div
            className="relative flex flex-col w-full h-screen min-h-[600px] box-border md:pt-[calc(var(--top-banner-height,0px)+6.5rem)] md:justify-center items-center overflow-hidden"
        >
            {/* Background Pattern Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/patterns/pie-factory.svg')`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '60px 60px',
                    opacity: 0.15
                }}
            />
            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 z-[1]"
                style={{
                    background: 'linear-gradient(to top, rgba(252, 251, 247, 1), rgba(252, 251, 247, 0.9), rgba(252, 251, 247, 0.8))'
                }}
            />

            <div
                className="z-40 text-center space-y-6 items-center flex flex-col px-4 max-w-6xl mx-auto mt-24 md:mt-0"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: CLASSY_EASE, delay: 0 }}
                    className="font-medium font-heading text-text-main text-5xl md:text-7xl"
                >
                    Renting that <span className="hidden md:inline">finally </span>respects <br className="hidden md:block" /> <span className="font-zin-italic">your taste and time</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: CLASSY_EASE, delay: 0.5 }}
                    className="text-subtitle max-w-2xl mx-auto font-body font-medium text-lg"
                >
                    Thoughtfully furnished, move-in ready homes that take brokers, repairs, and flatmate stress out of your life
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: CLASSY_EASE, delay: 1.4 }}
                    className="z-50"
                >
                    <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={() => router.push("/homes")}
                        data-cta-id={CTA_IDS.HERO_EXPLORE_HOMES}
                        data-cta-context="hero"
                    >
                        Explore Homes
                    </Button>
                </motion.div>
            </div>

            {/* Desktop: Parallax Images */}
            <div className="hidden md:block absolute inset-0 z-20 pointer-events-none">
                {/* FOLD 1 IMAGES */}
                {heroImages[3] && (
                    <ParallaxImage
                        depth={0.5}
                        delay={0.2}
                        className="top-[9%] left-[4%] md:top-[16%] md:left-[4%]"
                        imgClassName="w-28 h-28 md:w-40 md:h-40 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[3]}
                    />
                )}
                {heroImages[0] && (
                    <ParallaxImage
                        depth={1}
                        delay={0.35}
                        className="top-[14%] left-[55%] md:top-[14%] md:left-[75%]"
                        imgClassName="w-40 h-20 md:w-64 md:h-32 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[0]}
                    />
                )}

                {/* FOLD 2 IMAGES */}
                {heroImages[2] && (
                    <ParallaxImage
                        depth={1}
                        delay={0.5}
                        className="hidden md:block top-[22%] left-[15%] md:top-[68%] md:left-[22%]"
                        imgClassName="w-40 h-52 md:w-52 md:h-64 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[2]}
                    />
                )}
                {heroImages[4] && (
                    <ParallaxImage
                        depth={2}
                        delay={0.65}
                        className="hidden md:block top-[5%] left-[64%] md:top-[60%] md:left-[64%]"
                        imgClassName="w-32 h-32 md:w-40 md:h-40 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[4]}
                    />
                )}

                {heroImages[1] && (
                    <ParallaxImage
                        depth={1}
                        delay={0.85}
                        className="top-[72%] left-[2%] md:top-[62%] md:left-[2%]"
                        imgClassName="w-32 h-32 md:w-48 md:h-48 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[1]}
                    />
                )}
                {heroImages[5] && (
                    <ParallaxImage
                        depth={2}
                        delay={0.95}
                        className="top-[80%] left-[60%] md:top-[70%] md:left-[80%]"
                        imgClassName="w-32 h-32 md:w-48 md:h-60 cursor-pointer rounded-xl shadow-lg"
                        src={heroImages[5]}
                    />
                )}
            </div>

            {/* Mobile: Image Marquee */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: CLASSY_EASE, delay: 0.8 }}
                className="md:hidden w-full mt-8 z-20"
            >
                <Marquee
                    speed={8}
                    itemClassName="w-[20rem] !py-0 !pl-3"
                    items={heroMarqueeItems}
                    renderItem={(item) => (
                        <div className="p-1.5 border border-black/5 rounded-xl bg-white shadow-sm">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={240}
                                height={160}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    )}
                />
            </motion.div>
        </div>
    );
};

const ParallaxImage = ({
    className,
    imgClassName,
    src,
    depth,
    delay
}: {
    className: string;
    imgClassName: string;
    src: string;
    depth: number;
    delay: number;
}) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollY } = useScroll();
    // Disable parallax on mobile for better performance
    const y = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : -60 * depth]);
    const imgY = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : 30 * depth]);

    return (
        <motion.div
            style={{ y }}
            className={`absolute ${className} z-20 pointer-events-auto`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                        duration: 1.2,
                        ease: CLASSY_EASE,
                        delay: delay
                    }
                }}
                className={`overflow-hidden relative ${imgClassName}`}
            >
                <motion.img
                    style={{ y: imgY, scale: 1.25 }}
                    whileHover={{
                        scale: 1.35,
                        transition: { duration: 0.5, ease: CLASSY_EASE }
                    }}
                    src={src}
                    className="w-full h-full object-cover"
                />
            </motion.div>
        </motion.div>
    );
};

