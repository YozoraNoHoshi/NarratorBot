import Axios from 'axios';
import { APEX_CRAFTING_ROTATION_URL, APEX_MAP_ROTATION_URL } from '../constants';
import { ResponseMap, MethodMap, SendMsgEmbed } from '../types';
import { MessageEmbed } from 'discord.js';

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
  };
  static methodMap: MethodMap = {
    help: ApexLegendsCommands.responseMap,
    map: ApexLegendsCommands.mapRotation,
  };

  static async mapRotation(): Promise<SendMsgEmbed> {
    const url = `${APEX_MAP_ROTATION_URL}?auth=${process.env.APEX_API_KEY}`;
    const { data }: { data: ApexMapResponse } = await Axios.get(url);
    const { current, next } = data;

    const embed = new MessageEmbed().setTitle('Apex Legends Map Rotation');
    embed.addField('Current Map', `${current.map} (${current.remainingTimer})`);
    embed.addField('Next Map', `${next.map} for ${next.DurationInMinutes} minutes.`);
    embed.setImage(current.asset);
    return { embed };
  }

  static async craftingRotation(): Promise<SendMsgEmbed> {
    const url = `${APEX_CRAFTING_ROTATION_URL}?auth=${process.env.APEX_API_KEY}`;
    const { data }: { data: ApexCraftingRotation } = await Axios.get(url);

    const embed = new MessageEmbed().setTitle('Apex Legends Crafting Rotation');
    data.forEach((bundle) => {
      embed.addField(
        `${bundle.bundle} (${bundle.bundleType})`,
        `${bundle.bundleContent.map((item) => `${item.itemType.name} (${item.cost})`).join('\n')}`,
      );
    });

    return { embed };
  }
}

export default ApexLegendsCommands;
