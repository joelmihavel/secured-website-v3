"use client";

import { useEffect } from "react";

export function ScrollRestoration() {
    useEffect(() => {
        // Disable browser scroll restoration to prevent auto-scroll on page reload
        if (typeof window !== "undefined" && window.history.scrollRestoration) {
            window.history.scrollRestoration = "manual";
        }

        // If the URL has a hash, the browser's native anchor scroll has already
        // landed on the target — preserve it (and re-apply once after layout
        // settles in case anything else, like Preloader / Lenis, races with us).
        // Without this guard a deep link like /secured#rent-map would always
        // bounce the user back to the top of the page on mount.
        const { hash } = window.location;
        if (hash) {
            const scrollToHash = () => {
                try {
                    const el = document.querySelector(hash);
                    if (el) {
                        el.scrollIntoView({ behavior: "auto", block: "start" });
                    }
                } catch {
                    // hash may not be a valid selector — ignore
                }
            };
            const t1 = window.setTimeout(scrollToHash, 0);
            const t2 = window.setTimeout(scrollToHash, 200);
            return () => {
                window.clearTimeout(t1);
                window.clearTimeout(t2);
            };
        }

        // Otherwise, scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return null;
}
