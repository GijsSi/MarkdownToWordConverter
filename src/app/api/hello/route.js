import {NextResponse} from 'next/server';

// Handles GET requests to /api
export async function GET() {
  // ...
  return NextResponse.json({message: 'Hello World'});
}

// Handles POST requests to /api
export async function POST() {
  // ...
  return NextResponse.json({message: 'Hello World'});
}