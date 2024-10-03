import { Content, KeyTextField, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { Fragment } from "react";
import { RichTextFunctionSerializer } from "@prismicio/client/richtext";
import { PI } from "three/webgpu";
/**
 * Props for `Timeline`.
 */
export type TimelineProps = SliceComponentProps<Content.TimelineSlice>;

/**
 * Component for "Timeline" Slices.
 */
const Timeline = ({ slice }: TimelineProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading>{slice.primary.title}</Heading>
      <div className="flex flex-col gap-y-3 w-full my-4">
        <Circle />
        {slice.primary.timeline_object.map((item, key) => (
          <Fragment key={key}>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto">
              {item.direction === "left" ? (
                <EventCard heading={item.title} subHeading={item.description} />
              ) : (
                <div></div>
              )}

              <Pillar />

              {item.direction === "right" ? (
                <EventCard heading={item.title} subHeading={item.description} />
              ) : (
                <div></div>
              )}
            </div>
            {key < 9 && <Circle />}
          </Fragment>
        ))}

        <Circle />
      </div>
    </Bounded>
  );
};

const Circle = () => {
  return <div className="rounded-full w-4 h-4 bg-red-600 mx-auto"></div>;
};

const Pillar = () => {
  return (
    <div className="h-full rounded-t-full rounded-b-full w-2 bg-red-400 mx-auto"></div>
  );
};

type EventCardProps = {
  heading: KeyTextField;
  subHeading: RichTextField;
};

const EventCard = ({ heading, subHeading }: EventCardProps) => {
  return (
    <div className="border-b border-stone-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 border shadow-md rounded-xl p-4">
      <div className="text-stone-800 font-bold text-lg border-b">{heading}</div>
      <div className="text-stone-500">
        <PrismicRichText field={subHeading} />
      </div>
    </div>
  );
};

export default Timeline;
