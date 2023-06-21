const { EmbedBuilder } = require("@discordjs/builders")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Avoir les statistic du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Le message a envoyer ')
            .setRequired(true)
    ),


    
    async execute(interaction) {
        const messageEmb = interaction.options.getString(`message`)
        const messageEmbed = new EmbedBuilder()
            .setDescription(messageEmb)
        
        
        interaction.channel.send({embeds: [messageEmbed]})
    }




}