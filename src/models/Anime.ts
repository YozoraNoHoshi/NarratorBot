import { MethodMap, SendMsgEmbed, ResponseMap, PrefixedMessage } from '../types';
import { RichEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { getByAiring, getBySeason, searchAnime } from '../queries/Anime';
import createError from '../helpers/createError';
import extractDate from '../helpers/extractDate';

/* 
Using API for anilist
Should allow for basic info on anime, airing times, all anime in a season, etc etc. 
Uses GraphQL.
*/

// https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview

class Anime {
    static responseMap: ResponseMap = {
        season: 'Searches all anime airing for the specified season/year combination.',
        search: 'Searches for a specific anime, and returns some basic info.',
        airing: 'Returns upcoming anime episodes and when they air.',
    };
    static methodMap: MethodMap = {
        help: Anime.responseMap,
        season: Anime.season,
        search: Anime.search,
        airing: Anime.getAiring,
    };

    private static BASE_URL: string = 'https://graphql.anilist.co';
    private static BASE_URL_ANIME: string = 'https://anilist.co/anime';
    private static ANILIST_LOGO: string = 'https://avatars3.githubusercontent.com/u/18018524';

    static async season(message: PrefixedMessage): Promise<SendMsgEmbed> {
        // message should be something like <PREFIX>anime season <SEASON> <YEAR> --page <PAGE>
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
            }\n${Anime.aniListLink(anime.id)}`;
            embed.addField(title, desc);
        }
        return { embed };
    }

    static async getAiring(message: PrefixedMessage): Promise<SendMsgEmbed> {
        let extract: string[] = message.noPrefix.split('--page ');
        let page: number = Number(extract[1]) || 1;
        let result = await Anime.requestToAniList(getByAiring, { notYetAired: true, episode: 26, page });
        let { pageInfo, airingSchedules } = result.Page;
        let embed = new RichEmbed()
            .setTitle('Currently Airing Anime')
            .setFooter(`Page ${pageInfo.currentPage} of ${pageInfo.lastPage}`)
            .setTimestamp();
        for (let anime of airingSchedules) {
            let title: string = Anime.formatTitle(anime.media.title);
            let airingAt: Date = new Date(anime.airingAt * 1000);
            let desc: string = `Type: ${anime.media.format}\nEpisode: ${
                anime.episode
            }\nApproximate Airing at: ${airingAt.toDateString()}, ${extractDate(airingAt)}\n${Anime.aniListLink(
                anime.media.id,
            )}`;
            embed.addField(title, desc);
        }
        return { embed };
    }

    static async search(message: PrefixedMessage): Promise<SendMsgEmbed> {
        // the message contents past the <PREFIX>anime search
        // becomes the search query.
        let result = await Anime.requestToAniList(searchAnime, { search: message.noPrefix });
        let anime: any = result.Media;
        let date = new Date(`${anime.startDate.year} ${anime.startDate.month} ${anime.startDate.day}`);
        let embed = new RichEmbed()
            .setAuthor(`Studio: ${anime.studios.nodes[0].name}`)
            .setTitle(Anime.formatTitle(anime.title, anime.format))
            .setDescription(anime.description)
            .setThumbnail(Anime.ANILIST_LOGO)
            .setURL(`${Anime.aniListLink(anime.id)}`)
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
            // let errorMsg = error.response.data.errors[0].message || 'An error occurred in making the request.';
            let { response } = error;
            let errorMsg =
                response && response.data
                    ? response.data.errors[0].message
                    : 'An error occurred in making the request.';
            let status = !response || !response.status ? 400 : response.status;
            throw createError(errorMsg, status);
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

    private static getErrorMessage(error: any): string {
        return error && error.data ? error.data.errors[0].message : 'An error occurred in making the request.';
    }

    private static formatTitle(title: { english: string; romaji: string }, format?: string): string {
        let enTitle: string | null = title.english !== null ? `(${title.english})` : '';
        return `${title.romaji} ${enTitle}${format ? ` - ${format}` : ''}`;
    }

    private static aniListLink(id: number | string): string {
        return `${Anime.BASE_URL_ANIME}/${id}`;
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
