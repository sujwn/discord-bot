const { Events, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const checkIns = new Map();
const checkOuts = new Map();
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            // Handle button clicks
            if (interaction.customId === 'check-in') {
                const userId = interaction.user.id;
                const user = interaction.guild.members.cache.get(userId);

                // Check if user has already checked in
                if (checkIns.has(userId)) {
                    return interaction.reply({ content: 'You have already checked in today!', ephemeral: true });
                }

                // Add user to checked in list
                checkIns.set(userId, Date.now());

                // Create message embed
                const today = new Date();
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Check-In')
                    .setAuthor({ name: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${today.toLocaleString('default', { weekday: 'long' })}, ${today.toLocaleDateString()}`)
                    .addFields(
                        // { name: '\u200B', value: '\u200B' },
                        // { name: 'Name', value: user.displayName, inline: true },
                        { name: 'Check-in Time', value: today.toLocaleTimeString() },
                        { name: '\u200B', value: '\u200B'},
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Healstation' });

                // Send message with embed and button
                await interaction.reply({ embeds: [embed], components: [] });
            } else if (interaction.customId === 'check-out') {
                // open popup modal that asks user to fill textarea of today activity
                const modal = new ModalBuilder()
                    .setCustomId('check-out-modal')
                    .setTitle('Check-out')

                // Add components to modal

                const activitiesInput = new TextInputBuilder()
                    .setCustomId('activitiesInput')
                    .setLabel("What did you do today?")
                    // Paragraph means multiple lines of text.
                    .setStyle(TextInputStyle.Paragraph);

                // An action row only holds one text input,
                // so you need one action row per text input.
                const row = new ActionRowBuilder().addComponents(activitiesInput);

                // Add inputs to the modal
                modal.addComponents(row);

                // Show the modal to the user
                await interaction.showModal(modal);
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
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'check-out-modal') {
                // Get the text input component
                const activitiesInput = interaction.fields.getTextInputValue('activitiesInput');
                
                const userId = interaction.user.id;
                const user = interaction.guild.members.cache.get(userId);

                // Check if user has already checked out
                if (!checkIns.has(userId)) {
                    return interaction.reply({ content: 'You have not checked in today!', ephemeral: true });
                }

                if (checkOuts.has(userId)) {
                    return interaction.reply({ content: 'You have already checked out today!', ephemeral: true });
                }

                // Add user to checked in list
                checkOuts.set(userId, Date.now());

                // Create message embed
                const today = new Date();
                const embed = new EmbedBuilder()
                    .setColor(0x00FFBE)
                    .setTitle('Check-Out')
                    .setAuthor({ name: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                    // .setThumbnail('https://i.imgur.com/Mcws4dp.jpeg')
                    .setDescription(`${today.toLocaleString('default', { weekday: 'long' })}, ${today.toLocaleDateString()}`)
                    .addFields(
                        // { name: '\u200B', value: '\u200B' },
                        // { name: 'Name', value: user.displayName, inline: true },
                        { name: 'Check-out Time', value: today.toLocaleTimeString() },
                        { name: 'Activities', value: activitiesInput },
                        { name: '\u200B', value: '\u200B'},
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Healstation' });

                // Send message with embed and button
                await interaction.reply({ embeds: [embed], components: [] });
            }
        }
    },
};
