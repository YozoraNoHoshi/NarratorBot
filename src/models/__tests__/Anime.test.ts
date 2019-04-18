import Anime from '../Anime';
import { searchAnime } from '../../queries/Anime';
import createError from '../../helpers/createError';

// will need supertest for doing api request testing to anilist.
// TO DO once the get anime commands are finished

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

test('it gets Tsuki Ga Kirei from searching (may change due to the api and its whims)', async () => {
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
    let expectedResult = {
        Media: {
            title: {
                romaji: 'Tsuki ga Kirei',
                english: 'Tsukigakirei',
            },
            id: 98202,
            coverImage: {
                large: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/98202-TUOEKKL0RI5T.png',
            },
            format: 'TV',
            genres: ['Romance', 'Drama', 'Slice of Life'],
            synonyms: ['as the moon so beautiful.'],
            tags: [
                {
                    name: 'School',
                },
                {
                    name: 'Coming of Age',
                },
                {
                    name: 'CGI',
                },
                {
                    name: 'Love Triangle',
                },
                {
                    name: 'School Club',
                },
            ],
            startDate: {
                year: 2017,
                month: 4,
                day: 7,
            },
            source: 'ORIGINAL',
            season: 'SPRING',
            episodes: 12,
            duration: 25,
            status: 'FINISHED',
            description:
                "The series focuses on characters Akane Mizuno and Kotarou Azumi, two third-year middle school students who become classmates for the first time. The series will depict each characters' growth and connection to the people around them, such as classmates, club-mates, teachers, and parents. The anime will also center on the youthful adolescent romance of the characters, who are hounded by change and uncertainty as the seasons inevitably pass.<br><br>\n\n(Source: ANN)",
            studios: {
                nodes: [
                    {
                        name: 'feel.',
                    },
                ],
            },
        },
    };
    let result = await Anime.requestToAniList(searchAnime, { search: 'Tsuki Ga Kirei' });
    expect(expectedResult).toEqual(result);
});

test('it throws an error from anilist', async () => {
    let error: any;
    try {
        await Anime.requestToAniList(searchAnime, { search: '///////////////////' });
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(createError(`Not Found.`, 404));
});
