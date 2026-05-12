"use client";

import React from "react";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { OpenSection } from "@/components/layout/OpenSection";
import { CTA_IDS } from "@/lib/cta-ids";
import { getWhatsAppLinkNow } from "@/lib/whatsapp";

interface HeroSectionProps {
    badge?: string;
    heading: string;
    description: string;
    buttons?: {
        primary?: {
            text: string;
            url?: string;
            onClick?: () => void;
        };
    };
    image: {
        src: string;
        alt: string;
    };
}

export const HeroSection = ({
    badge,
    heading = "Guaranteed Rent In 30 Days Or Less",
    description = "Flent transforms your property into a fully furnished, move-in ready apartment and rents it out to top tier tenants in no time.",
    buttons = {
        primary: {
            text: "Get Started",
            url: "#contact",
        },
    },
    image = {
        src: "/institution-logos/Owners_hero_final.png",
        alt: "Premium furnished apartment",
    },
}: Partial<HeroSectionProps> = {}) => {
    const handleWhatsAppClick = () => {
        const whatsappUrl = getWhatsAppLinkNow(
            "Hi! I'm interested in listing my property with Flent.",
            { format: "wa.me" }
        );
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <OpenSection className="py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                    {/* Text Content - Left Side */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                        {badge && (
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-text-main bg-bg-white px-4 py-2 text-sm font-medium text-text-main">
                                {badge}
                            </div>
                        )}

                        <h1 className="mb-6 text-fluid-h1 font-heading text-text-main">
                            <span className="font-bold">
                                Guaranteed Rent
                                <br />
                                <span className="font-zin-italic">In 30 Days Or Less</span>
                            </span>
                        </h1>

                        <p className="mb-8 max-w-xl text-subtitle font-body">
                            {description}
                        </p>

                        <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            {buttons.primary && (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    href={buttons.primary.url}
                                    data-cta-id={CTA_IDS.OWNERS_HERO_CTA}
                                    data-cta-context="owners_hero"
                                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                                        if (!buttons.primary) return;
                                        
                                        // Only handle hash links (#contact) with smooth scroll
                                        if (buttons.primary.url?.startsWith('#')) {
                                            e.preventDefault();
                                            const targetId = buttons.primary.url.replace("#", "");
                                            const element = document.getElementById(targetId);
                                            if (element) {
                                                const navbarHeight = 100;
                                                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                                                const offsetPosition = elementPosition - navbarHeight;
                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: "smooth",
                                                });
                                            }
                                        }
                                        // For external URLs, let default anchor behavior work (no preventDefault)
                                        // For custom onClick handlers, they can handle preventDefault themselves
                                        if (buttons.primary.onClick && !buttons.primary.url?.startsWith('#')) {
                                            buttons.primary.onClick();
                                        } else if (!buttons.primary.url && !buttons.primary.onClick) {
                                            handleWhatsAppClick();
                                        }
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    {buttons.primary.text}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Image - Right Side with Torn Paper Effect */}
                    <div className="relative h-[400px] w-full lg:h-[500px] flex items-center justify-center">
                        <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                            {/* Torn Paper Edge - Top */}
                            <div className="absolute top-0 left-0 w-full h-8 md:h-12 z-20 -translate-y-1 pointer-events-none">
                                <svg className="w-full h-full text-bg-white fill-current">
                                    <defs>
                                        <filter id="paper-tear-top-hero" x="-20%" y="-20%" width="140%" height="140%">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="42" result="noise" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                                        </filter>
                                    </defs>
                                    <rect x="-10%" y="0" width="120%" height="20" filter="url(#paper-tear-top-hero)" />
                                </svg>
                            </div>

                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Torn Paper Edge - Bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 z-20 translate-y-1 pointer-events-none">
                                <svg className="w-full h-full text-bg-white fill-current">
                                    <defs>
                                        <filter id="paper-tear-bottom-hero" x="-20%" y="-20%" width="140%" height="140%">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="1" result="noise" />
                                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                                        </filter>
                                    </defs>
                                    <rect x="-10%" y="10" width="120%" height="100%" filter="url(#paper-tear-bottom-hero)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
