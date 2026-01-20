import { NextResponse } from 'next/server';
import { getMatrixConfigSync } from '@/lib/matrix/config';

/**
 * GET /api/matrix
 * Returns the current matrix configuration
 */
export async function GET() {
  try {
    const config = getMatrixConfigSync();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching matrix config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matrix configuration' },
      { status: 500 }
    );
  }
}
