import bcrypt from 'bcryptjs';
import { Model, DataTypes } from 'sequelize';

import sequelize from '../sequelize';

export const userColumns = {
    username: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPasswordHashed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    emailConfirmationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    guests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    maxGuests: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isAttending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    needsAccommodation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    totalRooms: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    needsTransportation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date,
        allowNull: false
    }
};

class User extends Model {
    public username!: string;
    public name!: string;
    public address!: string;
    public password!: string;
    public isPasswordHashed!: boolean;
    public passwordResetToken!: string;
    public passwordResetExpiration!: Date;
    public email!: string;
    public emailConfirmationToken!: string;
    public isEmailConfirmed!: boolean;
    public guests!: object;
    public maxGuests!: number;
    public isAdmin!: boolean;
    public isAttending!: boolean;
    public needsAccommodation!: boolean;
    public totalRooms!: boolean;
    public needsTransportation!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(userColumns, {
    sequelize,
    tableName: 'user'
});

User.beforeCreate(async (user: User) => {
    user.password = Math.random().toString(36).slice(2).substring(0, 5).toUpperCase();
});

User.afterUpdate(async (user: User) => {
    user.updatedAt = new Date;
    
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, 10);
    }
});

export default User;