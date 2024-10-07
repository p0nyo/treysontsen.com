"use client";

import { useEffect, useRef } from "react";
import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import gsap from "gsap";
import Bounded from "@/app/components/Bounded";
import { Shapes } from "@/slices/Hero/Shapes";
import DownwardArrow from "@/slices/Hero/DownwardArrow";
import { ScrollTrigger } from "gsap/all";
/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

gsap.registerPlugin(ScrollTrigger);
/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const component = useRef(null);
  const arrowRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".name-animation",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 3,
          ease: "circ.out",
          stagger: {
            each: 0.1,
            from: "random",
          },
        }
      ).fromTo(
        ".job-title",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.5,
          ease: "circ.out",
        },
        "-=3"
      );
    }, component);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: arrowRef.current,
        start: "bottom 80%", // Starts when the top of the arrow hits the top of the viewport
        end: "bottom 75%", // Continue for 50 pixels
        onLeave: () => gsap.to(arrowRef.current, { opacity: 0 }), // Fade out on leave
        onEnterBack: () => gsap.to(arrowRef.current, { opacity: 1 }), // Fade back in when entering back
        // markers: true,
      },
    });
    return () => {
      tl.kill();
    };
  }, []);

  const renderLetters = (name: KeyTextField, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span
        key={index}
        className={`name-animation name-animation-${key} inline-block opacity-0`}
      >
        {letter}
      </span>
    ));
  };

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center">
        <Shapes />
        <div className="col-start-1 md:row-start-1">
          <h1
            className="mb-8 text-[clamp(3rem,20vmin,20rem)] font-extrabold leading-none 
          tracking-tighter"
            aria-label={
              slice.primary.first_name + " " + slice.primary.last_name
            }
          >
            <span className="select-none block text-stone-800 whitespace-nowrap">
              {renderLetters(slice.primary.first_name, "first")}
            </span>
            <span className="select-none -mt-[.2em] block text-stone-500 whitespace-nowrap">
              {renderLetters(slice.primary.last_name, "last")}
            </span>
          </h1>
          <span
            className="select-none job-title block bg-gradient-to-tr from-red-700 via-red-500 to-red-700
            bg-clip-text text-2xl font-extrabold uppercase tracking-[.2em] text-transparent
            opacity-0 md:text-4xl"
          >
            {slice.primary.tag_line}
          </span>
        </div>
      </div>
      <div ref={arrowRef} className="flex items-center justify-center">
          <DownwardArrow />
        </div>
    </Bounded>
  );
};

export default Hero;
