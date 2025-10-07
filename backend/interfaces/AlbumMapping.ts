export interface AlbumMetadata {
  albumName: string;
  artistName: string;
  imageUrl: string;
  releaseDate?: Date;
  genre?: string;
  duration?: number;
  trackCount?: number;
}

export interface TagMapping {
  albumId: string;
  metadata?: AlbumMetadata;
}

export interface MappingResult {
  tagId: string;
  albumId: string;
}

export interface MappingsCollection {
  [tagId: string]: TagMapping;
}
