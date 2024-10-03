import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import clsx from "clsx";
import { PrismicNextImage } from "@prismicio/next";

/**
 * Props for `Biography`.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * Component for "Biography" Slices.
 */
const Biography = ({ slice }: BiographyProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading className="col-start-1">{slice.primary.title}</Heading>
        <div className="prose prose-xl prose-slate prose-invert col-start-1">
          <PrismicRichText field={slice.primary.description} />
        </div>
        <div
          className={clsx("relative h-full w-full", "row-start-1 max-w-sm md:col-start-2 md:row-end-3")}
        >
          <div
            className="avatar aspect-square overflow-hidden rounded-3xl border-2 border-slate-700 opacity-0"
            style={{ perspective: "500px", perspectiveOrigin: "150% 150%" }}
          >
            <PrismicNextImage
              field={slice.primary.image}
              alt=""
              className="avatar-image h-full w-full object-fill"
              imgixParams={{ q: 90 }}
            />
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Biography;
