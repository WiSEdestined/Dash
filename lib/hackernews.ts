// lib/hackernews.ts
import axios from 'axios';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  descendants?: number;
  time: number;
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url: string | null;
  author: string | null;
  score: number;
  comments: number;
  createdAt: string;
}

/**
 * Fetch top Hacker News story IDs, then details for each.
 */
export async function fetchHackerNewsStories(limit = 10): Promise<HackerNewsStory[]> {
  // 1) Get the IDs of top stories
  const topStoriesUrl = `${HN_API_BASE}/topstories.json`;
  const { data: storyIds } = await axios.get<number[]>(topStoriesUrl);

  // 2) Grab details for the first `limit` stories
  const stories: HackerNewsStory[] = [];
  for (let i = 0; i < Math.min(limit, storyIds.length); i++) {
    const storyId = storyIds[i];
    const itemUrl = `${HN_API_BASE}/item/${storyId}.json`;
    const { data: storyData } = await axios.get<HackerNewsItem | null>(itemUrl);

    // Some items might be null if they're deleted/invalid
    if (storyData) {
      stories.push({
        id: storyData.id,
        title: storyData.title,
        url: storyData.url || null,
        author: storyData.by || null,
        score: storyData.score || 0,
        comments: storyData.descendants || 0,
        createdAt: new Date(storyData.time * 1000).toISOString(),
      });
    }
  }
  return stories;
}

export interface TechNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
}

/**
 * Example of fetching a "Tech News" feed from an imaginary aggregator or RSS.
 * (Replace with your actual feed or curated list.)
 */
export async function fetchTechNewsFeed(): Promise<TechNewsItem[]> {
  const mockData: TechNewsItem[] = [
    {
      id: 'technews-1',
      title: 'New AI chip revolutionizes computing',
      url: 'https://example.com/ai-chip-news',
      source: 'TechCrunch',
      summary: 'A quick rundown on the latest AI hardware breakthrough.',
    },
    {
      id: 'technews-2',
      title: '5 Cloud trends to watch in 2025',
      url: 'https://example.com/cloud-trends',
      source: 'The Verge',
      summary: 'A deep dive into the future of cloud computing.',
    },
  ];

  // If you have a real endpoint:
  // const { data } = await axios.get('https://my-tech-news-feed.com/api/v1/items');
  // return data.items;

  return mockData;
}
