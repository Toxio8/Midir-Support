const Discord = require('discord.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  .setName('suggestion')
  .setDescription('Commande suggestion ')
  .addStringOption(option =>
      option.setName('message')
          .setDescription('La suggestion')
          .setRequired(true)
  ),

    
    async execute( interaction, args) {
        const channelmsg = interaction.guild.channels.cache.get('1117493621013348402');
        
            if(interaction.channelId === `${channelmsg.id}`) {

                let messages = args.getString('message')
                    const Embedsegges = new Discord.EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle(`Suggestion de ${interaction.user.username}`)
                    .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`Suggestion : **${messages}**`)
                    .setTimestamp()
                    channelmsg.send({ embeds: [Embedsegges]}).then(msg => {
                        msg.react("✅")
                        msg.react("❌") 
                    })
                    return interaction.reply({content:`Votre suggestion a bien etais envoyer dans le channel ${channelmsg}`, ephemeral: true})
            } else {
                return interaction.reply({content:`Votre suggestion n'a pas pue etre prise en compte veulliez aller dans le channel ${channelmsg}`,ephemeral: true})
            }
        }
        
}      
