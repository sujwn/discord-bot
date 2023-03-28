const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('surprise')
        .setDescription('Send a surpirse message!'),
    async execute(interaction) {
        let surpriseText = `🟥🟥🟥🟥🟥🟥🟥🟥🟥\n🟥⬜⬜⬜⬜⬜⬜⬜🟥\n🟥⬜⬛⬜⬛⬛⬛⬜🟥\n🟥⬜⬛⬜⬛⬜⬜⬜🟥\n🟥⬜⬛⬛⬛⬛⬛⬜🟥\n🟥⬜⬜⬜⬛⬜⬛⬜🟥\n🟥⬜⬛⬛⬛⬜⬛⬜🟥\n🟥⬜⬜⬜⬜⬜⬜⬜🟥\n🟥🟥🟥🟥🟥🟥🟥🟥🟥`;
        await interaction.reply(surpriseText);
    },
};
