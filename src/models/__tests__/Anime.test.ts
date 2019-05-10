import Anime from '../Anime';
import { searchAnime } from '../../queries/Anime';
import createError from '../../helpers/createError';
import { tsukiGaKireiSearch, getAiringSearch, getSeasonSearch } from '../../../__fixtures__/aniList';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('It produces proper season tags based off string', () => {
    let result = Anime.getSeasonTags('WINTER 2018');
    expect(result).toHaveProperty('season', 'WINTER');
    expect(result).toHaveProperty('seasonYear', 2018);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('SPRING 2018');
    expect(result).toHaveProperty('season', 'SPRING');
    expect(result).toHaveProperty('seasonYear', 2018);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('FALL 2016');
    expect(result).toHaveProperty('season', 'FALL');
    expect(result).toHaveProperty('seasonYear', 2016);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('SUMMER 2013');
    expect(result).toHaveProperty('season', 'SUMMER');
    expect(result).toHaveProperty('seasonYear', 2013);
    expect(result).toHaveProperty('page', 1);
});

test('It produces proper season tags based off months', () => {
    for (let month of ['JANUARY', 'FEBRUARY', 'MARCH']) {
        let result = Anime.getSeasonTags(`${month} 2018`);
        expect(result).toHaveProperty('season', 'WINTER');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
        result = Anime.getSeasonTags(`2018 ${month}`);
        expect(result).toHaveProperty('season', 'WINTER');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
    }
    for (let month of ['APRIL', 'MAY', 'JUNE']) {
        let result = Anime.getSeasonTags(`${month} 2018`);
        expect(result).toHaveProperty('season', 'SPRING');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
        result = Anime.getSeasonTags(`2018 ${month}`);
        expect(result).toHaveProperty('season', 'SPRING');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
    }
    for (let month of ['JULY', 'AUGUST', 'SEPTEMBER']) {
        let result = Anime.getSeasonTags(`${month} 2018`);
        expect(result).toHaveProperty('season', 'SUMMER');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
        result = Anime.getSeasonTags(`2018 ${month}`);
        expect(result).toHaveProperty('season', 'SUMMER');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
    }
    for (let month of ['OCTOBER', 'NOVEMBER', 'DECEMBER']) {
        let result = Anime.getSeasonTags(`${month} 2018`);
        expect(result).toHaveProperty('season', 'FALL');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
        result = Anime.getSeasonTags(`2018 ${month}`);
        expect(result).toHaveProperty('season', 'FALL');
        expect(result).toHaveProperty('seasonYear', 2018);
        expect(result).toHaveProperty('page', 1);
    }
});

test('It produces proper season tags based off different order string', () => {
    let result = Anime.getSeasonTags('2019 SPRING');
    expect(result).toHaveProperty('season', 'SPRING');
    expect(result).toHaveProperty('seasonYear', 2019);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('2018 WINTER');
    expect(result).toHaveProperty('season', 'WINTER');
    expect(result).toHaveProperty('seasonYear', 2018);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('2017 SUMMER');
    expect(result).toHaveProperty('season', 'SUMMER');
    expect(result).toHaveProperty('seasonYear', 2017);
    expect(result).toHaveProperty('page', 1);
    result = Anime.getSeasonTags('2001 FALL');
    expect(result).toHaveProperty('season', 'FALL');
    expect(result).toHaveProperty('seasonYear', 2001);
    expect(result).toHaveProperty('page', 1);
});

test('Anime.getSeason', async () => {
    let data = getSeasonSearch;
    let axiosReturn: any = { data };
    mockedAxios.post.mockResolvedValue(axiosReturn);

    let search: any = { noPrefix: 'WINTER 2018 --page 1' };
    let result: any = await Anime.season(search);
    expect(result).toHaveProperty('embed');
    expect(result.embed).toHaveProperty('fields');
    expect(result.embed.fields.length).toBe(25);
    expect(result.embed).toHaveProperty('timestamp');
    expect(result.embed).toHaveProperty('footer');
    expect(result.embed).toHaveProperty('title', 'Anime Season WINTER 2018');
    expect(result.embed.fields[0]).toHaveProperty('name', 'Fate/EXTRA Last Encore  - TV');
    expect(result.embed.fields[0]).toHaveProperty(
        'value',
        'Genres: Action, Fantasy\nEpisodes: 13\nStatus: FINISHED\nhttps://anilist.co/anime/21717',
    );
});

test('Anime.getAiring', async () => {
    let data = getAiringSearch;
    let axiosReturn: any = { data };
    mockedAxios.post.mockResolvedValue(axiosReturn);
    let search: any = { noPrefix: '--page 1' };
    let result: any = await Anime.getAiring(search);
    expect(result).toHaveProperty('embed');
    expect(result.embed).toHaveProperty('fields');
    expect(result.embed.fields.length).toBe(25);
    expect(result.embed).toHaveProperty('timestamp');
    expect(result.embed).toHaveProperty('footer');
    expect(result.embed).toHaveProperty('title', 'Currently Airing Anime');
    expect(result.embed.fields[0]).toHaveProperty('name', `Jimoto ga Japan (I'm From Japan)`);
    expect(result.embed.fields[0]).toHaveProperty(
        'value',
        'Type: TV_SHORT\nEpisode: 5\nApproximate Airing at: Sun May 05 2019, 03:05:00 PM\nhttps://anilist.co/anime/106607',
    );
});

test('Anime.search method for Tsuki Ga Kirei', async () => {
    let data = tsukiGaKireiSearch;
    let axiosReturn: any = { data: { data } };
    mockedAxios.post.mockResolvedValue(axiosReturn);

    let search: any = { noPrefix: 'Tsuki Ga Kirei' };
    let result: any = await Anime.search(search);
    expect(result).toHaveProperty('embed');
    expect(result.embed).toHaveProperty('fields');
    expect(result.embed.fields.length).toBe(6);
    expect(result.embed).toHaveProperty('image');
    expect(result.embed).toHaveProperty('timestamp');
    expect(result.embed).toHaveProperty('description');
    expect(result.embed).toHaveProperty('footer');
    expect(result.embed).toHaveProperty('title');
    expect(result.embed).toHaveProperty('thumbnail');
    expect(result.embed).toHaveProperty('url');
    expect(result.embed).toHaveProperty('author');
    expect(result.embed.author).toHaveProperty('name', 'Studio: feel.');
});

test('it gets returns data for Tsuki Ga Kirei from searching (may change due to the api and its whims)', async () => {
    let data = tsukiGaKireiSearch;
    let axiosReturn: any = { data: { data } };
    mockedAxios.post.mockResolvedValue(axiosReturn);

    let result = await Anime.requestToAniList(searchAnime, { search: 'Tsuki Ga Kirei' });
    expect(data).toEqual(result);
});

// Need to figure out how to handle mocked rejected messages
// test('it throws an error from anilist', async () => {
//     let axiosReturn: any = createError('Not Found.', 404);
//     // MockRejectedValue is returning the fallback for a failed request rather than what the API would return
//     mockedAxios.post.mockRejectedValue(axiosReturn);
//     let error: any;
//     try {
//         await Anime.requestToAniList(searchAnime, { search: '///////////////////' });
//     } catch (e) {
//         error = e;
//     }
//     expect(error).toEqual(createError(`Not Found.`, 404));
// });
