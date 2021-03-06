import Sequelize from "sequelize";

const orderData = (sequelize, DataTypes) => {
  const order = sequelize.define("Order", {
    //주문번호
    order_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  order.associate = function (models) {
    models.User.hasMany(models.Order, {
      onDelete: "cascade",
      foreignKey: {
        name: "orderer_id",
        allowNull: false,
      },
      sourceKey: "email",
    });
  };
  return order;
};
export default orderData;
