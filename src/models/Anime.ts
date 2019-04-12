import { MethodMap, DiscordMessage, SendMsgEmbed, ResponseMap } from '../types';
import { RichEmbed } from 'discord.js';
// import axios from 'axios'

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

    private static async season(message: DiscordMessage): Promise<SendMsgEmbed> {
        let embed = new RichEmbed();
        return { embed };
    }

    // static async requestToAniList(query: string, variables: string | number): Promise<object> {
    //     // Dont need to worry about error handling because bot has a global error handler yay.
    //     let result = await axios.post(Anime.BASE_URL, Anime.createOptions(query, variables));
    //     return result.data.data ? result.data.data : result.data.errors;
    // }

    private static createOptions(
        query: string,
        variables: { [name: string]: any },
    ): { method: string; headers: object; body: string } {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        };
    }
}

//

export default Anime;
