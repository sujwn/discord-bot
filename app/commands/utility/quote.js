const request = require('request');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('Replies with random quote!'),
    async execute(interaction) {
        request.get({
            url: 'https://api.quotable.io/random',
            headers: {
                'Content-type': 'application/json'
            },
        }, function (error, response, body) {
            if (error) {
                console.error(error);
                return interaction.reply('An error occurred while fetching the quote.');
            }
            const data = JSON.parse(body);
            const quote = `"${data.content}"\n\n-${data.author}`;
            interaction.reply(`\`\`\`${quote}\`\`\``);
        });
    },
};
