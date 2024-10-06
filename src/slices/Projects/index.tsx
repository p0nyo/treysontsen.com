"use client";

import { Content, KeyTextField, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Heading from "@/app/components/Heading";
import Bounded from "@/app/components/Bounded";
import { Key, useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Props for `Projects`.
 */
export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

/**
 * Component for "Projects" Slices.
 */
const Projects = ({ slice }: ProjectsProps): JSX.Element => {
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
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="h-screen"
      ref={component}
    >
      <Heading className="heading-scroll">{slice.primary.title}</Heading>
      {slice.primary.project_object.map((item) => (
        <ProjectCard
        title={item.title}
        description={item.description}
        tech={item.tech}
      />
      ))}
    </Bounded>
  );
};

type ProjectCardProps = {
  title: KeyTextField;
  description: RichTextField;
  tech: KeyTextField;
};

const ProjectCard = ({ title, description, tech }: ProjectCardProps) => {
  return (
    <div className="event-card transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 shadow-md rounded-s p-4">
      <div className="text-stone-800 font-bold text-xl border-b">{title}</div>
      <div className="text-stone-600">
        <PrismicRichText field={description} />
        <div className="border-t border-gray-300 my-4"></div>
        <p className="text-stone-400">{tech}</p>
      </div>
    </div>
  );
};


export default Projects;
