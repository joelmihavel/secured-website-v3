"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronUp as ChevronUp, IconPhone as PhoneIcon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DEFAULT_INTEREST_MESSAGE, getPropertyInterestMessage } from "@/constants";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Property } from "@/lib/webflow";
import { useMobile } from "@/hooks/useMobile";
import { useCTATracking } from "@/hooks/useCTATracking";
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta";
import { CTA_IDS, bottomNavSectionCtaId } from "@/lib/cta-ids";
import { useDrawerOpen } from "@/context/DrawerOpenContext";

interface NavLink {
  name: string;
  href: string;
}

const defaultPropertyNavLinks: NavLink[] = [
  { name: "Rooms", href: "#rooms" },
  { name: "Amenities", href: "#amenities-heading" },
  { name: "Neighborhood", href: "#neighborhood" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
];

interface BottomNavigationProps {
  property?: Property;
  customLinks?: NavLink[];
  customMessage?: string;
  showAtId?: string;
  showChat?: boolean;
}

function useActiveSectionOnScroll(navLinks: NavLink[], showAtId: string) {
  const [activeSection, setActiveSection] = useState(navLinks[0]?.name || "");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const tickingRef = React.useRef(false);

  useEffect(() => {
    const compute = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Show mobile nav after scrolling 100px or reaching the trigger section
      const triggerSection = document.getElementById(showAtId);
      let isTriggered = window.scrollY > 100; // Default: show after 100px scroll

      if (triggerSection) {
        const triggerRect = triggerSection.getBoundingClientRect();
        const triggerTop = triggerRect.top + window.scrollY;
        if (window.scrollY >= triggerTop - 100) {
          isTriggered = true;
        }
      }

      setShowMobileNav(isTriggered);

      for (const link of navLinks) {
        const element = document.querySelector(link.href) as HTMLElement;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(link.name);
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        compute();
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll);
    compute(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks, showAtId]);

  return { activeSection, setActiveSection, showMobileNav };
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  property,
  customLinks,
  customMessage,
  showAtId = "rooms",
  showChat = true,
}) => {
  const isMobile = useMobile();
  const { trackCTAClick } = useCTATracking();
  const { isDrawerOpen } = useDrawerOpen();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = customLinks || defaultPropertyNavLinks;
  const { activeSection, setActiveSection, showMobileNav } =
    useActiveSectionOnScroll(navLinks, showAtId);

  const finalMessage = customMessage
    ? customMessage
    : property
      ? getPropertyInterestMessage(property.fieldData.name)
      : DEFAULT_INTEREST_MESSAGE;

  const whatsAppCta = useWhatsAppCta(finalMessage, {
    format: "wa.me",
    tracking: {
      source: "bottom_nav",
      propertySlug: property?.fieldData.slug,
      propertyName: property?.fieldData.name,
    },
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = href.replace("#", "");
    const link = navLinks.find((l) => l.href === href);
    if (link) setActiveSection(link.name);

    // Close the modal first
    setIsOpen(false);

    // Wait for modal to close, then scroll
    setTimeout(() => {
      const element = document.getElementById(targetId);

      if (element) {
        const navbarHeight = 100; // Account for navbar + some breathing room
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 300); // Match the modal close animation duration
  };

  if (isDrawerOpen) return null;

  return (
    <>
      {/* Mobile Navigation */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            key="mobile-bottom-nav"
            className="md:hidden fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Expandable section nav: section links + Chat */}
            <motion.div
                className="bg-white shadow-2xl border border-black pointer-events-auto overflow-hidden mx-auto"
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: {
                    height: "auto",
                    width: "340px",
                    borderRadius: "24px",
                  },
                  closed: {
                    height: "68px",
                    width: "fit-content",
                    minWidth: "90vw",
                    borderRadius: "34px",
                  },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ maxWidth: "calc(100vw - 32px)" }}
              >
                <div className="flex flex-col w-full">
                  <div
                    className="flex items-center justify-between p-2 gap-1 w-full cursor-pointer"
                    onClick={() => {
                      trackCTAClick({
                        cta_id: CTA_IDS.BOTTOM_NAV_TOGGLE,
                        cta_text: isOpen ? "Collapse Navigation" : "Expand Navigation",
                        cta_type: "button",
                        page_section: "bottom_navigation",
                      });
                      setIsOpen(!isOpen);
                    }}
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors">
                      <span className="font-heading text-fluid-medium text-text-main whitespace-nowrap">
                        {activeSection}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronUp className="w-5 h-5 text-text-main" />
                      </motion.div>
                    </div>

                    {showChat && (
                      <Button
                        {...whatsAppCta}
                        variant="secondary"
                        size="md"
                        leftIcon={!isMobile ? <PhoneIcon /> : <WhatsAppIcon />}
                        className="rounded-full"
                        data-cta-id={CTA_IDS.CHAT_WITH_US_MOBILE}
                        data-cta-context="bottom_navigation"
                      >
                        {!isMobile ? "Get a Call Back" : "Chat With Us"}
                      </Button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-2 pb-2 flex flex-col"
                      >
                        <div className="h-px bg-gray-100 w-full my-2 mx-2" />
                        {navLinks.map((link) => (
                          <div
                            key={link.name}
                            onClick={(e) => {
                              trackCTAClick({
                                cta_id: bottomNavSectionCtaId(link.name),
                                cta_text: link.name,
                                cta_type: "button",
                                cta_destination: link.href,
                                page_section: "bottom_navigation",
                              });
                              handleLinkClick(e, link.href);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-3 rounded-full cursor-pointer transition-colors duration-200 hover:bg-ground-brown/5",
                              activeSection === link.name && "bg-black/5"
                            )}
                          >
                            <span className="font-heading text-button-link text-text-main font-bold tracking-wide">
                              {link.name}
                            </span>
                            {activeSection === link.name && (
                              <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation (Simple List) */}
      <motion.nav
        className="hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pb-8"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 1.5,
        }}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-full shadow-2xl border border-text-main px-3 py-2">
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                data-cta-id={bottomNavSectionCtaId(link.name)}
                data-cta-context="bottom_navigation"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  handleLinkClick(e, link.href);
                }}
              >
                {link.name}
              </Button>
            ))}

            {/* Chat With Us Button */}
            {showChat && (
              <Button
                {...whatsAppCta}
                variant="secondary"
                size="md"
                leftIcon={!isMobile ? <PhoneIcon /> : <WhatsAppIcon />}
                className="rounded-full"
                data-cta-id={CTA_IDS.CHAT_WITH_US_DESKTOP}
                data-cta-context="bottom_navigation"
              >
                {!isMobile ? "Get a Call Back" : "Chat With Us"}
              </Button>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
};
