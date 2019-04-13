import { MethodMap, DiscordMessage, SendMsgEmbed, ResponseMap } from '../types';
import { RichEmbed } from 'discord.js';
import axios from 'axios';
import { getByAiring, getBySeason } from '../queries/Anime';

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
        let { season, year } = Anime.getSeasonTag(message.noPrefix);
        let result = await Anime.requestToAniList(getBySeason, { season, year });
        let embed = new RichEmbed();
        return { embed };
    }

    private static async requestToAniList(query: string, variables: object): Promise<object> {
        // Dont need to worry about error handling because bot has a global error handler yay.
        let result = await axios.post(Anime.BASE_URL, { query, variables }, Anime.options);
        console.log(result.data);
        return result.data.data ? result.data.data : result.data.errors;
    }

    private static getSeasonTag(seasons: string): { season: string; year: number } {
        let messagePart = seasons.split(' ');
        // First part is a year
        if (!isNaN(Number(messagePart[0]))) {
        }
        let season = '';
        let year = 0;
        return { season, year };
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
