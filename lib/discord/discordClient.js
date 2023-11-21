import dotenv from 'dotenv';
dotenv.config();

import config from './config.json' assert { type: "json" };
import {Client, GatewayIntentBits} from 'discord.js';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let clientReady = false;
let channel = {};

export const initializeClient = async () => {
    if (config.channelIds.baseChannel !==  '')
        channel.base = await getChannelById(config.channelIds.baseChannel);
    if (config.channelIds.listingsChannel !== '')
        channel.listings = await getChannelById(config.channelIds.listingsChannel);
    if (config.channelIds.salesChannel !== '')
        channel.sales = await getChannelById(config.channelIds.salesChannel);
    console.log('Client successfully initialized.');
}

export const isReady = () => clientReady;

export const readyPromise = () => new Promise((resolve) => {
    client.on('ready', async () => {
        console.log('Discord client logged.');
        await initializeClient();
        clientReady = true;
        resolve();
    });
});

client.login(process.env.DISCORD_TOKEN);

const getChannelById = async (id) => {
    return await client.channels.fetch(id);
};

export const getChannel = () => channel;