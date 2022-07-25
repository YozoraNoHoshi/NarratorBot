import Axios from 'axios';
import { APEX_MAP_ROTATION_URL } from '../constants';
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
    embed.addField('Next Map', `${next.map} (${next.DurationInMinutes})`);
    embed.setImage(current.asset);
    return { embed };
  }
}

export default ApexLegendsCommands;
