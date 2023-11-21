import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import * as DiscordClient from './lib/discord/discordClient.js';
import { createSaleEmbedMsg, createListingEmbedMsg } from './lib/discord/utils.js';

let lastListingTimestamp = '1700423544';
let lastSaleTimestamp = '1700246599';

const contractAddresses = {
    mintvials: '0x348fc118bcc65a92dc033a951af153d14d945312'
}

async function handleSaleEvent(item) {
    const {token, from, to, amount, fillSource, price, timestamp} = item;

    try {
        const embedMsg = createSaleEmbedMsg({
            tokenId: token.tokenId,
            marketplace: fillSource,
            price: {
                symbol: price.currency.symbol,
                amount: price.amount.decimal
            },
            buyer: from,
            seller: to,
            amount: amount.toString(),
            timestamp
        });

        const {base, sales} = DiscordClient.getChannel();

        if (base) {
            base.send({embeds: [embedMsg]});
        }

        if (sales) {
            sales.send({embeds: [embedMsg]});
        }

    } catch (e) {
        console.error(e);
    }
}

async function handleListEvent(item) {
    const {criteria, source, price, maker, quantityRemaining, validFrom} = item;

    try {
        const embedMsg = createListingEmbedMsg({
            tokenId: criteria.data.token.tokenId,
            marketplace: source.name,
            price: {
                symbol: price.currency.symbol,
                amount: price.amount.decimal
            },
            seller: maker,
            amount: quantityRemaining.toString(),
            timestamp: validFrom
        });

        const {base, listings} = DiscordClient.getChannel();

        if (base) {
            base.send({embeds: [embedMsg]});
        }

        if (listings) {
            listings.send({embeds: [embedMsg]});
        }
    } catch (e) {
        console.error(e);
    }
}

async function fetchSales() {
    try {
        const response = await axios.get('https://api.reservoir.tools/sales/v6', {
            params: {
                collection: contractAddresses.mintvials,
                startTimestamp: lastSaleTimestamp
            },
            headers: {
                'accept': '*/*',
                'x-api-key': process.env.RESERVOIR_API_KEY
            }
        });

        response.data.sales.forEach(sale => {
            handleSaleEvent(sale);
        });
        lastSaleTimestamp = Math.floor(Date.now() / 1000);
    } catch (e) {
        console.error(e);
    }
}

async function fetchListings() {
    try {
        const response = await axios.get('https://api.reservoir.tools/orders/asks/v5', {
            params: {
                tokenSetId: `contract:${contractAddresses.mintvials}`,
                startTimestamp: lastListingTimestamp
            },
            headers: {
                'accept': '*/*',
                'x-api-key': process.env.RESERVOIR_API_KEY
            }
        });

        response.data.orders.forEach(listing => {
            handleListEvent(listing);
        });
        lastListingTimestamp = Math.floor(Date.now() / 1000);
    } catch (e) {
        console.error(e);
    }
}

const connect = async () => {
    try {
        if (!DiscordClient.isReady()) {
            console.log('Initiating discord client...');
            await DiscordClient.readyPromise();
            if (DiscordClient.isReady()) {
                console.log('Discord client is ready.');
                setInterval(fetchSales, 6000);
                setInterval(fetchListings, 6000);
            } else {
                console.log('Error initiating discord client.');
            }
        }
    } catch (e) {console.log(JSON.stringify(e))}
}

connect();