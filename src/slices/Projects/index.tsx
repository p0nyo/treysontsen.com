"use client";

import { Content, KeyTextField, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Heading from "@/app/components/Heading";
import Bounded from "@/app/components/Bounded";
import { useEffect, useRef, Fragment } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

/**
 * Props for `Projects`.
 */
export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

gsap.registerPlugin(ScrollTrigger);

/**
 * Component for "Projects" Slices.
 */
const Projects = ({ slice }: ProjectsProps): JSX.Element => {
  const component = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current, // Element to trigger the animation
          start: "top 72%",
          end: "bottom 100%",
          scrub: true, // Animation syncs with scrolling
          // markers: true,
        },
      });
      tl.from(".heading-scroll", {
        opacity: 0,
        x: -200,
        duration: 2,
      })
        .fromTo(
          ".project-scroll",
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 2,
            stagger: 0.5,
          }, "+=1.5"
        )
        .fromTo(
          ".line-scroll",
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 2,
            stagger: 0.5,
          },
          "-=3.0"
        );
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
      <div className="flex flex-col p-4 gap-y-3 my-10">
        {slice.primary.project_object.map((item, key) => (
          <Fragment key={key}>
            <div className="project-scroll flex items-center">
              <div className="text-stone-700 font-extrabold text-2xl -rotate-90 whitespace-nowrap">{item.date}</div>
              <ProjectCard
                title={item.title}
                description={item.description}
                tech={item.tech}
              />
            </div>
            {key < slice.primary.project_object.length - 1 && (
              <div className="line-scroll border-t-2 border-red-600 z-50"></div>
            )}
          </Fragment>
        ))}
      </div>
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
    <div className="bg-slate-200 mr-auto w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 rounded-s p-4">
      <div className="text-stone-800 font-bold text-3xl border-b">{title}</div>
      <div className="text-stone-600">
        <PrismicRichText field={description} />
        <div className="border-t border-gray-300 my-4"></div>
        <p className="text-stone-400">{tech}</p>
      </div>
    </div>
  );
};

export default Projects;
