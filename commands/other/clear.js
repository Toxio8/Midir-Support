const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Efface beaucoup de messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption(option =>
        option.setName('nombre')
            .setDescription('Le nombre de messages à supprimer')
            .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName('salon')
            .setDescription('Le salon où effacer les messages')
            .setRequired(true)
    ),


    async execute(bot, message, args) {

            let chiffre = args.getNumber("nombre")
            if(chiffre > 100) return message.reply({content: "Merci de rentré un chiffre inférieur à 100", ephemeral: true})
            let phrase = args.getString("phrase")
            if (isNaN(chiffre)) return message.reply({ content: `Merci de rentrer un nombre valide !`, ephemeral: true })

            if (!phrase) {
                message.channel.bulkDelete(chiffre, { filterOld: true }).then(async messages => {
                    let embed = new Discord.EmbedBuilder()
                        .setDescription(`
                    > **Nombre de messages supprimés :** \`${messages.size}/${chiffre} messages\`
                    `)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setFooter({ text: "CyberBytes | Toxio#1234", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
                    await message.reply({ embeds: [embed], ephemeral: true })
                })
            } else {
                message.channel.bulkDelete((await message.channel.message.fetch({ limit: chiffre })).filter(filterMSG => filterMSG.content.toLowerCase() === phrase.toLowerCase()), {
                    filterOld: true
                }).then(async (messages) => {
                    await message.reply({ content: `Je viens de supprimé ${messages.size}/${chiffre} messages`, ephemeral: true })
                    setTimeout(async () => {
                        await message.deleteReply();
                    }, 2000)
                })
            }
    }
}