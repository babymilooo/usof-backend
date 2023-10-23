const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Обеспечивает уникальность логина
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Обеспечивает уникальность email
      validate: {
        isEmail: true, // проверка на правильность email
      }
    },
    profilePicture: {
      type: DataTypes.STRING, // Может хранить URL изображения
      allowNull: true, // предположим, что фотография профиля не обязательна
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // рейтинг по умолчанию
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // роль по умолчанию
    }
  },
    {
      timestamps: false,
      // Хук для хэширования пароля перед сохранением пользователя
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10); //модифицируйте сложность по желанию
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      }
    });

  // Здесь можно добавить хуки, методы или связи, если они потребуются

  return User;
};
