const Sequelize = require('sequelize');

/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue on the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize
	.sync({ force })
	.then(async () => {
		const shop = [
			CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
			CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
			CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
		];

		await Promise.all(shop);
		console.log('Database synced');

		sequelize.close();
	})
	.catch(console.error);
