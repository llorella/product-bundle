import { NextRequest, NextResponse } from 'next/server';
import { getMatrixConfigSync, setMatrixConfig } from '@/lib/matrix/config';
import { MatrixConfig } from '@/lib/types/matrix';

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

/**
 * POST /api/matrix
 * Updates the matrix configuration
 * Body: MatrixConfig object
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.version || !body.primaryMatrix || !body.secondaryPreferences) {
      return NextResponse.json(
        { error: 'Invalid matrix config: missing required fields' },
        { status: 400 }
      );
    }

    // Validate structure
    const personas = ['founder', 'builder', 'writer', 'designer', 'curious'];
    const goals = ['productive', 'automate', 'write', 'trends'];

    for (const persona of personas) {
      if (!body.primaryMatrix[persona]) {
        return NextResponse.json(
          { error: `Missing persona: ${persona}` },
          { status: 400 }
        );
      }
      for (const goal of goals) {
        const cell = body.primaryMatrix[persona][goal];
        if (!cell || !cell.app) {
          return NextResponse.json(
            { error: `Missing or invalid cell: ${persona}/${goal}` },
            { status: 400 }
          );
        }
      }
    }

    // Update the config
    const newConfig: MatrixConfig = {
      version: body.version,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: body.source || 'api',
      heuristic: body.heuristic,
      primaryMatrix: body.primaryMatrix,
      secondaryPreferences: body.secondaryPreferences,
      featureOverrides: body.featureOverrides || [],
    };

    setMatrixConfig(newConfig);

    return NextResponse.json({
      success: true,
      message: 'Matrix configuration updated',
      config: newConfig,
    });
  } catch (error) {
    console.error('Error updating matrix config:', error);
    return NextResponse.json(
      { error: 'Failed to update matrix configuration' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/matrix
 * Resets to default matrix configuration
 */
export async function DELETE() {
  try {
    // Import and set default config
    const defaultMatrix = await import('@/config/matrix.default.json');
    setMatrixConfig(defaultMatrix.default as MatrixConfig);

    return NextResponse.json({
      success: true,
      message: 'Matrix configuration reset to default',
    });
  } catch (error) {
    console.error('Error resetting matrix config:', error);
    return NextResponse.json(
      { error: 'Failed to reset matrix configuration' },
      { status: 500 }
    );
  }
}
