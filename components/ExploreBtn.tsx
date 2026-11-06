"use client";

import Image from "next/image";
import posthog from "posthog-js";
import { posthogLogger } from "@/lib/posthog-logger";

const ExploreBtn = () => {
  const handleExplore = () => {
    posthog.capture("event_catalog_explored");
    posthogLogger.info("Event catalogue exploration requested", {
      interaction: "explore_events",
    });
    console.log('ExploreBtn clicked!');
  };

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleExplore}>
        <a href="#events">
            Explore Events
            <Image src="/icons/arrow-down.svg" alt="Arrow Down" width={24} height={24} />
            
        </a>
    </button>
  )
}

export default ExploreBtn
