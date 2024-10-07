"use client";

import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import ResumeButton from "@/slices/Biography/ResumeButton";
import { PrismicNextImage } from "@prismicio/next";
import { ScrollTrigger } from "gsap/all";
import { gsap } from "gsap";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

gsap.registerPlugin(ScrollTrigger);
/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current, // Element to trigger the animation
          start: "top 82%", // Start when the top of the element reaches the center of the viewport
          end: "bottom 100%", // End when the bottom of the element reaches the center
          scrub: true, // Animation syncs with scrolling
          // markers: true,
        },
      });

      tl.fromTo(
        ".heading-scroll",
        {
          opacity: 0, // Starting state
          x: -200,
        },
        {
          opacity: 1, // Ending state
          x: 0, // Move to original position
          duration: 2,
        }
      )
        .fromTo(
          ".description-scroll",
          {
            opacity: 0, // Starting state
            y: 300,
          },
          {
            opacity: 1, // Ending state
            y: 0, // Move to original position
            duration: 2,
          },
          "-=1.0"
        )
        .fromTo(
          ".image-scroll",
          {
            opacity: 0, // Starting state
            y: 200,
          },
          {
            opacity: 1, // Ending state
            y: 0, // Move to original position
            duration: 2,
          }, "-=2.0"
        );
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading className="opacity-0 heading-scroll col-start-1">
          {slice.primary.title}
        </Heading>
        <div className="opacity-0 description-scroll text-stone-500 prose prose-xl prose-invert col-start-1">
          <PrismicRichText field={slice.primary.description} />
          <ResumeButton />
        </div>
        <div>
          <PrismicNextImage
            field={slice.primary.image}
            className="rounded-lg opacity-0 image-scroll row-start-1 max-w-sm md:col-start-2 md:row-end-3"
            alt=""
          />
        </div>
      </div>
    </Bounded>
  );
};

export default Biography;
