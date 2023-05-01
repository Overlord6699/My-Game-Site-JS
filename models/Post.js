const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

const Post = sequelize.define('Post', {
    // Определение атрибутов модели
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url_key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true

    },
    published_date: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Post;
