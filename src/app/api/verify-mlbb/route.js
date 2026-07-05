import { NextResponse } from 'next/server';
import { checkIgn } from 'check-ign';

// Map our game titles to check-ign game names
const GAME_MAP = {
  'Mobile Legends': 'Mobile Legends',
  'Mobile Legends: Bang Bang': 'Mobile Legends',
  'Valorant': 'Valorant',
  'Genshin Impact': 'Genshin Impact',
  'Free Fire': 'Free Fire',
  'Honkai Star Rail': 'Honkai Star Rail',
  'Honkai Impact 3': 'Honkai Impact 3',
  'Call of Duty Mobile': 'Call of Duty Mobile',
  'Arena of Valor': 'Arena of Valor',
};

// Games that require a zone/server ID
const GAMES_REQUIRING_ZONE = ['Mobile Legends', 'Genshin Impact', 'Honkai Star Rail', 'Punishing Gray Raven'];

export async function POST(request) {
  try {
    const { userId, zoneId, gameTitle } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Determine the game name for check-ign
    const gameName = GAME_MAP[gameTitle];

    if (!gameName) {
      // Game not supported by check-ign, return a generic success
      return NextResponse.json({
        success: true,
        data: {
          name: `Player_${userId}`,
          region: 'Global',
          note: 'Game verification not available for this title.'
        }
      });
    }

    // Check if zone is required
    if (GAMES_REQUIRING_ZONE.includes(gameName) && !zoneId) {
      return NextResponse.json({ error: 'Zone/Server ID is required for this game' }, { status: 400 });
    }

    // Call the real Codashop API via check-ign
    const result = await checkIgn({
      game: gameName,
      id: userId,
      zone: zoneId || undefined,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          name: result.name,
          game: result.game,
          id: result.id,
          server: result.server,
          region: 'Indonesia'
        }
      });
    }

    return NextResponse.json({ error: 'Player not found. Please check your ID.' }, { status: 404 });
  } catch (error) {
    console.error('Verify error:', error.message);

    // Provide user-friendly error messages
    if (error.message?.includes('Cannot find nickname')) {
      return NextResponse.json({ error: 'Player not found. Please double-check your ID and Zone/Server.' }, { status: 404 });
    }
    if (error.message?.includes('Bad Request')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Verification service temporarily unavailable. Please try again.' }, { status: 500 });
  }
}
