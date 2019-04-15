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
      format
      genres
      episodes
      status
    }
  }
}`;

export const getByAiring: string = `query ($notYetAired: Boolean, $episode: Int, $page: Int) {
  Page (perPage: 25, page: $page) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    airingSchedules(notYetAired: $notYetAired, episode: $episode) {
      media {
        id
        title {
          romaji
          english
          native
        }
      }
      id
      airingAt
      episode
      timeUntilAiring
    }
  }
}`;
