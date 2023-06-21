const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const mysql = require('mysql');
const config = require('../../Configurations/bdd');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pseudo')
        .setDescription('Commande enregistrer son pseudo minecraft')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('change').setDescription('Souhaitez vous changez votre pseudo ?').setRequired(true).addChoices({ name: "Oui !", value: 'oui' }, { name: "Non !", value: 'non' }))
        .addStringOption(option => option.setName('pseudo').setDescription('votre pseudo minecraft').setRequired(true)),

    async execute(interaction) {
        const db = mysql.createConnection(config);
        const pseudo = interaction.options.getString('pseudo');
        const choix = interaction.options.getString('change');

        if (choix === 'oui') {
            db.query(`SELECT * FROM pseudo WHERE userID = '${interaction.user.id}'`, async (err, req) => {
                if (req.length < 1) {
                    return interaction.reply({ content: "Vous n'êtes pas enregistré dans la base de donnée !", ephemeral: true })
                } else {
                    db.query(`UPDATE pseudo SET pseudo = '${pseudo}' WHERE userID = '${interaction.user.id}'`)
                    await interaction.reply({ content: "Vous venez de changer votre pseudo !", ephemeral: true })
                }
            })
        } else {
            db.query(`SELECT * FROM pseudo WHERE userID = '${interaction.user.id}'`, async (err, req) => {
                if (req.length < 1) {
                    db.query(`INSERT INTO pseudo (userID, pseudo) VALUES ('${interaction.user.id}', '${pseudo}')`)
                    return interaction.reply({content: "Vous venez d'être enregistré dans la base de donnée !", ephemeral: true})
                } else {
                    return interaction.reply({content: "Vous êtes déjà inscrit dans la base de donnée !", ephemeral: true})
                }
            })
        }
    }
}