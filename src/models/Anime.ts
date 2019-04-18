import { MethodMap, SendMsgEmbed, ResponseMap, PrefixedMessage } from '../types';
import { RichEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { getByAiring, getBySeason, searchAnime } from '../queries/Anime';
import createError from '../helpers/createError';

/* 
Using API for anilist
Should allow for basic info on anime, airing times, all anime in a season, etc etc. 
Uses GraphQL.
*/

// https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview

class Anime {
    static responseMap: ResponseMap = {
        season: 'Searches all anime airing for the specified season/year combination.',
        search: 'Searches for a speciifc anime, and returns some basic info.',
    };
    static methodMap: MethodMap = {
        help: Anime.responseMap,
        season: Anime.season,
        search: Anime.search,
    };

    private static BASE_URL: string = 'https://graphql.anilist.co';
    private static BASE_URL_ANIME: string = 'https://anilist.co/anime';
    private static ANILIST_LOGO: string = 'https://avatars3.githubusercontent.com/u/18018524';

    static async season(message: PrefixedMessage): Promise<SendMsgEmbed> {
        let extract: string[] = message.noPrefix.split(' --page ');
        let page: number = Number(extract[1]) || 1;
        let variables = Anime.getSeasonTags(extract[0], page);
        let result = await Anime.requestToAniList(getBySeason, variables);
        let { pageInfo, media } = result.Page;
        // format by page, reactions will be needed most likely
        let embed = new RichEmbed()
            .setTitle(`Anime Season ${variables.season} ${variables.seasonYear}`)
            .setFooter(`Page ${pageInfo.currentPage} of ${pageInfo.lastPage}`)
            .setTimestamp();
        for (let anime of media) {
            let title: string = Anime.formatTitle(anime.title, anime.format);
            let desc: string = `Genres: ${anime.genres.join(', ')}\nEpisodes: ${anime.episodes}\nStatus: ${
                anime.status
            }\n${Anime.BASE_URL_ANIME}/${anime.id}`;
            embed.addField(title, desc);
        }
        return { embed };
    }

    static async search(message: PrefixedMessage): Promise<SendMsgEmbed> {
        let result = await Anime.requestToAniList(searchAnime, { search: message.noPrefix });
        let anime: any = result.Media;
        let date = new Date(`${anime.startDate.year} ${anime.startDate.month} ${anime.startDate.day}`);
        let embed = new RichEmbed()
            .setAuthor(`Studio: ${anime.studios.nodes[0].name}`)
            .setTitle(Anime.formatTitle(anime.title, anime.format))
            .setDescription(anime.description)
            .setThumbnail(Anime.ANILIST_LOGO)
            .setURL(`${Anime.BASE_URL_ANIME}/${anime.id}`)
            .setFooter(`Aired on: ${date.toDateString()}`)
            .setTimestamp()
            .setImage(anime.coverImage.large)
            .addField('Other Names', anime.synonyms.join(',\n') || 'None')
            .addField('Source', anime.source)
            .addField('Episodes', `${anime.episodes} (${anime.duration} min each)`)
            .addField('Status', anime.status)
            .addField('Tags', anime.tags.map((s: { name: string }) => s.name).join(', '))
            .addField('Genres', anime.genres.join(', '));
        return { embed };
    }

    static async requestToAniList(query: string, variables: object): Promise<any> {
        // Even though bot has global error handler, I want to separate out request errors and api errors.
        try {
            let result: AxiosResponse<any> = await axios.post(Anime.BASE_URL, { query, variables }, Anime.options);
            return result.data.data;
        } catch (error) {
            let errorMsg = error.response.data.errors[0].message || 'An error occurred in making the request.';
            throw createError(errorMsg, error.response.status);
        }
    }

    static getSeasonTags(seasons: string, page: number = 1): { season: string; seasonYear: number; page: number } {
        let possibleSeasons: string[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
        // Have to make sure the string is in the format SEASON/MONTH YEAR
        let orderedSeasons = seasons.split(' ');
        if (!isNaN(+orderedSeasons[0])) orderedSeasons.reverse();
        let date = new Date(orderedSeasons.join(' '));
        let season: string = possibleSeasons[Math.floor(date.getMonth() / 3)];
        // Direct Season name overrides all
        for (let s of possibleSeasons) {
            if (seasons.includes(s)) season = s;
        }
        return { season, seasonYear: date.getFullYear(), page };
    }

    private static formatTitle(title: { english: string; romaji: string }, format: string): string {
        let enTitle: string | null = title.english !== null ? `(${title.english}) -` : '-';
        return `${title.romaji} ${enTitle} ${format}`;
    }

    private static options = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };
}

//

export default Anime;
