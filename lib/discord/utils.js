import config from './config.json' assert { type: "json" };
import {EmbedBuilder} from 'discord.js';

// Generate marketplace link
export const getMarketplaceLink = (marketplace, tokenId) => {
    switch (marketplace) {
        case 'BLUR':
            return `https://blur.io/asset/${config.collection.contractAddress}/${tokenId}`;
        case 'OPENSEA':
            return `https://opensea.io/assets/ethereum/${config.collection.contractAddress}/${tokenId}`;
        case 'X2Y2':
            return `https://x2y2.io/eth/${config.collection.contractAddress}/${tokenId}`;
        default:
            return `https://opensea.io/assets/ethereum/${config.collection.contractAddress}/${tokenId}`;
    }
}

// Get server marketplace emoji
export const getMarketplaceEmoji = (marketplace) => {
    switch (marketplace) {
        case 'BLUR':
            return config.customEmojis.blur && config.customEmojis.blur !== ''
                ? config.customEmojis.blur : 'BLUR'
        case 'OPENSEA':
            return config.customEmojis.opensea && config.customEmojis.opensea !== ''
                ? config.customEmojis.opensea : 'OPENSEA'
        case 'X2Y2':
            return config.customEmojis.x2y2 && config.customEmojis.x2y2 !== ''
                ? config.customEmojis.x2y2 : 'X2Y2'
        default:
            return marketplace;
    }
}

export const createSaleEmbedMsg = (details) => {
    return new EmbedBuilder()
        .setColor(config.embedMsgs.salesColor | 'Green')
        .setTitle(`${config.collection.name} #${details.tokenId} just sold!`)
        .setURL(getMarketplaceLink(details.marketplace, details.tokenId))
        .setAuthor({ name: config.author.name, iconURL: config.author.iconURL, url: config.author.url })
        .setThumbnail(config.collection.thumbnailBaseUrl)
        .addFields(
            { name: 'Price', value: `${details.price.amount} ${details.price.symbol}`, inline: true },
            { name: 'Qty', value: details.amount, inline: true },
            { name: 'Marketplace', value: getMarketplaceEmoji(details.marketplace), inline: true },
        )
        .addFields(
            { name: 'Seller', value: details.seller, inline: false },
            { name: 'Buyer', value: details.buyer, inline: true },
        )
        .addFields(
            { name: 'Sold', value: `<t:${details.timestamp}:R>`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: config.footer.text, iconURL: config.footer.iconURL });
};

export const createListingEmbedMsg = (details) => {
    return new EmbedBuilder()
        .setColor(config.embedMsgs.listingsColor | 'Blue')
        .setTitle(`${config.collection.name} #${details.tokenId} listed!`)
        .setURL(getMarketplaceLink(details.marketplace, details.tokenId))
        .setAuthor({ name: config.author.name, iconURL: config.author.iconURL, url: config.author.url })
        .setThumbnail(config.collection.thumbnailBaseUrl)
        .addFields(
            { name: 'Price', value: `${details.price.amount} ${details.price.symbol}`, inline: true },
            { name: 'Qty', value: details.amount, inline: true },
            { name: 'Marketplace', value: getMarketplaceEmoji(details.marketplace), inline: true },
        )
        .addFields(
            { name: 'Offerer', value: details.seller, inline: false },
        )
        .addFields(
            { name: 'Listed', value: `<t:${details.timestamp}:R>`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: config.footer.text, iconURL: config.footer.iconURL });
};