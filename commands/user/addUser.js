const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-user')
		.setDescription('Add an user!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Your name')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('last-name')
				.setDescription('Your last name')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('email')
				.setDescription('Your email')
				.setRequired(true),
		),

	async execute(interaction) {
		try {
			const name = interaction.options.getString('name');
			const lastName = interaction.options.getString('last-name');
			const email = interaction.options.getString('email');
			const id = interaction.user.id;

			const statement = db.prepare(` 
            INSERT INTO users (user_id, first_name, last_name, email)
            VALUES(?, ?, ?, ?)
        `);

			statement.run(id, name, lastName, email);
			await interaction.reply(`<@${id}> your register has been successful`);
			await interaction.user.send(`Hi, <@${id}> tu email es ${email} y tu username es ${name}`);
		}
		catch (error) {
			if (error.message === 'UNIQUE constraint failed: users.user_id') {
				await interaction.reply(`<@${interaction.user.id}> Tu usuario ya está registrado`);
			}
		}
	},
};

