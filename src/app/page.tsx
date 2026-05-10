import { Metadata } from "next";

import { createClient } from "@/prismicio";

export default async function Page() {

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center">
      <h1 className="text-white text-7xl font-bold">
        treyson tsen
      </h1>
      <h1 className="text-white italic text-2xl">
        overhaul in progress =)
      </h1>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}