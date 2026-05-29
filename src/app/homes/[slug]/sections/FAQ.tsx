"use client";

import React from "react";
import { useParams } from "next/navigation";
import { FAQSection, type FAQCategory } from "@/components/sections/FAQSection";
import { useSectionViewTracking } from "@/hooks/useSectionViewTracking";

const faqCategories: FAQCategory[] = [
        {
            value: "general",
            label: "General",
            color: "bg-pastel-pink",
            questions: [
                {
                    id: 1,
                    question: "What is the lock-in period?",
                    answer: "We offer three lock-in options — 6, 9, and 11 months.\n\nMoving out before your lock-in ends will lead to deposit forfeiture. Once the lock-in is complete, a 1-month notice is required before your planned move-out date."
                },
                {
                    id: 2,
                    question: "What's the overnight guest policy?",
                    answer: "Guests of any gender and relation are allowed for up to 15 days a month. Overnight stays are permitted within this limit, with prior intimation to your housemates."
                },
                {
                    id: 3,
                    question: "Can I choose my housemates?",
                    answer: "No, residents don't directly choose their housemates. We match based on compatibility and house rules.\n\nHowever, if you refer someone or book with friends, you can choose who you co-live with."
                },
                {
                    id: 4,
                    question: "What does my fully furnished home include?",
                    answer: "Beyond the furniture you see in the photos, your home is thoughtfully equipped with everything you need to move in comfortably:\n\nKitchen essentials\nA complete set of cookware, cutlery, pots, pans, and everyday kitchenware.\n\nAppliances\nMicrowave, grinder, and washing machine for daily convenience.\n\nLaundry and cleaning\nDrying rack, laundry basket, and essential cleaning tools.\n\nHome essentials\nPre installed Wi Fi router with extenders, water purifier, power backup, and extension cords."
                }
            ]
        },
        {
            value: "services",
            label: "Services",
            color: "bg-pastel-cyan",
            questions: [
                {
                    id: 5,
                    question: "What utilities are included in the rent?",
                    answer: "Rent is exclusive of utilities. All utilities – electricity, water, gas and Wi-Fi – are charged separately, billed on actuals and split equally among all flatmates."
                },
                {
                    id: 6,
                    question: "What is the water source in the home?",
                    answer: "Water source varies by home — it may be borewell, municipal supply, Kaveri or tanker.\n\nAcross all our homes, water availability is reliable."
                },
                {
                    id: 7,
                    question: "Do you provide gas cylinders or a pipeline connection?",
                    answer: "Most homes use LPG cylinders. If there are existing tenants, a cylinder setup is already in place. If the home is brand new or vacant, we share contacts of trusted LPG vendors so you can set up a safe, verified connection."
                },
                {
                    id: 8,
                    question: "Do you offer meals?",
                    answer: "No. We have fully equipped kitchens for self cooking. Housemates often hire a cook together, or share the cost of an existing one in the house."
                },
                {
                    id: 9,
                    question: "How often is the home professionally cleaned, and are regular cleaning services included or available at an additional cost?",
                    answer: "Before you move in, your room is professionally prepared for you. Regular cleaning services are not included. However, residents can book deep cleaning through us at an additional cost. We also offer complimentary deep cleans periodically as part of our home upkeep and refresh cycles."
                }
            ]
        },
        {
            value: "payments",
            label: "Payments",
            color: "bg-pastel-yellow",
            questions: [
                {
                    id: 10,
                    question: "Is there a security deposit?",
                    answer: "The security deposit is equivalent to two to three months of rent, depending on the home. It is collected at move-in and refunded within 30 days of move-out after adjusting for any applicable charges."
                },
                {
                    id: 11,
                    question: "When is the rent due each month and how can I pay it?",
                    answer: "Rent is due on the 5th of every month.\n\nYou can pay using UPI, credit card, debit card, or net banking."
                },
                {
                    id: 12,
                    question: "What happens if the rent is not paid on time?",
                    answer: "Rent paid after the 5th attracts a late fee of Rs 2000."
                },
                {
                    id: 13,
                    question: "Is society maintenance included in the rent?",
                    answer: "Yes. Society maintenance is included in the rent. The amount shown on the website is fully inclusive of GST, furnishings, convenience fees, and building maintenance. There are no hidden charges."
                },
                {
                    id: 14,
                    question: "Are there any move-in fees or move-out fees?",
                    answer: "Move-in fees vary by gated communities. Not all societies charge a move-in fee, and you will be informed in advance if it applies to your home.\n\nA move-out fee of Rs 10000 is charged and adjusted from your deposit. This covers general wear and tear during your stay."
                },
                {
                    id: 15,
                    question: "What upfront payments are required before I begin my stay?",
                    answer: "Before moving in, you will need to pay a non-refundable token amount that is adjusted against your deposit, the first month's rent, and the security deposit."
                }
            ]
        },
        {
            value: "amenities",
            label: "Amenities",
            color: "bg-pastel-green",
            questions: [
                {
                    id: 16,
                    question: "Is parking included with my booking?",
                    answer: "Parking availability varies by home. You will be informed of the options available for your specific home before booking."
                },
                {
                    id: 17,
                    question: "What amenities do I have access to?",
                    answer: "Homes in gated communities include access to all community amenities. This may include the gym, pool, clubhouse, sports courts, gardens, and other shared facilities."
                },
                {
                    id: 18,
                    question: "Is a laundry facility available?",
                    answer: "Yes. Every home includes a washing machine. Dryers are provided in homes that do not have adequate space for natural drying."
                }
            ]
        },
        {
            value: "rules",
            label: "House Rules",
            color: "bg-pastel-orange",
            questions: [
                {
                    id: 19,
                    question: "Are the homes pet friendly?",
                    answer: "Pet policies vary by home. In pet-friendly homes, prior approval is required, and an additional security deposit must be paid to ensure the home is protected against any potential damages."
                },
                {
                    id: 20,
                    question: "Is smoking allowed?",
                    answer: "Yes, smoking is allowed in outdoor areas. Smoking indoors is not permitted, and any damage caused by indoor smoking will be chargeable."
                },
                {
                    id: 21,
                    question: "Can I host parties in the home?",
                    answer: "Yes. Small gatherings are allowed with prior notice to your housemates."
                },
                {
                    id: 22,
                    question: "Am I allowed to personalise my room?",
                    answer: "Light decor, such as hanging pictures, adding a rug, or placing a lamp, is completely fine. Feel free to add small touches to make the room your own. Please avoid any structural changes or anything that may damage the walls, as this may result in deductions during move-out."
                }
            ]
        },
        {
            value: "maintenance",
            label: "Maintenance",
            color: "bg-pastel-violet",
            questions: [
                {
                    id: 23,
                    question: "Who handles routine repairs?",
                    answer: "Flent takes care of all structural issues and repairs related to normal use of the home. Repairs required due to misuse, damage, or tenant-caused issues are chargeable as per the Flent Tenant Service Coverage Policy."
                },
                {
                    id: 24,
                    question: "Is 24/7 support available?",
                    answer: "Yes. Resident support is available 24/7."
                },
                {
                    id: 25,
                    question: "How do I report an issue or raise a ticket?",
                    answer: "You can report issues through the Flentmate channel by raising a ticket. All requests are reviewed and resolved according to the Flent Tenant Service Coverage Policy.\n\nMaintenance tickets are typically resolved within 2 to 3 days depending on urgency."
                },
                {
                    id: 26,
                    question: "What happens if I damage something or notice something damaged when I move in?",
                    answer: "If an item is damaged because of misuse or careless handling, the repair cost will be charged to the tenant. Any fault or missing item found at move-in is fully covered when reported within 15 days from the move-in day."
                }
            ]
        },
        {
            value: "agreement",
            label: "Agreement",
            color: "bg-pastel-blue",
            questions: [
                {
                    id: 27,
                    question: "Can HRA be claimed?",
                    answer: "Yes. Your agreement is valid for HRA. The base rent is clearly separated for tax purposes. Other components cannot be claimed for tax benefits."
                },
                {
                    id: 28,
                    question: "What is the rent increment if I renew my contract?",
                    answer: "Rent typically increases by 5 to 8 percent annually, depending on the home and market conditions. The exact terms will be shared and mutually agreed upon at the time of renewal."
                },
                {
                    id: 29,
                    question: "If I move to another Flent home, will my tenure carry forward or do I need a new agreement?",
                    answer: "A fresh agreement is required. Lock-in and tenure do not carry forward. Agreements are room-specific, and the landlord is also a party to each contract."
                }
            ]
        }
];

export const FAQ = () => {
    const params = useParams();
    const propertySlug = params?.slug as string | undefined;

    // Track section visibility
    const sectionRef = useSectionViewTracking({
        sectionId: 'faq',
        sectionName: 'FAQ',
        additionalProperties: {
            property_slug: propertySlug,
            faq_category_count: faqCategories.length,
        },
    });

    return (
        <FAQSection
            ref={sectionRef}
            id="faq"
            title={
                <>
                    You got questions? <br className="hidden md:block" />
                    <span className="font-zin-italic">
                        <br className="md:hidden" />
                        We got answers.
                    </span>
                </>
            }
            description="Everything you need to know about living with Flent."
            categories={faqCategories}
            defaultTab="general"
            inactiveTabBorder="border-black/1"
            faqLocation="property_page"
            propertySlug={propertySlug}
        />
    );
};
