const Discord = require('discord.js')
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  .setName('user-info')
  .setDescription('Avoir les info du joueurs ')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addUserOption(option =>
      option.setName('user')
          .setDescription("L'utilisateur")
          .setRequired(false)
  ),

    
    async execute(interaction) {
        let user = await interaction.options.getUser('utilisateur')
        if (!user) user = interaction.user
        const userFlags = await user.fetchFlags().then(e => e.toArray());
        let s;
        if (userFlags.size > 1) { s = "Badges" } else { s = "Badge" };

        const flags = {
            Staff: 'Staff',
            Partner: 'Partner',
            BugHunterLevel1: 'BugHunterLevel1',
            BugHunterLevel2: 'BugHunterLevel2',
            HypeSquadOnlineHouse1: 'HypeSquadBravery',
            HypeSquadOnlineHouse2: 'HypeSquadBrilliance',
            HypeSquadOnlineHouse3: 'HypeSquadBalance',
            PremiumEarlySupporter: 'PremiumEarlySupporter',
            TeamPseudoUser: 'Équipe Discord',
            System: 'Système',
            VerifiedBot: 'VerifiedBot',
            VerifiedDeveloper: 'VerifiedDeveloper',
            CertifiedModerator: 'CertifiedModerator',
            ActiveDeveloper: 'ActiveDeveloper',
            Hypesquad: "Hypesquad",
            BotHTTPInteractions: "BotHTTPInteractions"
        };


        let presence = user ? user.presence ? user.presence.status : "Hors ligne" : "Inconnu";
        if (presence == "idle") presence = "🟡"; else if (presence == "Hors ligne") presence = "⚪"; else if (presence == "online") presence = "🟢"; else if (presence == "streaming") presence = "🟣"; else if (presence == "dnd") presence = "🔴"; else if (presence == "Inconnu") presence = "❓"

        let EmbedUserInfo = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`
        ➞ **__Information sur le membre__ ${user}**
        
        **Nom du Membre** : \`${user.username}\`
        **Surnom du Membre** : ${user ? user.nickname ? user.nickname : "❌" : "❓"}
        **ID** : \`${user.id}\`
        **TAG du Membre** : \`#${user.discriminator}\`
        **Avatar** : **[URL](${user.displayAvatarURL({ dynamic: true, size: 4096 })})**
        **Bannière du Membre** : **[URL](${await (await interaction.client.users.fetch(user.id, { force: true })).bannerURL({ dynamic: true, size: 4096 })})**
        **Est-ce un Bot** : ${user.bot ? "✅" : "❌"}
        **${s}** : ${userFlags.length ? userFlags.map(flag => flags[flag]).join(' ') : '❌'}
        **Status du Membre** : ${presence}
        **Date de Création du Membre** : <t:${Math.floor(user.createdAt / 1000)}:F> (<t:${Math.floor(user.createdAt / 1000)}:R>)`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setImage(await (await interaction.client.users.fetch(user.id, { force: true })).bannerURL({ dynamic: true, size: 4096 }))
            .setColor('DarkBlue')
            .setFooter({ text: "ToxioBot | by Toxio", iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })

        await interaction.reply({ embeds: [EmbedUserInfo], ephemeral: true })
    }
}
