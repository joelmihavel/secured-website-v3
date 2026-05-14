"use client";

import React from "react";
import { Review } from "@/lib/webflow";
import { FlexibleCarousel } from "@/components/ui/flexible-carousel";
import { IconQuote as Quote, IconStar as Star } from "@tabler/icons-react";
import { AsSeenIn } from "@/components/layout/AsSeenIn";
import { motion } from "framer-motion";
import Image from "next/image";
import testimonialsData from "@/data/testimonials-data.json";

interface RatingProps {
    reviews: Review[];
}

export const Rating = ({ reviews }: RatingProps) => {
    return (
        <section id="reviews" className="pt-24 pb-12 bg-bg-white overflow-hidden">
            {/* Header */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <div className="flex flex-col items-center justify-center mb-6">


                    <div className="flex items-center gap-4 pb-4">

                        <motion.div
                            className="flex items-center gap-1"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                duration: 0.6,
                                ease: [0.34, 1.56, 0.64, 1] as const,
                                staggerChildren: 0.1
                            }}
                        >
                            {/* Full stars (4 stars) */}
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <motion.div
                                    key={star}
                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: [0.34, 1.56, 0.64, 1] as const
                                    }}
                                >
                                    <Star
                                        className="w-7 h-7 fill-[#FFD700] text-[#FFD700]"
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                            ))}
                            {/* Partial star (50% filled)
                            <motion.div
                                className="relative w-7 h-7"
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.4,
                                    ease: [0.34, 1.56, 0.64, 1] as const
                                }}
                            >
                                <Star
                                    className="w-7 h-7 text-[#FFD700] absolute inset-0"
                                    strokeWidth={1.5}
                                    fill="none"
                                />
                                <div className="absolute inset-0 overflow-hidden" style={{ width: '60%' }}>
                                    <Star
                                        className="w-7 h-7 fill-[#FFD700] text-[#FFD700]"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </motion.div> */}
                        </motion.div>

                    </div>
                    <h2 className="font-heading text-text-main ">
                        People love <br /><span className="font-zin-italic">Flent-ing</span>
                    </h2>


                </div>
            </div>

            {/* Carousel */}
            <div className="mb-24">
                <FlexibleCarousel
                    cards={reviews.map((review, index) => {
                        const testimonialImage = testimonialsData.length > 0 ? testimonialsData[index % testimonialsData.length] : null;

                        return (
                            <div key={review.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between w-full">
                                <div>
                                    <Quote className="w-8 h-8 text-text-main mb-6 fill-current" />
                                    <p className="text-gray-600 leading-relaxed mb-8">
                                        {review.fieldData.message}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {testimonialImage?.downloaded && (
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                            <Image
                                                src={testimonialImage.image}
                                                alt={review.fieldData.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-zin text-xl text-text-main mb-1">
                                            {review.fieldData.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {review.fieldData.profession}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    // highlightMiddle={true}
                    cardSize="md"
                />
            </div>

            {/* Footer / As Seen In */}
            <AsSeenIn />
        </section>
    );
};
