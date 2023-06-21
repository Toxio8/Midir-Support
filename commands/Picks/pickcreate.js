const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
require('dotenv').config();
const mysql = require('mysql');
const config = require('../../Configurations/bdd');
const pick = require('../../Configurations/createId');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pickcreate')
        .setDescription('Commande PickCreate')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('host').setDescription('Host de la partie').setRequired(true))
        .addStringOption(option => option.setName('mdj').setDescription('Mode de jeux').setRequired(true))
        .addStringOption(option => option.setName('doc').setDescription('Document').setRequired(true))
        .addStringOption(option => option.setName('date').setDescription('Date').setRequired(true)),
    async execute(interaction) {
        const db = mysql.createConnection(config);
        const host = interaction.options.getString('host');
        const game = interaction.options.getString('mdj');
        const doc = interaction.options.getString('doc');
        const date = interaction.options.getString('date')
        const ID = pick("PICK");

        const button = new ButtonBuilder()
            .setCustomId('oui')
            .setEmoji('✔️')
            .setStyle(ButtonStyle.Success)

        const button2 = new ButtonBuilder()
            .setCustomId('non')
            .setEmoji('❌')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder()
            .addComponents(button, button2);

        await interaction.reply({ content: "Pickcreate effectué !", ephemeral: true });

        const ban = await interaction.channel.send({
            content: `**> - Host : ${host}\n> - Mode de jeux : ${game}\n> - Document : ${doc}\n\n> - Date : <t:${date}:f> (<t:${date}:R>)\n> - Pick : \`Pas Encore Effectué !\`\n\n> - Joueurs : 0\n\nID : \`${ID}\` \n\n Mention : @here**`,
            components: [row],
        });

        const time = 22 * 24 * 60 * 60 * 1000;
        const collector = ban.createMessageComponentCollector({ componentType: ComponentType.BUTTON, time });
        collector.on('collect', async i => {
            const userID = i.user.id;
            const customId = i.customId;

            const member = await interaction.guild.members.fetch(userID);
            const excludedRoles = ['1118660281116147722']; // role à modif(blacklist)

            if (member.roles.cache.some(role => excludedRoles.includes(role.id))) {
                i.reply({ content: "Vous n'êtes pas autorisé à effectuer cette action car vous blacklist.", ephemeral: true });
                return;
            }
        
            db.query(`SELECT choix FROM picks WHERE userID = '${userID}'`, async (err, rows) => {
                if (err) throw err;
        
                if (rows.length < 1) {
                    db.query(`INSERT INTO picks (ID, userID, choix) VALUES ('${ID}', '${userID}', '${customId}')`);
                } else {
                    const oldChoice = rows[0].choix;
        
                    if (oldChoice === customId) {
                        // L'utilisateur a déjà sélectionné ce choix, vous pouvez ignorer ou afficher un message
                        i.reply({ content: `Vous avez déjà sélectionné \`${customId.toUpperCase()}\``, ephemeral: true });
                    } else {
                        db.query(`UPDATE picks SET ID = '${ID}' WHERE userID = '${userID}'`);
                        db.query(`UPDATE picks SET choix = '${customId}' WHERE userID = '${userID}'`);
                        i.reply({ content: "Vous avez fait votre choix !", ephemeral: true })
                    }
                }
            });
        });

        setInterval(() => {
            db.query(`SELECT * FROM picks WHERE ID = '${ID}'`, async (err, req) => {
                if(req.length < 1) {
                    return;
                } else {
                    db.query(`SELECT COUNT(*) AS ouiCount FROM picks WHERE choix = 'oui' AND ID = '${ID}'`, async (err, req) => {
                        const ouiCount = req[0].ouiCount || 0;

                        db.query(`SELECT COUNT(*) AS nonCount FROM picks WHERE choix = 'non' AND ID = '${ID}'`, async (err, req) => {
                            const nonCount = req[0].nonCount || 0;

                            const content = `**> - Host : ${host}\n> - Mode de jeux : ${game}\n> - Document : ${doc}\n\n> - Date : <t:${date}:f> (<t:${date}:R>)\n> - Pick : \`Pas Encore Effectué !\`\n\n> - Joueurs : ${ouiCount}\n\nID : \`${ID}\` \n\n Mention : @here**`;

                            await ban.edit({
                                content: content,
                                components: [row],
                            });
                        })
                    })
                }
            })
        }, 1000);


    }
};

