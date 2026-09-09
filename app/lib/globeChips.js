/* The 18 source chips pinned around the globe, ported verbatim from
   Saga.html — including their aria-labels, which name the place each
   source sits on. Order matters: the renderer's ANC anchor table is
   indexed against it. */

export const GLOBE_CHIPS = [
  {
    "label": "Conversations from India",
    "svg": "<path d=\"M20.5 11.4a8 8 0 0 1-8.6 8 8.8 8.8 0 0 1-3.2-.6L4 20.2l1.3-4A7.6 7.6 0 0 1 3.5 11.4a8 8 0 0 1 8.5-7.9 8 8 0 0 1 8.5 7.9Z\"/>",
    "fill": false
  },
  {
    "label": "News from the United States",
    "svg": "<path d=\"M3.5 4.5h13v15H5.6a2.1 2.1 0 0 1-2.1-2.1Z\"/><path d=\"M16.5 8h4v9.4a2.1 2.1 0 0 1-4 .6\"/><path d=\"M6.5 8.5h7M6.5 12h7M6.5 15.5h4\"/>",
    "fill": false
  },
  {
    "label": "Alerts from the Middle East",
    "svg": "<path d=\"M12 4.2 2.9 19.2h18.2z\"/><path d=\"M12 10v4M12 16.7v.1\"/>",
    "fill": false
  },
  {
    "label": "Reports from Europe",
    "svg": "<path d=\"M6 3h8l4.5 4.5V21H6z\"/><path d=\"M14 3v5h4.5\"/><path d=\"M9.5 17.5v-3M12 17.5v-5.5M14.5 17.5v-2\"/>",
    "fill": false
  },
  {
    "label": "Broadcast audio from Brazil",
    "svg": "<rect x=\"9\" y=\"3\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7\"/>",
    "fill": false
  },
  {
    "label": "Crowds gathering in West Africa",
    "svg": "<circle cx=\"12\" cy=\"6.8\" r=\"2.7\"/><circle cx=\"5.4\" cy=\"9.4\" r=\"2.1\"/><circle cx=\"18.6\" cy=\"9.4\" r=\"2.1\"/><path d=\"M7.2 19.6a4.9 4.9 0 0 1 9.6 0\"/><path d=\"M2.4 17.8a3.6 3.6 0 0 1 3-3.5M21.6 17.8a3.6 3.6 0 0 0-3-3.5\"/>",
    "fill": false
  },
  {
    "label": "Positive sentiment in Australia",
    "svg": "<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M8.6 14.2a4.4 4.4 0 0 0 6.8 0\"/><path d=\"M9.2 9.6v.1M14.8 9.6v.1\"/>",
    "fill": false
  },
  {
    "label": "Negative sentiment in South Africa",
    "svg": "<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M8.6 15.8a4.4 4.4 0 0 1 6.8 0\"/><path d=\"M9.2 9.6v.1M14.8 9.6v.1\"/>",
    "fill": false
  },
  {
    "label": "Signals from Japan",
    "svg": "<circle cx=\"12\" cy=\"12\" r=\"2.1\"/><path d=\"M8.6 8.6a4.8 4.8 0 0 0 0 6.8M15.4 15.4a4.8 4.8 0 0 0 0-6.8\"/><path d=\"M5.9 5.9a8.6 8.6 0 0 0 0 12.2M18.1 18.1a8.6 8.6 0 0 0 0-12.2\"/>",
    "fill": false
  },
  {
    "label": "Posts on X from the US west coast",
    "svg": "<path d=\"M4.2 4h4.4l4.1 5.6L17.5 4h2.4l-6 7.4L20.6 20h-4.4l-4.4-6-5.2 6H4.2l6.3-7.7z\"/>",
    "fill": true
  },
  {
    "label": "Posts on Facebook from South-East Asia",
    "svg": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"4.2\"/><path d=\"M15.1 8.4h-1.4c-.95 0-1.4.55-1.4 1.4V12h2.7l-.42 2.7h-2.28v6\"/>",
    "fill": false
  },
  {
    "label": "Posts on Instagram from Mexico",
    "svg": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"4.6\"/><circle cx=\"12\" cy=\"12\" r=\"3.8\"/><circle cx=\"16.9\" cy=\"7.1\" r=\"1.05\" fill=\"currentColor\" stroke=\"none\"/>",
    "fill": false
  },
  {
    "label": "Shout-outs amplified from Egypt",
    "svg": "<path d=\"M4 10v4a1.5 1.5 0 0 0 1.5 1.5h1.9L16.5 20V4L7.4 8.5H5.5A1.5 1.5 0 0 0 4 10Z\"/><path d=\"M19.4 9.2a3.6 3.6 0 0 1 0 5.6\"/><path d=\"M7.4 15.6v3a1.6 1.6 0 0 0 3.2 0V17\"/>",
    "fill": false
  },
  {
    "label": "Posts from Spain",
    "svg": "<rect x=\"6.5\" y=\"3.5\" width=\"14\" height=\"14\" rx=\"2.4\"/><path d=\"M10 7.6h7M10 11.2h7\"/><path d=\"M17.5 20.5H5.6a2.1 2.1 0 0 1-2.1-2.1V7\"/>",
    "fill": false
  },
  {
    "label": "Video from Canada",
    "svg": "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M10.2 8.6 15.4 12l-5.2 3.4z\"/>",
    "fill": false
  },
  {
    "label": "Trending hashtags from Argentina",
    "svg": "<path d=\"M9.6 3.6 7.9 20.4M16.4 3.6l-1.7 16.8M4.2 8.6h16M3.6 15.4h16\"/>",
    "fill": false
  },
  {
    "label": "Images from Kenya",
    "svg": "<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2.6\"/><circle cx=\"8.6\" cy=\"9.6\" r=\"1.7\"/><path d=\"M3.8 16.8 9 12.5l4.2 3.4 3.2-2.6 3.8 3\"/>",
    "fill": false
  },
  {
    "label": "Live coverage from Russia",
    "svg": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"12\" rx=\"2.4\"/><circle cx=\"12\" cy=\"11\" r=\"2.2\"/><path d=\"M8 21h8M12 17v4\"/>",
    "fill": false
  }
];
