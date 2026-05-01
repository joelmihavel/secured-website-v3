"use client";

import { useEffect } from "react";

export function ScrollRestoration() {
    useEffect(() => {
        // Disable browser scroll restoration to prevent auto-scroll on page reload
        if (typeof window !== "undefined" && window.history.scrollRestoration) {
            window.history.scrollRestoration = "manual";
        }

        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return null;
}
