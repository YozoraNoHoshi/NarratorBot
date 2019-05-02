export const getBySeason: string = `query ($season: MediaSeason, $seasonYear: Int, $page: Int) {
  Page(perPage: 25, page: $page) {
    pageInfo {
      total
      currentPage
      lastPage
      perPage
    }
    media(season: $season, seasonYear: $seasonYear, format_in: [TV, MOVIE], type: ANIME) {
      title {
        romaji
        english
      }
      id
      format
      genres
      episodes
      status
    }
  }
}`;

export const searchAnime: string = `query ($search: String) {
  Media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
    title {
      romaji
      english
    }
    id
    coverImage {
      large
    }
    format
    genres
    synonyms
    tags {
      name
    }
    startDate {
      year
      month
      day
    }
    source
    season
    episodes
    duration
    status
    description
    studios (isMain:true) {
      nodes{
        name
      }
    }
  }
}
`;

export const getByAiring: string = `query ($notYetAired: Boolean, $episode: Int, $page: Int) {
  Page(perPage: 25, page: $page) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    airingSchedules(notYetAired: $notYetAired, episode_lesser: $episode, sort: TIME) {
      media {
        id
        title {
          romaji
          english
          native
        }
        format
      }
      airingAt
      episode
    }
  }
}
`;
