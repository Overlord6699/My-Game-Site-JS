const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../database')

const Product = sequelize.define('Product', {
    // Определение атрибутов модели
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
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
    features: {
        type: DataTypes.STRING,
        allowNull: false

    },
    published_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Product;
