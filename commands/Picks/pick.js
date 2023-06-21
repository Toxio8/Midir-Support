const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();
const mysql = require('mysql');
const config = require('../../Configurations/bdd');
const pseudo = require('./pseudo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pick')
        .setDescription('Commande PickCreate')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Nombre de membres')
                .setRequired(true)
        ),
    async execute(interaction) {
        const db = mysql.createConnection(config);
        const ID = interaction.options.getString('id')
        const nombre = interaction.options.getNumber('number');

        db.query(`SELECT * FROM picks WHERE ID = '${ID}'`, async (err, req) => {
            if (req.length < 1) {
                return interaction.reply({ content: "Désolé mais il n'y a aucun Pick avec cet ID !", ephemeral: true });
            }

            db.query(`SELECT * FROM picks WHERE ID = '${ID}' LIMIT ${nombre}`, async (err, req) => {
                db.query(`SELECT * FROM pseudo WHERE userID = '${interaction.user.id}'`, async (err, res) => {
                    if (res.length < 1) {
                    }
                    console.log(res)
                    const membres = req.map(row => `<@${row.userID}> (${res[0].pseudo})`).join(',\n');
                    const membre2 = req.map(row => row.userID)

                    await interaction.reply({ content: "Vous venez de faire la séléction !", ephemeral: true });
                    //await interaction.channel.send({content: `${test}`})

                    interaction.guild.channels.create({
                        type: 0,
                        name: `LISTE -\`${ID}\``,
                        parent: '1118981860849094696'
                    }).then(channel => {
                        channel.send({
                            content: `${membres}`, 
                            
                        })
                    });

                    interaction.guild.roles.create({
                        name: `${ID}`,
                        color: 0x00FF00
                    }).then(role => {
                        for (let i = 0; i < membre2.length; i++) {
                            const membre3 = interaction.guild.members.cache.get(membre2[i])
                            membre3.roles.add(role)
                        }
                    })
                })

            });
        });
    },
};

