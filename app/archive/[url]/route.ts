import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
  const url = params.url;
  const data = await fetch(decodeURIComponent(url));
  const json = await data.json();
  return NextResponse.json(json);
}
