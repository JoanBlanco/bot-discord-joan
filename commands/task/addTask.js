const { SlashCommandBuilder } = require('discord.js');
const { DateTime } = require('luxon');
const db = require('../../db/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-task')
		.setDescription('Add new task!')
		.addStringOption(option =>
			option.setName('task-name')
				.setDescription('Nombre de la tarea o descripción')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('task-date')
				.setDescription('Fecha de la tarea a agendar, formato YYYY-MM-DD')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('task-time')
				.setDescription('Hora de la tarea a agendar, formato 24 horas')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			// Variables
			const taskName = interaction.options.getString('task-name');
			const taskDate = interaction.options.getString('task-date');
			const taskTime = interaction.options.getString('task-time');
			const id = interaction.user.id;
			// COMPROBRAR SI EL USUARIO EXISTE
			const userExist = db.prepare(` 
                  SELECT * FROM users 
                  WHERE user_id = ?
              `).get(id);

			if (!userExist) return await interaction.reply(`!Ups! <@${id}> tu usuario no se encuentra`);
			// Date
			const dateAgend = DateTime.fromFormat(`${taskDate} ${taskTime}`, 'yyyy-MM-dd HH:mm');

			// Validaciones
			if (taskName.trim().length > 30) return await interaction.reply(`<@${id}> El nombre de la tarea debe contener un máximo de 30 caracteres`);

			if (!dateAgend.isValid) {
				await interaction.reply(`<@${id}>  Formato de hora o fecha inválida, esta debe ser yyyy-mm-dd`);
				await interaction.user.send(`<@${id}> No se pudo agendar la tarea`);
				return;
			}

			// Conversión a milisegundos
			const milliseconds = dateAgend.toMillis();
			const diffTime = dateAgend.diffNow().as('milliseconds');
			if (diffTime <= 0) return await interaction.reply(`<@${id}> Fecha incorrecta`);

			// Insertar tarea en la db
			const statement = db.prepare(` 
             INSERT INTO tasks (created_at, content, user_id)
             VALUES(?, ?, ?)
         `);
			statement.run(milliseconds, taskName, id);
			await interaction.reply(`<@${id}> tarea agendada`);

			// Función que elimina la tarea al llegar la fecha
			const dateMesagge = async () => {
				await interaction.user.send(`<@${id}> notificación de ${taskName}`);
				const deleteTime = db.prepare(` 
				DELETE FROM tasks 
				WHERE created_At = ?
         		`);
				deleteTime.run(milliseconds);
			};

			setTimeout(() => dateMesagge(), diffTime);
		}
		catch (error) {
			console.log(error);
			await interaction.reply(`<@${interaction.user.id}> Ha ocurrido un error al agendar la tarea`);
		}
	},
};
