const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('surprise')
        .setDescription('Send a surpirse message!'),
    async execute(interaction) {
        let surpriseText = `(ɔ◔‿◔)ɔ ♥`;
        await interaction.reply(surpriseText);
    },
};
