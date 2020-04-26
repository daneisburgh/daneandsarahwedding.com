import { Model, DataTypes } from 'sequelize';

import sequelize from '../sequelize';
import User from './user';

export const emailColumns = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        }
    },
    template: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date
    }
}

class Email extends Model {
    public id!: number;
    public username!: string;
    public template!: string;
    public text!: string;
    public createdAt!: Date;
}

Email.init(emailColumns, {
    sequelize,
    tableName: 'email',
    timestamps: false
});

export default Email;