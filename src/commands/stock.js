const {
    SlashCommandBuilder,
    EmbedBuilder,
 } = require('discord.js');


const { fetchStock } = require('../requests/vantage');


const data = new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Replies with the financial stock information for the day!')
    .addStringOption((option) => {
        return option
            .setName('function')
            .setDescription('The time series of your choice.')
            .setRequired(true)
            .addChoices(
                { name: 'Intraday', value: 'TIME_SERIES_INTRADAY'},
            );
    })
    .addStringOption((option) => {
        return option
            .setName('symbol')
            .setDescription('The symbol is the name of the equity.')
            .setRequired(true);
    })
    .addStringOption((option) => {
        return option
            .setName('interval')
            .setDescription('The time interval between two consecutive data points in the time series.')
            .setRequired(true)
            .addChoices(
                { name: '1 Minute', value: '1min'},
                { name: '5 Minutes', value: '5min'},
                { name: '15 Minutes', value: '15min'},
                { name: '30 Minutes', value: '30min'},
                { name: '60 Minutes', value: '60min'},
            );
    });


    async function execute(interaction) {
        await interaction.deferReply();


        const _function = interaction.options.getString('function');
        const symbol = interaction.options.getString('symbol');
        const interval = interaction.options.getString('interval');
        const api_key = process.env.ALPHA_VANTAGE_KEY;


        try {
            const { weatherData, locationName } = await fetchForecast(location);


            const embed = new EmbedBuilder()
                .setColor(0x3f704d)
                .setTitle(`Astronomical forecast for ${locationName}...`)
                .setTimestamp()
                .setFooter({
                    text: 'Powered by the weatherapi.com API',
                });
           
            for (const day of weatherData) {
                embed.addFields({
                    name: day.date,
                    value: `🌅 Sunrise: ${day.sunriseTime}\n🌄 Sunset: ${day.sunsetTime}\n🌔 Moonrise: ${day.moonriseTime}\n🌘 Moonset: ${day.moonsetTime}`
                })
            }
            await interaction.editReply({
                embeds: [embed],
            });
        } catch(error) {
            await interaction.editReply(error);
        }
       
    }


    module.exports = {
        data,
        execute,
    };

