// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "isomorphic-unfetch";

const queryBuilder = (slug: string) =>
  encodeURIComponent(`union pageViews
| where timestamp > ago(7d)
| where url in ("/loja/${slug}")
| count;`);

const url = process.env.API_URL!;

type Data = {
  pageViewCustomStore: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY!,
  });
  try {
    const requestInit: RequestInit = {
      headers,
      method: "GET",
    };
    const response = await fetch(
      `${url}?timespan=P7D&query=${queryBuilder(
        req?.query?.slug?.toString()!
      )}`,
      requestInit
    );
    const data = await response.json();
    const pageViewCustomStore = data.tables?.[0]?.rows?.[0]?.[0] || 0;
    res.status(200).json({ pageViewCustomStore });
  } catch (error) {}
}
