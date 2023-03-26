const { Events, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            // Delete the original message
            await interaction.message.delete();

            // Handle button clicks
            if (interaction.customId === 'check-in') {
                await interaction.channel.send(`Good morning @everyone \nDon't forget to check-in notion! Have a nice day~`);
            } else if (interaction.customId === 'lunch') {
                await interaction.channel.send(`@everyone Let's take a break guys!`);
            } else if (interaction.customId === 'check-out') {
                await interaction.channel.send(`@everyone Let's check-out guys and get a nice rest~`);
            }
        } else if (interaction.isChatInputCommand()) {
            // Handle slash commands
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
    },
};
