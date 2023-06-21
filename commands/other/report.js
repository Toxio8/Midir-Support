const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report ')
    .addUserOption(option =>
        option.setName('joueur')
            .setDescription('Le Joueur')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('raison')
            .setDescription('La raison')
            .setRequired(true)
    ),



    async execute(interaction) {
        
        let user =  interaction.options.getUser('joueur')
        let reason =  interaction.options.getString('raison')
        let userint = interaction.user.username

        let embed2 = new EmbedBuilder()
            .addFields({name: `Votre report a bien etait pris en compte`, value: `Vous avez report ${user} pour la raison suivante : ${reason} `})

        let embed1 = new EmbedBuilder()
            .setTitle('Report')
            .addFields({name: `Joueur report par ${userint}: ` , value: `${user}`},
                       {name: 'Raison:' , value: `${reason}`})
        


        interaction.client.channels.cache.get('1121122222648594542').send({ embeds: [embed1] })
        interaction.reply({embeds: [embed2], ephemeral: true}) 
    }
}