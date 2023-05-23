const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('view-tasks')
		.setDescription('Ver las tareas'),

	async execute(interaction) {
		try {
			const id = interaction.user.id;
			// COMPROBRAR SI EL USUARIO EXISTE
			const userExist = db.prepare(` 
                  SELECT * FROM users 
                  WHERE user_id = ?
              `).get(id);
			if (!userExist) return await interaction.reply(`!Ups! <@${id}> Tu usuario no se encuentra`);
			// Comprobar si existe tareas
			const tasksExist = db.prepare(` 
                  SELECT * FROM tasks 
                  WHERE user_id = ?
              `).all(id);
			if (!tasksExist) return await interaction.reply(`!Ups! <@${id}>  No tienes tareas agendadas`);
			await interaction.user.send(`<@${id}> Sus tareas son:`);
			interaction.reply(`<@${id}> Tareas enviadas exitosamente`);
			tasksExist.forEach(async iterator => {
				await interaction.user.send(iterator);
			});
		}
		catch (error) {
			console.log(error);
		}
	},
};
