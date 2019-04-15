import { MethodMap, DiscordMessage, SendMsgEmbed, ResponseMap } from '../types';
import { RichEmbed } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { getByAiring, getBySeason } from '../queries/Anime';
import createError from '../helpers/createError';

/* 
Using API for anilist
Should allow for basic info on anime, airing times, all anime in a season, etc etc. 
Uses GraphQL.
*/

// https://anilist.gitbook.io/anilist-apiv2-docs/overview/overview

class Anime {
    static responseMap: ResponseMap = {
        season: 'Contains filler description.',
    };
    static methodMap: MethodMap = {
        help: Anime.responseMap,
        season: Anime.season,
    };

    private static BASE_URL: string = 'https://graphql.anilist.co';

    static async season(message: DiscordMessage, page: number = 1): Promise<SendMsgEmbed> {
        let variables = Anime.getSeasonTags(message.noPrefix, page);
        let result = await Anime.requestToAniList(getBySeason, variables);
        let { pageInfo, media } = result.Page;
        // format by page, reactions will be needed most likely
        let embed = new RichEmbed()
            .setTitle(`Anime for ${variables.season} ${variables.year}`)
            .setAuthor(message.author)
            .setFooter(`Page ${pageInfo.currentPage} of ${pageInfo.lastPage}`)
            .setTimestamp();
        for (let anime of media) {
            embed.addField(
                `${anime.title.romaji} (${anime.title.english})`,
                `${anime.format} - ${anime.status}\nGenres: ${anime.genres.join(', ')}\nEpisodes: ${anime.episodes}`,
            );
        }
        return { embed };
    }

    private static async requestToAniList(query: string, variables: object): Promise<any> {
        // Even though bot has global error handler, I want to separate out request errors and api errors.
        try {
            let result: AxiosResponse<any> = await axios.post(Anime.BASE_URL, { query, variables }, Anime.options);
            return result.data.data ? result.data.data : result.data.errors;
        } catch (error) {
            console.log(error.response.data);
            let errorMsg = error.response.data || 'An error occurred in making the request.';
            throw createError(errorMsg, 400);
        }
    }

    private static getSeasonTags(seasons: string, page: number = 1): { season: string; year: number; page: number } {
        let date = new Date(seasons);
        let season: string = ['WINTER', 'SPRING', 'SUMMER', 'FALL'][Math.floor(date.getMonth() / 4)];
        return { season, year: date.getFullYear(), page };
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
