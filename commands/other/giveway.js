const Discord = require("discord.js");
const ms = require('ms');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('giveway')
  .setDescription('Commande Giveway ')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption(option =>
      option.setName('duration')
          .setDescription('La duration du giveaway (e.g. 1h)')
          .setRequired(true)
  )
  .addNumberOption(option =>
      option.setName('winners')
          .setDescription('Le nombre de winners')
          .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('prize')
        .setDescription('Récompenses')
        .setRequired(true)
),
  

  async execute (interaction) {
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getNumber('winners');
    const prize = interaction.options.getString('prize');
  
    let participants = [];
  
    
    const durationMs = ms(duration);
    const endTime = Date.now() + durationMs;
  
    const embed = new Discord.EmbedBuilder()
      .setColor('#d100ff')
      .setTitle(`Giveaway: ${prize}`)
      .setDescription(`Clique sur les boutons ci-dessous pour participer ou quitter !\nDurée: **${duration}**\nNombre de gagnants: **${winners}**`)
      .setFooter({text: `=====================\nToxio Bot © 2023`})
  
    const joinButton = new Discord.ButtonBuilder()
      .setCustomId('join')
      .setLabel('🎉 Participer')
      .setStyle('Success');
  
    const leaveButton = new Discord.ButtonBuilder()
    .setCustomId('leave')
    .setLabel('❌ Quitter')
    .setStyle('Danger');
  
    const rerollButton = new Discord.ButtonBuilder()
    .setCustomId('reroll')
    .setLabel('🔄 Reroll')
    .setStyle('Primary');
  
    const buttonRow = new Discord.ActionRowBuilder()
      .addComponents(joinButton, leaveButton);
  
    const message = await interaction.reply({ embeds: [embed], components: [buttonRow], fetchReply: true });
  
    const updateInterval = setInterval(() => {
      const timeLeftMs = endTime - Date.now();
      if (timeLeftMs <= 0) {
        clearInterval(updateInterval);
        return;
      }
      embed.setDescription(`**Giveway**\n\n**Temps restant:** **\`${ms(timeLeftMs, { long: true })}\`**\n**Nombre de gagnants:** **\`${winners}\`**\n\n**Participants:** **${participants.length}**`);
      message.edit({ embeds: [embed], components: [buttonRow] });
    }, 1000);
  
    const filter = (interaction) => (interaction.customId === 'join' || interaction.customId === 'leave') && interaction.user.id !== interaction.client.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: durationMs });
  
    collector.on('collect', (interaction) => {
      const user = interaction.user;
  
      if (interaction.customId === 'join') {
        if (participants.includes(user.id)) {
          interaction.reply({ content: `**Tu participes déjà au giveaway !**`, ephemeral: true });
        } else {
          participants.push(user.id);
          interaction.reply({content : `**Tu participes maintenant au giveaway pour** **${prize}** !`, ephemeral: true });
        }
      }
  
      if (interaction.customId === 'leave') {
        if (participants.includes(user.id)) {
          participants = participants.filter((id) => id !== user.id);
          interaction.reply({ content: `**Tu as quitté le giveaway pour** **${prize}** !`, ephemeral: true });
        } else {
          interaction.reply({ content: `**Tu ne participes pas au giveaway !**`, ephemeral: true });
        }
      }

      const joinButtonDisabled = joinButton.setDisabled(participants.length >= 10);
      const leaveButtonDisabled = leaveButton.setDisabled(!participants.includes(user.id));
  
      buttonRow.components = [joinButtonDisabled, leaveButtonDisabled];
  
      message.edit({ components: [buttonRow] });
    });
  
    collector.on('end', () => {
      // Choisir des gagnants
      const winnersArray = participants.sort(() => Math.random() - 0.5).slice(0, winners);
  
      // Annoncer les gagnants
      let winnerString = "";
      for (let i = 0; i < winnersArray.length; i++) {
        const winner = interaction.client.users.cache.get(winnersArray[i]);
        winnerString += `${winner}\n`;
      }
  
      const rerollButtonRow = new Discord.ActionRowBuilder()
        .addComponents(rerollButton);
  
      embed.setDescription(`**Le giveaway est terminé ! GG aux gagnants :\n${winnerString}\nRejoins-nous vite en ticket pour récupérer ton prix !**`);
      //embed.setImage("Votre Image")
      message.edit({ embeds: [embed], components: [rerollButtonRow] });
  
      const rerollFilter = (interaction) => interaction.customId === 'reroll' && interaction.user.id !== interaction.client.user.id;
      const rerollCollector = message.createMessageComponentCollector({ filter: rerollFilter });

  
      rerollCollector.on('collect', (interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
          interaction.reply({ content: `**Tu n'as pas les permissions pour reroll le giveaway !**`, ephemeral: true });
          return;
        }
  
        const newWinnersArray = participants.sort(() => Math.random() - 0.5).slice(0, winners);
  
        let newWinnerString = "";
        for (let i = 0; i < newWinnersArray.length; i++) {
          const winner = interaction.client.users.cache.get(newWinnersArray[i]);
          newWinnerString += `${winner}\n`;
        }
  
        embed.setDescription(`**Le giveaway a été reroll ! GG aux nouveaux gagnants :\n${newWinnerString}\nRejoins-nous vite en ticket pour récupérer ton prix !**`);
        message.edit({ embeds: [embed] });
        interaction.reply({ content: `**Le giveaway a été reroll avec succès !**`, ephemeral: true });
      });
    });
  }
};  