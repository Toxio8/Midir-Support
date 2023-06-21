const { EmbedBuilder } = require('discord.js');
const os = require('os');
const Discord = require('discord.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('statistics')
    .setDescription('Avoir les statistic du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
     
    
    async execute(interaction, config) {
        const messageembed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.client.user.username,
                        iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTitle(interaction.client.user.username + '\' statistiques:')
                    .addFields(
                        { name: "Nom", value: interaction.client.user.tag, inline: true },
                        { name: "Identification", value: `\`${interaction.client.user.id}\``, inline: true },
                        { name: "Commande D'application", value: `${interaction.client.commands.size} Commandes`, inline: true },
                        { name: "Total des serveur rejoins", value: `${interaction.client.guilds.cache.size} serveur`, inline: true },
                        { name: 'Auteur', value: `${require('../../package.json').author || "Toxio#1234"}`, inline: true },
                        { name: "Language", value: "JavaScript", inline: true },
                        { name: 'Derniere Version', value: `${require('../../package.json').version}`, inline: true },
                        { name: 'Version de discord.js', value: `${require('../../package.json').dependencies['discord.js'].replace('^', '')}`, inline: true },
                        { name: "Version de node.js", value: `${process.version}`, inline: true },
                        { name: "Mémoire vive", value: `${(os.totalmem() / 1024 / 1024).toFixed().substr(0, 2)}GB (${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}% utilser)`, inline: true },
                        { name: "Processeur", value: `${os.cpus().map(i => `${i.model}`)[0]}`, inline: true },
                        { name: "Platforme", value: `${os.platform}`, inline: true },
                    )
                    .setColor('Blurple')
        return interaction.reply({
            embeds: [messageembed]
        });
    }
};