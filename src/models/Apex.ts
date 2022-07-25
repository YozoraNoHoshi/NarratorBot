import Axios from 'axios';
import { APEX_MAP_ROTATION_URL } from '../constants';
import { ResponseMap, MethodMap } from '../types';

class ApexLegendsCommands {
  static responseMap: ResponseMap = {
    map: 'Display the current map rotation',
  };
  static methodMap: MethodMap = {
    help: ApexLegendsCommands.responseMap,
    map: ApexLegendsCommands.mapRotation,
  };

  static async mapRotation(): Promise<string> {
    const url = `${APEX_MAP_ROTATION_URL}?auth=${process.env.APEX_API_KEY}`;
    const { data } = await Axios.get(url);

    return JSON.stringify(data);
  }
}

export default ApexLegendsCommands;
