import Axios from 'axios';
import { APEX_CRAFTING_ROTATION_URL, APEX_MAP_ROTATION_URL } from '../constants';
import { ResponseMap, MethodMap, SendMsgEmbed } from '../types';
import { EmbedBuilder } from 'discord.js';

interface ApexMapResponse {
  current: {
    start: number;
    end: number;
    readableDate_start: string;
    readableDate_end: string;
    map: string;
    code: string;
    DurationInSecs: number;
    DurationInMinutes: number;
    asset: string;
    remainingSecs: number;
    remainingMins: number;
    remainingTimer: string;
  };
  next: {
    start: number;
    end: number;
    readableDate_start: string;
    readableDate_end: string;
    map: string;
    code: string;
    DurationInSecs: number;
    DurationInMinutes: number;
  };
}

type ApexCraftingRotation = ApexCraftingBundle[];
interface ApexCraftingBundle {
  bundle: string;
  start: number;
  end: number;
  startDate: string;
  endDate: string;
  bundleType: string;
  bundleContent: ApexBundleContent[];
}
interface ApexBundleContent {
  item: string;
  cost: number;
  itemType: {
    name: string;
    rarity: string;
    asset: string;
    rarityHex: string;
  };
}

class ApexLegendsCommands {
  static responseMap: ResponseMap = {
    map: 'Display the current map rotation',
    craft: 'Display the current crafting rotation',
  };
  static methodMap: MethodMap = {
    help: ApexLegendsCommands.responseMap,
    map: ApexLegendsCommands.mapRotation,
    craft: ApexLegendsCommands.craftingRotation,
  };

  static async mapRotation(): Promise<SendMsgEmbed> {
    const url = `${APEX_MAP_ROTATION_URL}?auth=${process.env.APEX_API_KEY}`;
    const { data }: { data: ApexMapResponse } = await Axios.get(url);
    const { current, next } = data;

    const embed = new EmbedBuilder().setTitle('Apex Legends Map Rotation');
    embed.addFields({ name: 'Current Map', value: `${current.map} (${current.remainingTimer})` });
    embed.addFields({ name: 'Next Map', value: `${next.map} for ${next.DurationInMinutes} minutes.` });
    embed.setImage(current.asset);
    embed.setColor('#0094FF');
    return { embeds: [embed] };
  }

  static async craftingRotation(): Promise<SendMsgEmbed> {
    const url = `${APEX_CRAFTING_ROTATION_URL}?auth=${process.env.APEX_API_KEY}`;
    const { data }: { data: ApexCraftingRotation } = await Axios.get(url);

    const embed = new EmbedBuilder().setTitle('Apex Legends Crafting Rotation');

    data
      .filter(
        (bundle) =>
          bundle.bundleType !== 'permanent' || bundle.bundle === 'weapon_one' || bundle.bundle === 'weapon_two',
      )
      .forEach((bundle: ApexCraftingBundle) => {
        embed.addFields({
          name: `${bundle.bundleType} (${bundle.startDate} - ${bundle.endDate})`,
          value: `${bundle.bundleContent
            .map((item: ApexBundleContent) => `${item.itemType.name} (${item.cost})`)
            .join(', ')}`,
        });
      });

    embed.setColor('#0094FF');

    return { embeds: [embed] };
  }
}

export default ApexLegendsCommands;