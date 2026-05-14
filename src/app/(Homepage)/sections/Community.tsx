"use client";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { CardSection } from "@/components/layout/CardSection";
import { motion } from "framer-motion";

type CardType = "quote" | "portrait";

interface BaseCardData {
    id: number;
    type: CardType;
    rotation: number;
    x: number;
    y: number;
    zIndex: number;
}

interface QuoteCardData extends BaseCardData {
    type: "quote";
    text: string;
    author: string;
    bgColor: string;
}

interface PortraitCardData extends BaseCardData {
    type: "portrait";
    imageSrc: string;
    role: string;
    companyLogoSrc: string;
}

type CardData = QuoteCardData | PortraitCardData;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

const QuoteCard = ({ data }: { data: QuoteCardData }) => (
    <div
        className={`h-full w-full ${data.bgColor} p-8 flex flex-col justify-center items-center text-center select-none border-4 border-white shadow-sm rounded-2xl`}
    >
        <p className="text-xl text-text-main font-heading leading-relaxed">&quot;{data.text}&quot;</p>
        <p className="mt-4 text-sm text-text-main/60 font-body">- {data.author}</p>
    </div>
);

const PortraitCard = ({ data }: { data: PortraitCardData }) => (
    <div className="h-full w-full bg-white flex flex-col select-none border-4 border-white shadow-sm rounded-2xl overflow-hidden">
        {/* Person Image - Increased height (62%) */}
        <div className="relative w-full h-[62%] bg-gray-50 flex items-center justify-center">
            <Image
                src={data.imageSrc}
                alt={data.role}
                width={320}
                height={320}
                className="object-contain pointer-events-none max-h-[95%]"
                draggable={false}
            />
        </div>
        {/* Role - Compact height (13%) */}
        <div className="h-[13%] flex items-center justify-center border-b border-gray-50 bg-white">
            <p className="font-heading text-lg text-text-main leading-tight">{data.role}</p>
        </div>
        {/* Company Logo - Adjusted for 2:1 ratio (25%) */}
        <div className="h-[25%] flex items-center justify-center p-4 bg-white">
            <div className="relative w-[140px] h-[70px] md:w-[176px] md:h-[88px]">
                <Image
                    src={data.companyLogoSrc}
                    alt="Company Logo"
                    fill
                    className="object-contain pointer-events-none"
                    draggable={false}
                />
            </div>
        </div>
    </div>
);

export const Community = () => {
    const [mounted, setMounted] = useState(false);
    const [cards, setCards] = useState<CardData[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        // Detect mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const generateRandomPos = () => {
            const randomNormal = () => (Math.random() + Math.random() + Math.random() + Math.random()) / 4 - 0.5;

            // Tighter x-axis clustering around center (0)
            const xSpread = randomNormal() * 30;

            // Quote cards: positioned lower relative to the cluster center
            // Both shifted down (positive values) to be at bottom of canvas
            const yRange = { min: 10, max: 25 };  // Moved up from 20-35

            return {
                x: xSpread,
                y: Math.random() * (yRange.max - yRange.min) + yRange.min,
                rotation: Math.random() * 20 - 10,
            };
        };

        const rawCards: DistributiveOmit<CardData, "x" | "y" | "rotation" | "zIndex">[] = [
            {
                id: 1,
                type: "portrait",
                imageSrc: "/people/01.svg",
                role: "Software Engineer",
                companyLogoSrc: "/companies/google-icon-logo-svgrepo-com.svg",
            },
            {
                id: 2,
                type: "quote",
                text: "I've lived in 1BHKs all my life. I didn't expect flatmate living to feel this good until I moved to Flent.",
                author: "Anushka",
                bgColor: "bg-white",
            },
            {
                id: 3,
                type: "portrait",
                imageSrc: "/people/02.svg",
                role: "Product Manager",
                companyLogoSrc: "/companies/Uber_logo_2018.svg",
            },
            {
                id: 4,
                type: "portrait",
                imageSrc: "/people/03.svg",
                role: "Product Designer",
                companyLogoSrc: "/companies/Cred Club.svg",
            },
            {
                id: 5,
                type: "quote",
                text: "My flatmate & I used to brainstorm ideas in the evening after work, and we ended up starting a company together.",
                author: "Paras",
                bgColor: "bg-brand-yellow",
            },
            {
                id: 6,
                type: "portrait",
                imageSrc: "/people/04.svg",
                role: "Data Scientist",
                companyLogoSrc: "/companies/Zepto_Logo.svg",
            },
            {
                id: 7,
                type: "quote",
                text: "I was skeptical of moving in with strangers, but my flatmates were an instant vibe match.",
                author: "Deepankar",
                bgColor: "bg-pastel-green",
            },
            {
                id: 8,
                type: "portrait",
                imageSrc: "/people/05.svg",
                role: "Frontend Dev",
                companyLogoSrc: "/companies/1080px-Atlassian-logo.svg",
            },
            {
                id: 9,
                type: "quote",
                text: "Living at Flent feels like being part of a community, not just sharing a space.",
                author: "Riya",
                bgColor: "bg-pastel-pink",
            },
            {
                id: 10,
                type: "quote",
                text: "The best part? I found my people here - we share the same values and work ethic.",
                author: "Karan",
                bgColor: "bg-pastel-cyan",
            },
        ];

        // Separate portrait and quote cards for z-index ordering
        const portraitCards = rawCards.filter(card => card.type === "portrait");
        const quoteCards = rawCards.filter(card => card.type === "quote");

        // Process portrait cards with even spacing along the center
        // Layer structure:
        // - Top layer: First 3 portrait cards (indices 0, 1, 2) - spaced apart to show quote cards behind
        // - Middle layer: Portrait card at index 3
        // - Bottom layer: Portrait card at index 4
        const processedPortraitCards = portraitCards.map((card, index) => {
            const totalPortraits = portraitCards.length;
            
            let x, y, rotation;
            
            // Special positioning for top 3 portrait cards to create gaps
            if (index < 3) {
                // Top layer: Space them apart with visible gaps between them
                // Position them with more spacing so quote cards behind are visible
                const topLayerSpread = 40; // Wider spread for top 3 cards
                const topLayerSpacing = topLayerSpread / 2; // Space between each (3 cards = 2 gaps)
                const baseX = (index * topLayerSpacing) - (topLayerSpread / 2);
                
                // Less jitter for top layer to maintain gaps
                const xJitter = (Math.random() - 0.5) * 2; // Reduced jitter: +/- 1 unit
                x = baseX + xJitter;
                
                // Slight vertical variation
                const yVariation = (Math.random() - 0.5) * 8; // +/- 4 units
                y = 4 + yVariation;
                
                // Moderate rotation
                rotation = (Math.random() - 0.5) * 12; // +/- 6 degrees
            } else {
                // Regular spacing for remaining portrait cards
                const spreadWidth = 30;
                const spacing = spreadWidth / (totalPortraits - 1);
                const baseX = index * spacing - (spreadWidth / 2);
                
                // Add horizontal jitter for less organized feel
                const xJitter = (Math.random() - 0.5) * 4; // +/- 2 units
                x = baseX + xJitter;
                
                // Position lower with more vertical variation for organic feel
                const yVariation = (Math.random() - 0.5) * 12; // +/- 6 units
                y = 4 + yVariation;
                
                // Add more rotation variation for natural look
                rotation = (Math.random() - 0.5) * 18; // +/- 9 degrees
            }

            // Assign z-index based on layer
            let zIndex;
            if (index < 3) {
                // Top layer: First 3 portrait cards (highest z-index)
                zIndex = 20 + index;
            } else if (index === 3) {
                // Middle layer: 4th portrait card
                zIndex = 10;
            } else {
                // Bottom layer: 5th portrait card (lowest z-index)
                zIndex = 3;
            }

            return {
                ...card,
                rotation,
                x,
                y,
                zIndex,
            } as CardData;
        });

        const processedQuoteCards = quoteCards.map((card, index) => {
            // Special positioning for quote card between portrait cards (id: 9)
            if (card.id === 9) {
                // Calculate position between first two portrait cards (indices 0 and 1)
                const totalPortraits = portraitCards.length;
                const spreadWidth = 30;
                const spacing = spreadWidth / (totalPortraits - 1);
                
                // Base positions of first two portrait cards (without jitter)
                const portrait0BaseX = 0 * spacing - (spreadWidth / 2); // -15
                const portrait1BaseX = 1 * spacing - (spreadWidth / 2); // -7.5
                
                // Position quote card between them, with slight offset for overlap
                const betweenX = (portrait0BaseX + portrait1BaseX) / 2 + (Math.random() - 0.5) * 2;
                
                // Middle layer: z-index 11 (between top layer 20+ and bottom layer 1-5)
                return {
                    ...card,
                    rotation: (Math.random() - 0.5) * 12, // Slight rotation for natural look
                    x: betweenX,
                    y: 4 + (Math.random() - 0.5) * 6, // Similar vertical position to portrait cards
                    zIndex: 11, // Middle layer
                } as CardData;
            }
            
            // Special positioning for quote card between portrait cards (id: 10)
            if (card.id === 10) {
                // Calculate position between third and fourth portrait cards (indices 2 and 3)
                // These are Product Designer (index 2) and Data Scientist (index 3)
                const totalPortraits = portraitCards.length;
                const spreadWidth = 30;
                const spacing = spreadWidth / (totalPortraits - 1);
                
                // Base positions of third and fourth portrait cards (without jitter)
                const portrait2BaseX = 2 * spacing - (spreadWidth / 2); // 0
                const portrait3BaseX = 3 * spacing - (spreadWidth / 2); // 7.5
                
                // Position quote card between them, with slight offset for overlap
                const betweenX = (portrait2BaseX + portrait3BaseX) / 2 + (Math.random() - 0.5) * 2;
                
                // Middle layer: z-index 12 (between top layer 20+ and bottom layer 1-5)
                return {
                    ...card,
                    rotation: (Math.random() - 0.5) * 12, // Slight rotation for natural look
                    x: betweenX,
                    y: 4 + (Math.random() - 0.5) * 6, // Similar vertical position to portrait cards
                    zIndex: 12, // Middle layer
                } as CardData;
            }
            
            // Regular quote cards positioned randomly - Bottom layer
            const pos = generateRandomPos();
            return {
                ...card,
                rotation: pos.rotation,
                x: pos.x,
                y: pos.y,
                zIndex: index + 1, // Bottom layer (lowest z-index)
            } as CardData;
        });

        // Portrait cards first, then quote cards
        const processedCards = [...processedPortraitCards, ...processedQuoteCards];

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCards(processedCards);
    }, [mounted]);

    const handleCardSwipe = useCallback((_direction: 'left' | 'right') => {
        // Move to next card (stop at the last card)
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        }
    }, [currentCardIndex, cards.length]);

    // Track the stacking order of dragged cards for persistent z-index on desktop
    // Cards are stored in order they were dragged (oldest first, newest last)
    const [cardStackOrder, setCardStackOrder] = useState<number[]>([]);

    const handleCardDragStart = useCallback((cardId: number) => {
        setCardStackOrder(prev => {
            // Remove the card if it's already in the stack, then add it to the end (top)
            const filtered = prev.filter(id => id !== cardId);
            return [...filtered, cardId];
        });
    }, []);

    // Calculate z-index for a card based on its position in the stack order
    const getCardZIndex = useCallback((card: CardData) => {
        const stackPosition = cardStackOrder.indexOf(card.id);
        if (stackPosition === -1) {
            // Card hasn't been dragged yet, use original z-index
            return card.zIndex;
        }
        // Base z-index for dragged cards starts above the highest original z-index
        // Position in stack determines relative order among dragged cards
        const baseZIndex = cards.length + 10;
        return baseZIndex + stackPosition;
    }, [cardStackOrder, cards.length]);

    if (!mounted) return null;

    return (
        <CardSection
            className="bg-ground-brown/2"
            paddingX="none"
            paddingY="none"
            backgroundPattern="/patterns/rounded-plus-connected.svg"
            patternMask="to-bottom"
            patternOpacity={0.03}
        >
            <div className="flex flex-col w-full h-full min-h-[90vh]">
                {/* Div 1: Heading and Subtitle Section */}
                <div className="text-center max-w-3xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-8">
                    <h2 className="font-heading text-text-main mb-6">
                        A better crowd, <span className="font-zin-italic"> <br /> by design</span>
                    </h2>
                    <p className="text-subtitle  max-w-2xl mx-auto">
                        At Flent, you end up living with people whose lifestyle and expectations naturally align with yours
                    </p>
                </div>

                {/* Div 2: Draggable Cards Wrapper - fills remaining space */}
                <div className="relative flex-1 w-full min-h-[60vh]">
                    {/* Absolutely positioned message behind cards */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 bg-transparent border-none p-8 rounded-xl max-w-md pointer-events-none">
                        <p className="text-center text-2xl font-heading text-text-main md:text-4xl">
                            Live with flatmates who&apos;re fun, ambitious & inspiring
                        </p>
                    </div>

                    {/* Mobile: Tinder-style stacked cards */}
                    {isMobile && cards.length > 0 && (
                        <div className="absolute inset-x-4 inset-y-8 z-10 flex items-center justify-center">
                            {cards.slice(currentCardIndex, currentCardIndex + 3).map((card, index) => (
                                <motion.div
                                    key={card.id}
                                    className="absolute w-72 h-80"
                                    initial={false}
                                    animate={{
                                        scale: 1 - index * 0.05,
                                        y: index * 8,
                                        x: index === 0 ? 0 : index === 1 ? 10 : -10, // Center, right, left
                                        rotate: index === 0 ? card.rotation * 0.3 : card.rotation * 0.3 + (index * 5), // Subtle additional rotation for depth
                                        zIndex: 3 - index, // Updated for 3 cards
                                    }}
                                    transition={{
                                        type: "tween",
                                        duration: 0.25,
                                        ease: [0.25, 0.1, 0.25, 1] as const,
                                    }}
                                    style={{
                                        pointerEvents: index === 0 ? 'auto' : 'none',
                                    }}
                                >
                                    <DraggableCardBody
                                        className="w-full h-full shadow-xl p-0"
                                        enableSwipeAway={index === 0}
                                        onSwipeAway={handleCardSwipe}
                                    >
                                        {card.type === "quote" ? (
                                            <QuoteCard data={card as QuoteCardData} />
                                        ) : (
                                            <PortraitCard data={card as PortraitCardData} />
                                        )}
                                    </DraggableCardBody>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Desktop: Multi-card layout */}
                    {!isMobile && (
                        <DraggableCardContainer className="absolute inset-x-10 inset-y-8 z-10">
                            {cards.map((card) => (
                                <DraggableCardBody
                                    key={card.id}
                                    className="absolute pointer-events-auto w-80 h-96 shadow-xl p-0"
                                    style={{
                                        left: `calc(50% + ${card.x * 1.2}vw)`,
                                        top: `calc(50% + ${card.y * 1.2}vh)`,
                                        x: "-50%",
                                        y: "-50%",
                                        rotate: `${card.rotation}deg`,
                                        zIndex: getCardZIndex(card),
                                    }}
                                    onDragStartCallback={() => handleCardDragStart(card.id)}
                                >
                                    {card.type === "quote" ? (
                                        <QuoteCard data={card as QuoteCardData} />
                                    ) : (
                                        <PortraitCard data={card as PortraitCardData} />
                                    )}
                                </DraggableCardBody>
                            ))}
                        </DraggableCardContainer>
                    )}
                </div>
            </div>
        </CardSection>
    );
};
