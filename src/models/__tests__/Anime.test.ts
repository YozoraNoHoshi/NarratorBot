import Anime from '../Anime';

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
