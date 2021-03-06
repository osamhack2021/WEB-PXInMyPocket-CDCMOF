const userData = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: {
        name: "user_email",
        msg: "A user with this email already exists.",
      },
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    expire_date: {
      type: DataTypes.DATEONLY(11),
      allowNull: false,
    },
    rank: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    warning: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    //관리자 권한이면 authority가 1, 단순 사용자는 0
    authority: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  });
};
export default userData;
