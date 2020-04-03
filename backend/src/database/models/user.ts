import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize';

export const userColumns = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    guests: {
        type: DataTypes.JSON,
        allowNull: true
    },
    isComing: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    needsTransportation: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}

class User extends Model {
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public name!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public passwordResetToken!: string;
    public passwordResetExpiration!: Date;
    public guest!: object;
    public isComing!: boolean;
    public needsTransportation!: boolean;
}

User.init(userColumns, {
    sequelize,
    tableName: 'user'
});

export default User;