"use client";

import { Content, KeyTextField, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { useEffect, useRef, Fragment } from "react";
import { RichTextFunctionSerializer } from "@prismicio/client/richtext";
import { PI } from "three/webgpu";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

gsap.registerPlugin(ScrollTrigger);
/**
 * Component for "Timeline" Slices.
 */
const Timeline = ({ slice }: TimelineProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current, // Element to trigger the animation
          start: "top 73%", // Start when the top of the element reaches the center of the viewport
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
          ".timeline-scroll",
          {
            opacity: 0,
            y: 100,
            duration: 2,
          },
          "-=1.5"
        )
        .fromTo(
          ".event-card",
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.7,
          },
          "-=1.5"
        )
        .fromTo(
          ".date-scroll",
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.7,
          }, "-=5.0"
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
      <Heading className="heading-scroll">{slice.primary.title}</Heading>
      <div className="timeline-scroll flex flex-col gap-y-3 w-full my-4">
        <Circle />
        {slice.primary.timeline_object.map((item, key) => (
          <Fragment key={key}>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-8 items-center mx-auto">
              {item.direction === "left" ? (
                <EventCard
                  heading={item.title}
                  description={item.description}
                  tech={item.tech}
                />
              ) : (
                <div className="date-scroll relative">
                  <p className="text-stone-700 font-bold text-5xl absolute right-0 top-1/2 transform -translate-y-1/2 text-center">
                    {item.dates}
                  </p>
                </div>
              )}

              <Pillar />

              {item.direction === "right" ? (
                <EventCard
                  heading={item.title}
                  description={item.description}
                  tech={item.tech}
                />
              ) : (
                <div className="date-scroll relative">
                  <p className="text-stone-700 font-bold text-5xl absolute left-0 top-1/2 transform -translate-y-1/2 text-center">
                    {item.dates}
                  </p>
                </div>
              )}
            </div>
            {key < 6 && <Circle />}
          </Fragment>
        ))}
        <Circle />
      </div>
    </Bounded>
  );
};

const Circle = () => {
  return <div className="rounded-sm w-3 h-3 bg-red-600 mx-auto"></div>;
};

const Pillar = () => {
  return <div className="h-full w-1 bg-red-400 mx-auto"></div>;
};

type EventCardProps = {
  heading: KeyTextField;
  description: RichTextField;
  tech: KeyTextField;
};

const EventCard = ({ heading, description, tech }: EventCardProps) => {
  return (
    <div className="event-card transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 shadow-md rounded-s p-4">
      <div className="text-stone-800 font-bold text-xl border-b">{heading}</div>
      <div className="text-stone-600">
        <PrismicRichText field={description} />
        <div className="border-t border-gray-300 my-4"></div>
        <p className="text-stone-400">{tech}</p>
      </div>
    </div>
  );
};

export default Timeline;
