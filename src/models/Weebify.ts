// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { PrefixedMessage } from '../types';

// class Weebify {
//   static getTranslateURL(query: string): string {
//     const textQuery = query.split(' ').join('%20');
//     return `https://translate.google.com/#view=home&op=translate&sl=en&tl=ja&text=${textQuery}`;
//   }

//   static async text(string: string): Promise<string> {
//     const { data } = await axios.get(this.getTranslateURL(string));

//     const translate = cheerio.load(data);

//     const textArr = translate('div.tlid-transliteration-content.transliteration-content.full');
//     return textArr.text();
//   }

//   static async transform(message: PrefixedMessage) {
//     return await Weebify.text(message.noPrefix);
//   }
// }

// export default Weebify;
