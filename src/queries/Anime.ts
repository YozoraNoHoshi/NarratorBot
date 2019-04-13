export const getBySeason: string = `query ($season: MediaSeason, $seasonYear: Int, $page: Int)  {
  Page (perPage: 25, page: $page) {
    pageInfo{
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(season: $season, seasonYear: $seasonYear, type: ANIME) {
      title {
        romaji
        native
        english
      }
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
