"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconBrandInstagram as Instagram, IconBrandTwitter as Twitter, IconBrandLinkedin as Linkedin, IconBrandFacebook as Facebook } from "@tabler/icons-react";
import Marquee from "@/components/ui/image-tiles";
import { usePathname } from "next/navigation";
import { CardSection } from "@/components/layout/CardSection";
import { CTA_IDS } from "@/lib/cta-ids";

const TWEET_ITEMS = [
    { src: "/tweet-images/tweet_1.webp", alt: "Tweet 1", url: "https://x.com/kaashvisaxena/status/1792521732768571898?s=20" },
    { src: "/tweet-images/tweet_2.webp", alt: "Tweet 2", url: "https://x.com/DeepankarBhade/status/1974727427097288808" },
    { src: "/tweet-images/tweet_3.webp", alt: "Tweet 3", url: "https://x.com/kritikatwtss/status/1884586531676934152" },
    { src: "/tweet-images/tweet_5.webp", alt: "Tweet 5", url: "https://x.com/0xKaash/status/1938883891139617144" },
    { src: "/tweet-images/tweet_6.webp", alt: "Tweet 6", url: "https://x.com/anmolm_/status/1933164167407534570" },
    { src: "/tweet-images/tweet_7.webp", alt: "Tweet 7", url: "https://x.com/BrownPoints/status/1903082268266205619" },
    { src: "/tweet-images/tweet_9.webp", alt: "Tweet 9", url: "https://x.com/supradeux/status/1896953965147037771" },
    { src: "/tweet-images/tweet_10.webp", alt: "Tweet 10", url: "https://x.com/anu_raag_/status/1893538763160117701" },
    { src: "/tweet-images/tweet_11.webp", alt: "Tweet 11", url: "https://x.com/malikgarv/status/1884831686334271793" },
    { src: "/tweet-images/tweet_12.webp", alt: "Tweet 12", url: "https://x.com/chaicoder/status/1884597928645271741" },
];

const TEAM_ITEMS = [
    { src: "/team-images/team_1.webp", alt: "Team 1", url: "" },
    { src: "/team-images/team_2.webp", alt: "Team 2", url: "" },
    { src: "/team-images/team_3.webp", alt: "Team 3", url: "" },
    { src: "/team-images/team_4.webp", alt: "Team 4", url: "" },
    { src: "/team-images/team_5.webp", alt: "Team 5", url: "" },
    { src: "/team-images/team_6.webp", alt: "Team 6", url: "" },
    { src: "/team-images/team_7.webp", alt: "Team 7", url: "" },
    { src: "/team-images/team_8.webp", alt: "Team 8", url: "" },
    { src: "/team-images/team_9.webp", alt: "Team 9", url: "" },
];

export const Footer = () => {
    const pathname = usePathname();
    if (pathname && (pathname.startsWith("/secured") || pathname.startsWith("/renewal-guide"))) return null;

    const marqueeItems = pathname === "/about" ? TEAM_ITEMS : TWEET_ITEMS;

    return (
        <footer
            className="bg-bg-white text-text-main pb-0 overflow-hidden relative "
        >
            {/* Tweet Marquee */}
            <div className="w-full relative overflow-hidden bg-bg-white flex items-center justify-center">
                <Marquee
                    speed={5}
                    itemClassName="w-[400px] !py-0 !pl-4"
                    items={marqueeItems}
                    renderItem={(item) => {
                        const Content = (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={400}
                                height={550}
                                className="w-full h-auto object-contain rounded-xl shadow-md"
                            />
                        );

                        if (item.url) {
                            return (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity flex items-center"
                                >
                                    {Content}
                                </a>
                            );
                        }

                        return (
                            <div className="block w-full h-full flex items-center">
                                <div className="p-2 border border-black/5 rounded-2xl bg-white shadow-sm">
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        width={400}
                                        height={550}
                                        className="w-full h-auto object-contain rounded-xl"
                                    />
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
            <CardSection className="bg-ground-brown/4" paddingX="large" paddingY="large">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 py-2">
                    {/* Left Section - Logo and Tagline */}
                    <div className="col-span-1">
                        <Link href="/" className="inline-block mb-8">
                            <Image
                                src="/images/flentinbengaluru.svg"
                                alt="Flent"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <h3 className=" font-heading font-bold text-text-main leading-tight">
                            Why Rent,
                            <br />
                            <span className="font-zin-italic">When You Can Flent</span>
                        </h3>
                    </div>

                    {/* Right Section - Two Column Menus */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-16">
                        {/* Explore Menu */}
                        <div>
                            <h4 className="text-sm font-heading font-bold text-text-main mb-6 uppercase tracking-wider">
                                EXPLORE
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    { label: "All Homes", href: "/homes" },
                                    { label: "Our Story", href: "/about" },
                                    { label: "For Owners", href: "/owners" },
                                    { label: "Careers", 
                                        href: "https://empty-bite-b73.notion.site/Flent-Hiring-Guide-42ffc8b1ff6648869f4c45f85ec5a1b8",
                                        external: true,
                                     { label: "Join Tastemakers (NEW)", href:"/tastemakers"}
                                    }
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-text-main hover:text-text-main/70 transition-colors text-base"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Menu */}
                        <div>
                            <h4 className="text-sm font-heading font-bold text-text-main mb-6 uppercase tracking-wider">
                                CONTACT
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <p className="text-text-main text-base">
                                        <span className="font-medium">For Tenants:</span>{" "}
                                        <a
                                            href="tel:+918123659925"
                                            className="hover:text-text-main/70 transition-colors"
                                        >
                                            +91 8123659925
                                        </a>
                                    </p>
                                </li>
                                <li>
                                    <p className="text-text-main text-base">
                                        <span className="font-medium">For Homeowners:</span>{" "}
                                        <a
                                            href="tel:+918123380807"
                                            className="hover:text-text-main/70 transition-colors"
                                        >
                                            +91 8123380807
                                        </a>
                                    </p>
                                </li>
                            </ul>

                            {/* Social Icons */}
                            <div className="flex space-x-3 mt-8">
                                {[
                                    { Icon: Instagram, href: "https://www.instagram.com/flent.in/", label: "Instagram" },
                                    { Icon: Linkedin, href: "https://www.linkedin.com/company/flenthomes/", label: "LinkedIn" },
                                    { Icon: Twitter, href: "https://x.com/flenthomes", label: "Twitter" },
                                    { Icon: Facebook, href: "https://www.facebook.com/p/Flent-61560227362485/", label: "Facebook" }
                                ].map(({ Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border-2 border-text-main text-text-main flex items-center justify-center hover:bg-text-main hover:text-white transition-colors"
                                        aria-label={label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardSection>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Bottom Section */}
                <div className="border-t border-text-main/10 pt-6 pb-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-text-main/60 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Flent. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-text-main/60 text-sm">
                        <Link href="/privacy-policy" className="hover:text-text-main transition-colors" data-cta-id={CTA_IDS.FOOTER_PRIVACY}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-use" className="hover:text-text-main transition-colors" data-cta-id={CTA_IDS.FOOTER_TERMS}>
                            Terms of Service
                        </Link>
                        <Link href="/refund-policy" className="hover:text-text-main transition-colors" data-cta-id={CTA_IDS.FOOTER_REFUND}>
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>


        </footer>
    );
};
