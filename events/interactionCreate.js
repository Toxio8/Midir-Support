const { Events } = require('discord.js');
const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const discordTranscripts = require("discord-html-transcripts");
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client, bot) {
        if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			try {
				await command.execute(interaction, interaction.options, client);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		};

        if(interaction.isButton()) {
            if(interaction.customId === "close") {
              const EmbedPermissionClose = new EmbedBuilder()
              .setColor("#3dffcc")
              .setDescription(`❌ Vous n'avez pas la permission requise !`)
         
              if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return interaction.reply({embeds: [EmbedPermissionClose], ephemeral: true})
         
              const EmbedCloseTicket = new EmbedBuilder()
              .setColor("#3dffcc")
              .setDescription(`Êtes-vous sûr de vouloir fermer le ticket ?`)
              const Button = new ActionRowBuilder()
              .addComponents(new ButtonBuilder()
                .setCustomId('oui')
                .setLabel("Oui")
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('non')
                .setLabel("Non")
                .setStyle(ButtonStyle.Danger),
              );
              await interaction.reply({embeds: [EmbedCloseTicket], components: [Button]});
            }
            else if(interaction.customId === "oui") {
              const EmbedPermissionClose = new EmbedBuilder()
              .setColor("#3dffcc")
              .setDescription(`❌ Vous n'avez pas la permission requise !`)
         
              if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return interaction.reply({embeds: [EmbedPermissionClose], ephemeral: true})
              const channel = interaction.channel
              let name = interaction.channel.name
              let modif;
              if(name.includes("discord")) {
              modif = name.substring(8)
              } else if(name.includes("minecraft")) {
                modif = name.substring(10)
              } else if(name.includes("boutique")) {
                modif = name.substring(9)
              } else if(name.includes("autre")) {
                modif = name.substring(6)
              }
              const user = interaction.guild.members.cache.get(modif)
              const transticket = await discordTranscripts.createTranscript(channel)
              try {
                await user.send({content: `Votre ticket à été fermé par ${interaction.user.tag}, Voici le transcript si vous avez eu un probleme`, files: [transticket]})
                } catch (err){console.log(err)}
                await interaction.reply({content: "Le ticket se fermera dans 5 secondes"})

              setInterval(() => {
                interaction.channel?.delete();
              }, 5000);
            }
            else if(interaction.customId === "non") {
              const EmbedPermissionClose = new EmbedBuilder()
              .setColor("#3dffcc")
              .setDescription(`❌ Vous n'avez pas la permission requise !`)
         
              if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return interaction.reply({embeds: [EmbedPermissionClose], ephemeral: true})
         
              interaction.message.delete()
            
            }
          }
      
          
        if(interaction.isStringSelectMenu()) {
          if(interaction.customId === 'menuticket') {
              if(interaction.values == 'minecraft', 'discord', 'boutique', 'autre') {
        const EmbedTicket1 = new EmbedBuilder()
                .setColor("#3dffcc")
                .setTitle(`Comment créer un ticket ?`)
                .setDescription(`Pour créer un ticket, il vous suffit juste de cliquer sur le menu déroulant ci-dessous et de sélectionner la catégorie qui convient le mieux à votre demande d'aide !\n- Pas de mentions sauf si vous n'avez pas reçu de réponse sous 24h.\n- Pas de spam.\n- Ne pas créer de ticket pour des trucs qui ne servent a rien.`)
                .setTimestamp()
                .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({dynamic: true}) });
         
                const RowTicket = new ActionRowBuilder()
                  .addComponents(
                  new StringSelectMenuBuilder()
                  .setCustomId('menuticket')
                  .setPlaceholder('Sélectionner le type de ticket que vous voulez !')
                  .addOptions(
                    {
                        label: `Discord`,
                        description: `Ouvrir un ticket pour le Discord`,
                        emoji: `MidirVoice:1120425800257257542`,
                        value: `discord`,
                      },
                      {
                        label: `Minecraft`,
                        description: `Ouvrir un ticket pour Minecraft`,
                        emoji: `MidirGame:1120425802215981236`,
                        value: `minecraft`,
                      },
                      {
                        label: `Boutique`,
                        description: `Ouvrir un ticket pour la Boutique`,
                        emoji: `MidirShop:1120425803587518515`,
                        value: `boutique`,
                      },
                      {
                        label: `Autre`,
                        description: `Ouvrir un ticket pour autre choses`,
                        emoji: `MidirCommunity:1120425799061880872`,
                        value: `autre`,
                      }
                  ),
                );
                await interaction.deferUpdate();
                await interaction.editReply({embeds: [EmbedTicket1], components: [RowTicket]})
         
                let channel = await interaction.guild.channels.create({
                parent: "1117526934360948776",
                name: `${interaction.values}-\-\-\-\--${interaction.user.id}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                  {
                    id: interaction.guild.roles.everyone,
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: interaction.user,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                  },
                  {
                    id: '1117507870376857792',
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.ManageMessages],
                  },
                ],
                });
                const EmbedCreateChannel = new EmbedBuilder()
                .setColor("#3dffcc")
                .setTitle('Ticket ouvert')
                .setDescription("<@" + interaction.user.id +  "> Voici votre ticket.\nExpliquez-nous en détail la raison pour la quel vous avez ouvert votre ticket")
                .setTimestamp()
                .setFooter({ text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL({dynamic: true}) });
                const Row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                  .setCustomId('close')
                  .setLabel('Fermer le ticket')
                  .setEmoji('🗑️')
                  .setStyle(ButtonStyle.Danger),
              );
         
         
                await channel.send({content: `<@&1117507870376857792>`,embeds: [EmbedCreateChannel], components: [Row]})
         
                const EmbedSuccessCreateChannel = new EmbedBuilder()
                .setColor("#3dffcc")
                .setDescription(`✅ Votre salon a été créé avec succès ${channel} !`)
         
                await interaction.followUp({embeds: [EmbedSuccessCreateChannel], ephemeral: true})
              }
            }
        }

	}
}   



        
