import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Email already in use' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
