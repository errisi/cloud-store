import { Users } from "@/app/models/user.model";
import { NextResponse } from "next/server";
import { connectToDb } from "../db_connection";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const number = searchParams.get("number");

  return NextResponse.json({ message: [number, query] });
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ data });
}
