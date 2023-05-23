const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greeting')
		.setDescription('Presentacion del robot!'),
	async execute(interaction) {
		await interaction.reply('Hi!');
		await interaction.followUp(`Welcome to task-server, <@${interaction.user.id}>.`);

		interaction.user.send(`Hi, <@${interaction.user.id}>.`);

	},
};