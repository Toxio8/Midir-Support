const discordTranscripts = require("discord-html-transcripts");
const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Commande Ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
 
  async execute(interaction) {
    const EmbedTicket = new EmbedBuilder()
    .setColor("#3dffcc")
    .setDescription(`✅ L'embed des tickets à été envoyer avec succès !`)
 
    const EmbedTicket1 = new EmbedBuilder()
    .setColor("#3dffcc")
    .setTitle(`Comment créer un ticket ?`)
    .setDescription(`Pour créer un ticket, il vous suffit juste de cliquer sur le menu déroulant ci-dessous et de sélectionner la catégorie qui convient le mieux à votre demande d'aide !\n- Pas de mentions sauf si vous n'avez pas reçu de réponse sous 24h.\n- Pas de spam.\n- Ne pas créer de ticket pour des trucs qui ne servent a rien.`)
    .setTimestamp()
    .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({dynamic: true}) });
 
    const RowTicket = new ActionRowBuilder()
			.addComponents(
      new Discord.StringSelectMenuBuilder()
      .setCustomId('menuticket')
      .setPlaceholder('Sélectionner le type de ticket que vous voulez !')
      .addOptions(
        {
            label: `Discord`,
            description: `Ouvrir un ticket pour le Discord`,
            emoji: `<:MidirVoice:1120425800257257542>`,
            value: `discord`,
          },
          {
            label: `Minecraft`,
            description: `Ouvrir un ticket pour Minecraft`,
            emoji: `<:MidirGame:1120425802215981236>`,
            value: `minecraft`,
          },
          {
            label: `Boutique`,
            description: `Ouvrir un ticket pour la Boutique`,
            emoji: `<:MidirShop:1120425803587518515>`,
            value: `boutique`,
          },
          {
            label: `Autre`,
            description: `Ouvrir un ticket pour la Boutique`,
            emoji: `<:MidirCommunity:1120425799061880872>`,
            value: `autre`,
          }


      ),
    );
 
    await interaction.reply({embeds: [EmbedTicket], ephemeral: true})
    await interaction.channel.send({embeds: [EmbedTicket1], components: [RowTicket]})

    if(interaction.customId === 'closemodal'){

        let raisonclose = interaction.fields.getTextInputValue('raisonclose');
        let user = bot.users.cache.get(interaction.channel.topic)
        const channel = interaction.channel
        await interaction.reply({content: `préparation du transcript`, ephemeral: true})
        const transticket = await discordTranscripts.createTranscript(channel)
        try {
    await user.send({content: `Votre ticket à été fermé par ${interaction.user.tag} pour la/les raison(s) suivante : ${raisonclose}`, files: [transticket]})
    } catch (err){console.log(err)}

        await interaction.channel.delete()
    }
  }
}