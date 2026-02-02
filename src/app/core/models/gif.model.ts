/** Giphy image variant (URLs for different sizes) */
export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  mp4?: string;
  webp?: string;
}

/** Giphy images object (nested under images) */
export interface GiphyImages {
  fixed_height?: GiphyImage;
  fixed_height_small?: GiphyImage;
  original: GiphyImage;
  downsized?: GiphyImage;
  downsized_medium?: GiphyImage;
}

/** Giphy user (author) */
export interface GiphyUser {
  username: string;
  display_name: string;
  avatar_url: string;
  description?: string;
}

/** Single GIF from Giphy API */
export interface Gif {
  id: string;
  title: string;
  slug: string;
  url: string;
  embed_url: string;
  username: string;
  source: string;
  rating: string;
  import_datetime: string;
  trending_datetime: string;
  images: GiphyImages;
  user?: GiphyUser;
}

/** Pagination in Giphy list responses */
export interface GiphyPagination {
  total_count: number;
  count: number;
  offset: number;
}

/** Search response from Giphy API */
export interface GiphySearchResponse {
  data: Gif[];
  pagination: GiphyPagination;
}

/** Single GIF response from Giphy API */
export interface GiphySingleResponse {
  data: Gif;
}
