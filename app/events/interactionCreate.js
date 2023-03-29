const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const checkIns = new Map();
const checkOuts = new Map();
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()) {
            // Handle button clicks
            const userId = interaction.user.id;
            if (interaction.customId === 'check-in') {
                const user = interaction.guild.members.cache.get(userId);

                // Check if user has already checked in
                if (checkIns.has(userId)) {
                    return interaction.reply({ content: 'You have already checked in today! :sweat_smile:', ephemeral: true });
                }

                // Add user to checked in list
                checkIns.set(userId, Date.now());

                // Create message embed
                const today = new Date();
                // get today date with format: DD MMM YYYY
                const todayDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Check-In')
                    .setAuthor({ name: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${today.toLocaleString('default', { weekday: 'long' })}, ${todayDate}`)
                    .addFields(
                        // { name: '\u200B', value: '\u200B' },
                        // { name: 'Name', value: user.displayName, inline: true },
                        { name: 'Check-in Time', value: today.toLocaleTimeString() },
                    )
                    // .setTimestamp()
                    .setFooter({ text: 'Healstation' });

                // Send message with embed and button
                await interaction.reply({ embeds: [embed], components: [] });
            } else if (interaction.customId === 'check-out') {
                // if (checkOuts.has(userId)) {
                //     return interaction.reply({ content: 'You have already checked out today! :sweat_smile:', ephemeral: true });
                // }
                // Check if user has already checked in
                if (!checkIns.has(userId)) {
                    return interaction.reply({ content: 'You have not checked in today! :thinking:', ephemeral: true });
                }
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
            } else if (interaction.customId === 'check-in-list') {
                // Create message embed that shows list of checked in users
                const today = new Date();
                // get today date with format: DD MMM YYYY
                const todayDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                const embed = new EmbedBuilder()
                    // .setColor(0x0099FF)
                    .setTitle('Check-In List')
                    .setDescription(`${today.toLocaleString('default', { weekday: 'long' })}, ${todayDate}`)
                    // .setTimestamp()
                    .setFooter({ text: 'Healstation' });

                // Add checked in users to embed
                checkIns.forEach((value, key) => {
                    let user = interaction.guild.members.cache.get(key);
                    embed.addFields(
                        { name: user.displayName, value: new Date(value).toLocaleTimeString() },
                    );
                });

                // Send message with embed and button
                await interaction.reply({ embeds: [embed], components: [], ephemeral: true });
            } else if (interaction.isButton()) {
                if (interaction.customId === 'cancel-check-out') {
                    // Check if user is the author of the message
                    if (interaction.user.username !== interaction.message.embeds[0].author.name) {
                        return interaction.reply({ content: 'You are not the author of this message! :thinking:', ephemeral: true });
                    } 

                    // Remove user from checked out list
                    checkOuts.delete(userId);
                    // Delete check-out message
                    await interaction.message.delete();
                }
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

                // Check if user has already checked in
                // if (!checkIns.has(userId)) {
                //     return interaction.reply({ content: 'You have not checked in today! :thinking:', ephemeral: true });
                // }

                // Add user to checked in list
                checkOuts.set(userId, Date.now());

                // Create message embed
                const today = new Date();
                // get today date with format: DD MMM YYYY
                const todayDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                const embed = new EmbedBuilder()
                    .setColor(0x00FFBE)
                    .setTitle('Check-Out')
                    .setAuthor({ name: user.displayName, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                    // .setThumbnail('https://i.imgur.com/Mcws4dp.jpeg')
                    .setDescription(`${today.toLocaleString('default', { weekday: 'long' })}, ${todayDate}`)
                    .addFields(
                        // { name: '\u200B', value: '\u200B' },
                        // { name: 'Name', value: user.displayName, inline: true },
                        { name: 'Check-out Time', value: today.toLocaleTimeString() },
                        { name: 'Activities', value: activitiesInput },
                    )
                    // .setTimestamp()
                    .setFooter({ text: 'Healstation' });

                // add button to to message that allows user to cancel check-out
                // const cancelCheckOutButton = new ButtonBuilder()
                //     .setCustomId('cancel-check-out')
                //     .setLabel('Cancel Check-out')
                //     .setStyle(ButtonStyle.Danger)
                //     .setDisabled(false);
                        
                // const row = new ActionRowBuilder().addComponents(cancelCheckOutButton);
                        
                // Send message with embed and button
                await interaction.reply({ embeds: [embed], components: [] });
            }
        }
    },
};
