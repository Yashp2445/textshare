import { NextResponse } from 'next/server';
import { instagramGetUrl } from 'instagram-url-direct';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    // Basic heuristic: if it looks like a URL, treat as URL, otherwise username
    const isUrl = input.includes('instagram.com') || input.startsWith('http');

    if (isUrl) {
      try {
        const result = await instagramGetUrl(input);
        
        // instagramGetUrl typically returns { url_list: [...], ... }
        if (!result || !result.url_list || result.url_list.length === 0) {
           return NextResponse.json({ error: 'Could not extract media from this link. It might be private or Instagram is blocking the request.' }, { status: 400 });
        }
        
        return NextResponse.json({
          type: 'media',
          results: result.url_list,
        });

      } catch (err: any) {
        console.error('Instagram URL Error:', err);
        return NextResponse.json({ 
          error: 'Failed to retrieve media. The account might be private, or Instagram is temporarily blocking scraping requests.',
          details: err.message 
        }, { status: 500 });
      }
    } else {
      // Treat as username
      try {
        const username = input.trim().replace(/^@/, '');
        const profileUrl = `https://www.instagram.com/${username}/`;
        
        const response = await axios.get(profileUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          }
        });

        const $ = cheerio.load(response.data);
        const ogImage = $('meta[property="og:image"]').attr('content');
        
        if (!ogImage) {
          return NextResponse.json({ error: 'Could not find a public profile picture for this username.' }, { status: 404 });
        }

        return NextResponse.json({
          type: 'profile_pic',
          url: ogImage,
          username
        });
      } catch (err: any) {
        console.error('Instagram Profile Error:', err);
        return NextResponse.json({ 
          error: 'Failed to retrieve profile. The account might not exist or Instagram is blocking requests.',
          details: err.message
        }, { status: 500 });
      }
    }

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
