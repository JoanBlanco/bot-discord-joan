const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-user')
		.setDescription('Delete an user!')
		.addStringOption(option =>
			option.setName('answer')
				.setDescription('Answer with yes or no')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			const getAnswer = interaction.options.getString('answer').toLowerCase();
			const id = interaction.user.id;

			if (getAnswer === 'no') return await interaction.reply(`<@${id}>, tu operación ha sido cancelado!`);

			const userExist = db.prepare(` 
            SELECT * FROM users
            WHERE user_id = ?
            `).get(id);

			if (!userExist) {
				await interaction.reply(`<@${id}>, tu usuario no se encuentra`);
				await interaction.user.send(`Hi, <@${id}> tu usuario no ha sido eliminado`);
				return;
			}
			if (getAnswer === 'yes') {
				const statement = db.prepare(` 
                DELETE FROM users
                WHERE user_id = ?
                `);
				statement.run(id);
				await interaction.reply(`<@${id}>, tu usuario ha sido eliminado`);
				await interaction.user.send(`Hi, <@${id}> tu usuario ha sido eliminado`);
			}
		}
		catch (error) {
			if (error.message === 'UNIQUE constraint failed: users.user_id') {
				await interaction.reply(`<@${interaction.user.id}> Ha ocurrido un error`);
			}
		}
	},
};

