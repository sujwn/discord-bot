const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Shows work command options.'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('check-in')
                    .setLabel('Check-in')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('check-out')
                    .setLabel('Check-out')
                    .setStyle(ButtonStyle.Primary),
            );
        // Send message that only visible to the user who run the command
        await interaction.reply({ content: 'Select your option:', components: [row], ephemeral: true });
    },
};