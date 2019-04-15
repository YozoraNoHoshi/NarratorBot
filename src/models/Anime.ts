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

    static async season(message: DiscordMessage): Promise<SendMsgEmbed> {
        let { season, year } = Anime.getSeasonTags(message.noPrefix);
        let result = await Anime.requestToAniList(getBySeason, { season, year });
        // format by page, reactions will be needed most likely
        let embed = new RichEmbed();
        return { embed };
    }

    private static async requestToAniList(query: string, variables: object): Promise<object> {
        // Even though bot has global error handler, we want to reformat the error nicely.
        try {
            let result: AxiosResponse<any> = await axios.post(Anime.BASE_URL, { query, variables }, Anime.options);
            return result.data.data ? result.data.data : result.data.errors;
        } catch (error) {
            console.log(error.response.data);
            let errorMsg = error.response.data || 'An error occurred in making the request.';
            throw createError(errorMsg, 400);
        }
    }

    private static getSeasonTags(seasons: string): { season: string; year: number } {
        let date = new Date(seasons);
        let season: string = ['WINTER', 'SPRING', 'SUMMER', 'FALL'][Math.floor(date.getMonth() / 4)];
        return { season, year: date.getFullYear() };
    }

    private static options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };
}

//

export default Anime;
