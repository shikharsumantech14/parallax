/**
 * Per-topic source packs for the reactive news pipeline. FREE + commercial-clean
 * only (GDELT DOC 2.0 = no key, commercial-OK; Google News search RSS = no key).
 * Excluded by design (cost/ToS): X, Reddit, GNews, NewsAPI.org. See the plan §7.
 *
 * GDELT DOC 2.0: https://api.gdeltproject.org/api/v2/doc/doc?query=<q>&mode=ArtList&format=json&timespan=2d
 * Google News search RSS: https://news.google.com/rss/search?q=<q>&hl=en-IN&gl=IN&ceid=IN:en
 */
import type { Topic } from '../lib/social.js';

export interface TopicSources {
  gdeltQuery: string; // GDELT DOC 2.0 query (keywords/phrases; english)
  googleNewsQuery: string; // Google News search RSS q=
  rssFeeds: { name: string; url: string }[]; // official/curated feeds (Atom/RSS)
  keywords: string[]; // cheap pre-filter: ≥1 must appear in title+snippet (lowercased)
}

const G = (q: string) => `${q} sourcelang:english`;

export const SOURCES: Record<Topic, TopicSources> = {
  politics: {
    gdeltQuery: G('("Lok Sabha" OR "Rajya Sabha" OR "Supreme Court of India" OR "Election Commission" OR "Indian parliament")'),
    googleNewsQuery: 'India parliament OR "Supreme Court" OR election OR legislation',
    rssFeeds: [
      { name: 'PRS India', url: 'https://prsindia.org/rss.xml' },
      { name: 'The Hindu — National', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
    ],
    keywords: ['parliament', 'lok sabha', 'rajya sabha', 'court', 'bill', 'election', 'verdict', 'amendment', 'commission'],
  },
  space: {
    gdeltQuery: G('(NASA OR ESA OR ISRO OR asteroid OR satellite OR "space mission" OR rocket OR orbit)'),
    googleNewsQuery: 'NASA OR ISRO OR ESA OR asteroid OR satellite OR "space mission"',
    rssFeeds: [
      { name: 'NASA Breaking News', url: 'https://www.nasa.gov/news-release/feed/' },
      { name: 'arXiv astro-ph', url: 'http://export.arxiv.org/rss/astro-ph' },
    ],
    keywords: ['nasa', 'isro', 'esa', 'asteroid', 'satellite', 'orbit', 'rocket', 'launch', 'mission', 'spacecraft', 'telescope'],
  },
  earth: {
    gdeltQuery: G('(climate OR "global warming" OR emissions OR IPCC OR glacier OR "sea level" OR drought OR wildfire)'),
    googleNewsQuery: 'climate OR IPCC OR emissions OR "sea level" OR glacier OR drought',
    rssFeeds: [
      { name: 'Carbon Brief', url: 'https://www.carbonbrief.org/feed/' },
      { name: 'NOAA Climate', url: 'https://www.climate.gov/feeds/news-features/understanding-climate.rss' },
    ],
    keywords: ['climate', 'emissions', 'warming', 'ipcc', 'glacier', 'sea level', 'drought', 'wildfire', 'carbon', 'temperature'],
  },
  tech: {
    gdeltQuery: G('("artificial intelligence" OR "machine learning" OR "large language model" OR chip OR semiconductor OR "data center")'),
    googleNewsQuery: '"artificial intelligence" OR "AI model" OR semiconductor OR "data center"',
    rssFeeds: [
      { name: 'arXiv cs.AI', url: 'http://export.arxiv.org/rss/cs.AI' },
      { name: 'Hacker News (front)', url: 'https://hnrss.org/frontpage' },
    ],
    keywords: ['ai', 'artificial intelligence', 'model', 'llm', 'chip', 'semiconductor', 'gpu', 'data center', 'training', 'compute', 'benchmark'],
  },
  travel: {
    gdeltQuery: G('(tourism OR airline OR aviation OR "air travel" OR overtourism OR visa OR passenger)'),
    googleNewsQuery: 'tourism OR airline OR aviation OR overtourism OR "air travel"',
    rssFeeds: [
      { name: 'Skift', url: 'https://skift.com/feed/' },
    ],
    keywords: ['tourism', 'airline', 'aviation', 'flight', 'passenger', 'visa', 'overtourism', 'airport', 'travel', 'hotel'],
  },
  sports: {
    gdeltQuery: G('("Premier League" OR "Champions League" OR cricket OR "transfer window" OR "set-piece" OR xG OR football)'),
    googleNewsQuery: '"Premier League" OR cricket OR "Champions League" OR "transfer window"',
    rssFeeds: [
      { name: 'Guardian Football', url: 'https://www.theguardian.com/football/rss' },
    ],
    keywords: ['football', 'premier league', 'champions league', 'cricket', 'transfer', 'goal', 'match', 'xg', 'set-piece', 'striker', 'league'],
  },
};
