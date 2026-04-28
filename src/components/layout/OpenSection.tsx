import React from "react";
import { cn } from "@/lib/utils";

interface OpenSectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export const OpenSection = ({ children, className, id, style, ...props }: OpenSectionProps) => {
    return (
        <section
            className={cn("relative w-full max-w-full mx-auto overflow-hidden", className)}
            id={id}
            style={style}
            {...props}
        >
            {children}
        </section>
    );
};
