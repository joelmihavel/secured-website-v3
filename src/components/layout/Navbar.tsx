"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2 as Menu, IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { cn } from "@/lib/utils";
import { DEFAULT_INTEREST_MESSAGE } from "@/constants";
import { useCTATracking } from "@/hooks/useCTATracking";
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta";
import { CTA_IDS, navbarBreadcrumbCtaId } from "@/lib/cta-ids";

/** Single config for main nav links (All Homes, Our Story, Secured, For Owners). Used by both hamburger and expanded nav. */
const NAV_MENU_LINKS = [
  { name: "All Homes", href: "/homes", sectionId: "", ctaId: CTA_IDS.NAVBAR_HOMES },
  { name: "Our Story", path: "/about", ctaId: CTA_IDS.NAVBAR_ABOUT },
  { name: "Become an Affiliate", path: "/tastemaker", ctaId: CTA_IDS.TASTEMAKER_AFFILIATE },
  { name: "Secured", path: "/secured", ctaId: CTA_IDS.NAVBAR_SECURED, pastelColor: "orange" as const },
  { name: "For Owners", path: "/owners", ctaId: CTA_IDS.NAVBAR_OWNERS, pastelColor: "violet" as const, showRightIcon: true },
] as const;

const defaultNavLinks = [
    { name: "All Homes", href: "/homes", sectionId: "" },
];

type NavbarVariant = "hamburger" | "expanded" | "secure";

interface NavbarProps {
    /**
     * Variant 1 (hamburger) - Used in property detail pages as well as on all pages on mobile
     * Variant 2 (expanded) - Used on Homepage, About, Homes listing, Owners pages (desktop only)
     * Variant 3 (secure) - Used on Flent Secure pages with specific tabs
     */
    variant?: NavbarVariant;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const NavbarContent = ({ variant, activeTab, onTabChange }: NavbarProps) => {
    const pathname = usePathname();
    const isSecurePath = pathname.startsWith("/secured");
    const isRenewalGuidePath = pathname.startsWith("/renewal-guide");
    const shouldHideNavbar = (isSecurePath && variant !== "secure") || isRenewalGuidePath;

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [canHover, setCanHover] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia("(hover: hover)").matches : false
    );
    const [isMobileViewport, setIsMobileViewport] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
    );
    const [isComparisonInView, setIsComparisonInView] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (shouldHideNavbar) return;

        const mediaQuery = window.matchMedia("(hover: hover)");

        const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [shouldHideNavbar]);

    useEffect(() => {
        if (shouldHideNavbar) return;

        const mediaQuery = window.matchMedia("(max-width: 767px)");

        const handler = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [shouldHideNavbar]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { trackCTAClick } = useCTATracking();
    const contactCta = useWhatsAppCta(DEFAULT_INTEREST_MESSAGE, { format: "wa.me" });
    const isHome = pathname === "/";
    const isPropertyDetail = pathname.startsWith('/homes/') && pathname.split('/').length === 3;
    const { neighborhoodName } = useBreadcrumb();

    // Determine effective variant:
    // - If variant is explicitly set, use it
    // - If on property detail page, auto-use hamburger
    // - Otherwise default to expanded (shows hamburger on mobile via CSS)
    const effectiveVariant = variant ?? (isPropertyDetail ? "hamburger" : "expanded");
    const showExpandedNav = effectiveVariant === "expanded";
    const shouldShowComparisonMorph =
        pathname === "/rent-calculator" &&
        isMobileViewport &&
        isComparisonInView &&
        !isOpen &&
        !isHovered;

    // Close menu on outside click
    useEffect(() => {
        if (shouldHideNavbar) return;
        if (!isOpen) return; // Only listen when menu is open

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is outside the menu container
            // The menu button is inside the container, so it's already excluded
            if (
                menuRef.current &&
                !menuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        // Small delay to prevent immediate close from the toggle click
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, shouldHideNavbar]);

    useEffect(() => {
        if (shouldHideNavbar) return;
        if (pathname !== "/rent-calculator" || !isMobileViewport) {
            return;
        }

        let observer: IntersectionObserver | null = null;
        let frameId: number | null = null;
        let retries = 0;
        const maxRetries = 10;

        const setupObserver = () => {
            const target = document.getElementById("rent-calculator-comparison");

            if (!target && retries < maxRetries) {
                retries += 1;
                frameId = window.requestAnimationFrame(setupObserver);
                return;
            }

            if (!target) {
                setIsComparisonInView(false);
                return;
            }

            observer = new IntersectionObserver(
                ([entry]) => {
                    setIsComparisonInView(entry.isIntersecting);
                },
                { threshold: 0, rootMargin: "-30% 0px -30% 0px" }
            );

            observer.observe(target);
        };

        setupObserver();

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
            if (observer) {
                observer.disconnect();
            }
        };
    }, [isMobileViewport, pathname, shouldHideNavbar]);

    // If it's a secure path BUT variant is not secure, it means it's the global Navbar in layout.tsx.
    // We hide it because the secure page provides its own Navbar instance with the correct variant and state.
    if (shouldHideNavbar) return null;

    const getLinkHref = (link: { href: string; sectionId: string }) => {
        if (isHome && link.sectionId) {
            return `#${link.sectionId}`;
        }
        return link.href;
    };

    // Generate breadcrumbs based on path (only for hamburger variant on property detail)
    const generateBreadcrumbs = () => {
        const segments = pathname.split("/").filter((segment) => segment !== "");

        // Special handling for homes/[slug] route
        if (segments[0] === "homes" && segments.length === 2) {
            return [
                { href: "/homes", label: "Homes", isLast: false },
                {
                    href: neighborhoodName ? `/homes?location=${encodeURIComponent(neighborhoodName)}` : "/neighborhoods",
                    label: neighborhoodName || "Neighbourhoods",
                    isLast: false
                },
                {
                    href: pathname,
                    label: segments[1]
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    isLast: true
                },
            ];
        }

        return [];
    };

    const breadcrumbs = generateBreadcrumbs();

    // Render left section based on variant and page
    const renderLeftSection = () => {
        if (variant === "secure") {
            return (
                <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="bg-white rounded-full shadow-lg border border-text-main h-11 md:h-14 px-3.5 md:px-6 flex items-center pointer-events-auto hover:bg-gray-100"
                    data-cta-id={CTA_IDS.NAVBAR_LOGO_SECURE}
                    data-cta-context="navbar"
                >
                    <Image
                        src="/images/flentinbengaluru.svg"
                        alt="Flent"
                        width={72}
                        height={24}
                        className="h-[18px] md:h-6 w-auto"
                        priority
                    />
                </Button>
            );
        }

        if (effectiveVariant === "hamburger" && isPropertyDetail) {
            // Property detail page with hamburger variant: Show expandable breadcrumbs
            return (
                <motion.div
                    className="flex items-center border-1 border-black bg-white rounded-full shadow-lg border h-11 md:h-14 border-text-main overflow-hidden pointer-events-auto px-2"
                    initial="collapsed"
                    whileHover="expanded"
                    variants={{
                        collapsed: { width: "auto" },
                        expanded: { width: "auto" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/homes?${searchParams.toString()}`)} data-cta-id={CTA_IDS.NAVBAR_BACK} data-cta-context="navbar">
                        <ArrowLeft />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} data-cta-id={CTA_IDS.NAVBAR_LOGO} data-cta-context="navbar">
                        <Image
                            src="/images/flentinbengaluru.svg"
                            alt="Flent"
                            width={60}
                            height={24}
                            className="h-[18px] md:h-6 w-auto"
                        />
                    </Button>
                    <motion.div
                        variants={{
                            collapsed: { opacity: 0, filter: "blur(10px)", width: 0, paddingRight: 0 },
                            expanded: { opacity: 1, filter: "blur(0px)", width: "auto", paddingRight: "1rem" }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex items-center gap-2 md:gap-3 md:pr-2 whitespace-nowrap text-xs md:text-sm overflow-hidden"
                    >
                        <Breadcrumb>
                            <BreadcrumbList className="flex-nowrap">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.href}>
                                        {index === 0 && <BreadcrumbSeparator className="flex-shrink-0" />}
                                        <BreadcrumbItem className="flex-shrink-0">
                                            {crumb.isLast ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <span
                                                    onClick={() => {
                                                        trackCTAClick({
                                                            cta_id: navbarBreadcrumbCtaId(crumb.label),
                                                            cta_text: crumb.label,
                                                            cta_type: "link",
                                                            cta_destination: crumb.href,
                                                            page_section: "navbar",
                                                        });
                                                        router.push(crumb.href);
                                                    }}
                                                    className="cursor-pointer hover:text-foreground transition-colors"
                                                >
                                                    {crumb.label}
                                                </span>
                                            )}
                                        </BreadcrumbItem>
                                        {!crumb.isLast && <BreadcrumbSeparator className="flex-shrink-0" />}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </motion.div>
                </motion.div>
            );
        }

        if (!isHome) {
            // Non-homepage: Show back arrow + logo
            return (
                <motion.div
                    layout
                    className="flex items-center bg-white rounded-full shadow-lg border h-11 md:h-14 border-text-main overflow-hidden pointer-events-auto px-2"
                    initial="collapsed"
                    whileHover="expanded"
                    variants={{
                        collapsed: { width: "auto" },
                        expanded: { width: "auto" }
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
                >
                    <AnimatePresence initial={false}>
                        <motion.div
                            key="navbar-back-arrow"
                            initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/')}
                                data-cta-id={CTA_IDS.NAVBAR_BACK}
                                data-cta-context="navbar"
                            >
                                <ArrowLeft />
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} data-cta-id={CTA_IDS.NAVBAR_LOGO} data-cta-context="navbar">
                        <Image
                            src="/images/flentinbengaluru.svg"
                            alt="Flent"
                            width={60}
                            height={24}
                            className="h-[18px] md:h-6 w-auto"
                        />
                    </Button>
                </motion.div>
            );
        }

        // Homepage: Simple logo
        return (
            <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="bg-white rounded-full shadow-lg border border-text-main h-11 md:h-14 px-3.5 md:px-6 flex items-center pointer-events-auto hover:bg-gray-100"
                data-cta-id={CTA_IDS.NAVBAR_LOGO}
                data-cta-context="navbar"
            >
                <Image
                    src="/images/flentinbengaluru.svg"
                    alt="Flent"
                    width={72}
                    height={24}
                    className="h-[18px] md:h-6 w-auto"
                    priority
                />
            </Button>
        );
    };

    const renderSecureTabs = () => {
        if (variant !== "secure" || !activeTab || !onTabChange) return null;

        const tabs = [
            { value: 'tenant', label: 'Tenants' },
            { value: 'landlord', label: 'Landlords' }
        ];

        return (
            <div className={cn(
                "hidden md:flex items-center bg-transparent pointer-events-auto z-40",
                (isOpen || isHovered) && "opacity-0 pointer-events-none"
            )}>
                <div className="bg-gray-50 p-1 h-auto rounded-full border border-black/5 shadow-sm relative grid grid-cols-2 isolate">
                    {/* Tab buttons - grid ensures equal widths */}
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => onTabChange(tab.value)}
                                className={cn(
                                    "relative h-9 rounded-full px-6 font-heading font-bold tracking-wide text-sm z-10 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-colors duration-200",
                                    isActive ? "text-text-main" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="secure-tab-pill"
                                        className="absolute inset-0 bg-pastel-orange border-2 border-text-main shadow-[0px_4px_0px_0px_rgba(21,16,46,1)] rounded-full -z-10"
                                        style={{
                                            backgroundColor: 'var(--color-pastel-orange)',
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 25,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render hamburger menu
    const renderHamburgerMenu = () => (
        <div
            ref={menuRef}
            className={cn(
                "relative pointer-events-auto h-11 md:h-14 flex-shrink-0 z-50",
                // For expanded variant, hide hamburger on desktop (lg+)
                showExpandedNav && "lg:hidden",
                shouldShowComparisonMorph ? "w-full min-w-0 flex-1" : "w-11 md:w-14"
            )}
            onMouseEnter={() => canHover && setIsHovered(true)}
            onMouseLeave={() => canHover && setIsHovered(false)}
        >
            {(() => {
                const collapsedSize = isMobileViewport ? 44 : 56;
                return (
                    <>
            <div className="absolute -inset-4 bg-transparent z-[-1]" />
            <motion.div
                layout
                className={cn(
                    "absolute right-0 top-0 shadow-lg border border-text-main flex flex-col items-start overflow-hidden origin-top-right z-50",
                    shouldShowComparisonMorph ? "bg-pastel-orange" : "bg-white"
                )}
                initial="collapsed"
                variants={{
                    collapsed: {
                        height: collapsedSize,
                        width: shouldShowComparisonMorph ? "100%" : collapsedSize,
                        borderRadius: "9999px"
                    },
                    expanded: { height: 'auto', width: 220, borderRadius: '12%' }
                }}
                animate={isOpen || isHovered ? "expanded" : "collapsed"}
                transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
            >
                <div className="flex flex-col items-stretch w-full">
                    <motion.button
                        layout
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex min-w-[44px] items-center justify-center h-11 md:h-14 md:min-w-[56px] flex-shrink-0",
                            shouldShowComparisonMorph ? "w-full px-4 py-2" : "",
                            canHover && "pointer-events-none"
                        )}
                        aria-label="Open menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {shouldShowComparisonMorph ? (
                                <motion.div
                                    key="flenting-vs-renting-label"
                                    initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 whitespace-nowrap text-center"
                                >
                                    <span className="text-base font-heading font-bold leading-none text-text-main">
                                        Flenting
                                    </span>
                                    <span className="text-subtitle-sm font-semibold uppercase tracking-wide text-text-main/70">
                                        vs
                                    </span>
                                    <span className="text-base font-heading font-bold leading-none text-text-main">
                                        Renting
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.span
                                    key="menu-icon"
                                    initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                >
                                    <Menu className="w-6 h-6 md:w-7 md:h-7 text-text-main" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    <motion.div
                        variants={{
                            collapsed: { opacity: 0, height: 0 },
                            expanded: { opacity: 1, height: "auto" }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col gap-2 px-3 md:px-4 pb-3 md:pb-4"
                    >
                        {defaultNavLinks.map((link) => (
                            <Button
                                key={link.name}
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                disabled={!link.href}
                                data-cta-id={CTA_IDS.NAVBAR_HOMES}
                                data-cta-context="navbar"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    if (link.href) {
                                        if (!isHome && link.sectionId) {
                                            e.preventDefault();
                                            router.push(`/#${link.sectionId}`);
                                        } else {
                                            router.push(getLinkHref(link));
                                        }
                                        setIsOpen(false);
                                    }
                                }}
                                style={!link.href ? { opacity: 0.5, cursor: 'default' } : undefined}
                            >
                                {link.name}
                            </Button>
                        ))}
                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full"
                                size="sm"
                                variant="ghost"
                                data-cta-id={CTA_IDS.NAVBAR_ABOUT}
                                data-cta-context="navbar"
                                onClick={() => {
                                    router.push('/about');
                                    setIsOpen(false);
                                }}
                            >
                                Our Story
                            </Button>
                            <Button
                                {...contactCta}
                                className="w-full"
                                size="sm"
                                variant="ghost"
                                data-cta-id={CTA_IDS.NAVBAR_CONTACT_US}
                                data-cta-context="navbar"
                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    contactCta.onClick(e);
                                    setIsOpen(false);
                                }}
                            >
                                Contact Us
                            </Button>
                            <Button
                                className="w-full"
                                size="sm"
                                variant="primary-rounded"
                                pastelColor="orange"
                                data-cta-id={CTA_IDS.NAVBAR_SECURED}
                                data-cta-context="navbar"
                                onClick={() => {
                                    router.push('/secured');
                                    setIsOpen(false);
                                }}
                            >
                                Secured
                            </Button>
                            <Button
                                className="w-full"
                                size="sm"
                                variant="primary-rounded"
                                pastelColor="violet"
                                data-cta-id={CTA_IDS.NAVBAR_OWNERS}
                                data-cta-context="navbar"
                                onClick={() => {
                                    router.push('/owners');
                                    setIsOpen(false);
                                }}
                            >
                                For Owners
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
                    </>
                );
            })()}
        </div>
    );

    // Render expanded nav (desktop only, for expanded variant)
    const renderExpandedNav = () => {
        if (!showExpandedNav) return null;

        return (
            <div className="hidden lg:flex items-center gap-1 bg-white rounded-full shadow-lg border border-text-main h-14 px-2 pointer-events-auto">
                {NAV_MENU_LINKS.map((link, index) => (
                    <React.Fragment key={link.ctaId}>
                        {index === 2 && <div className="w-1" />}
                        {"path" in link ? (
                            <Button
                                variant={"pastelColor" in link && link.pastelColor ? "primary" : "ghost"}
                                size="sm"
                                className="rounded-full"
                                pastelColor={"pastelColor" in link ? link.pastelColor : undefined}
                                data-cta-id={link.ctaId}
                                data-cta-context="navbar"
                                onClick={() => router.push(link.path)}
                                rightIcon={"showRightIcon" in link && link.showRightIcon ? <ArrowRight /> : undefined}
                            >
                                {link.name}
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                                data-cta-id={link.ctaId}
                                data-cta-context="navbar"
                                onClick={() => router.push(link.href)}
                            >
                                {link.name}
                            </Button>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <nav className={cn(
            "fixed top-[var(--top-banner-height,0px)] left-0 right-0 z-50 pt-0.5 md:pt-1 pb-2 pointer-events-none transition-[top] duration-200",
            variant === "secure" ? "px-4 md:px-8 lg:px-12" : "px-3 sm:px-4 md:px-6 lg:px-8"
        )}>
            <div className={cn(
                "relative mx-auto flex items-center justify-between h-16 md:h-20",
                variant === "secure" ? "max-w-7xl" : "max-w-12xl"
            )}>
                <div className={cn(shouldShowComparisonMorph && "invisible pointer-events-none absolute left-0")}>
                    {renderLeftSection()}
                </div>

                <div className={cn(
                    "flex justify-end gap-2 md:gap-3 items-center",
                    shouldShowComparisonMorph && "w-full flex-1 min-w-0 justify-center"
                )}>
                    {renderSecureTabs()}
                    {renderExpandedNav()}
                    {/* Mobile Get App Button - Only for secured page */}
                    {variant === "secure" && (
                        <Button
                            href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            size="sm"
                            className="md:hidden pointer-events-auto rounded-full px-5"
                            data-cta-id={CTA_IDS.SECURED_GET_APP}
                            data-cta-context="navbar"
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                borderColor: 'white'
                            }}
                        >
                            Get App
                        </Button>
                    )}
                    {renderHamburgerMenu()}
                </div>
            </div>
        </nav>
    );
};

export const Navbar = (props: NavbarProps) => {
    return (
        <Suspense fallback={null}>
            <NavbarContent {...props} />
        </Suspense>
    );
};

