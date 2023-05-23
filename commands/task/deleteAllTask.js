const { SlashCommandBuilder } = require('discord.js');

const db = require('../../db/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-all-tasks')
		.setDescription('Delete-all-tasks')
		.addStringOption(option =>
			option.setName('answer')
				.setDescription('Answer with yes or no')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			const id = interaction.user.id;
			// COMPROBAR RESPUESTA
			if (interaction.options.getString('answer').toLowerCase() === 'no') return await interaction.reply(`<@${id}> se ha cancelado la operación!`);
			// COMPROBRAR SI EL USUARIO EXISTE
			const userExist = db.prepare(` 
                  SELECT * FROM users 
                  WHERE user_id = ?
              `).get(id);

			if (!userExist) return await interaction.reply(`!Ups! <@${id}> tu usuario no se encuentra`);

			const statement = db.prepare(` 
                  DELETE FROM tasks
                  WHERE user_id = ?
              `);

			statement.run(id);
			await interaction.user.send(`Hi, <@${id}> todas tus tareas han sido eliminadas`);
			await interaction.reply(`<@${id}>. Tus tareas han sido eliminadas`);
		}
		catch (error) {
			console.log(error);
		}
	},
};
