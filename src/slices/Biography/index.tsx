"use client";

import { useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import clsx from "clsx";
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
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current, // Element to trigger the animation
          start: "top 72%", // Start when the top of the element reaches the center of the viewport
          end: "bottom 100%", // End when the bottom of the element reaches the center
          scrub: true, // Animation syncs with scrolling
          // markers: true,
        },
      });

      tl.from(".heading-scroll", {
        opacity: 0,
        x: -200,
        duration: 2,
      })
        .from(
          ".description-scroll",
          {
            opacity: 0,
            x: -300,
            duration: 2,
          },
          "-=1.5"
        )
        .from(
          ".image-scroll",
          {
            opacity: 0,
            x: 200,
            duration: 2,
          },
          "-=1.5"
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
        <Heading className="heading-scroll col-start-1">
          {slice.primary.title}
        </Heading>
        <div className="description-scroll text-stone-500 prose prose-xl prose-invert col-start-1">
          <PrismicRichText field={slice.primary.description} />
        </div>
        <PrismicNextImage
          field={slice.primary.image}
          className="image-scroll row-start-1 max-w-sm md:col-start-2 md:row-end-3"
        />
      </div>
    </Bounded>
  );
};

export default Biography;
