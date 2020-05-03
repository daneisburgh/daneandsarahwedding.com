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
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isPasswordHashed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    passwordChangeCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    passwordChangeExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    emailVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    emailVerificationExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isEmailVerified: {
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
    isAttending: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    requiresAccommodations: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    totalRequiredRooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    requiresTransportation: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
};

class User extends Model {
    public username!: string;
    public name!: string;
    public address!: string;
    public password!: string;
    public isPasswordHashed!: boolean;
    public passwordChangeCode!: string;
    public passwordChangeExpiration!: Date;
    public email!: string;
    public emailVerificationCode!: string;
    public emailVerificationExpiration!: Date;
    public isEmailVerified!: boolean;
    public guests!: object;
    public maxGuests!: number;
    public isAttending!: boolean;
    public requiresAccommodations!: boolean;
    public totalRequiredRooms!: boolean;
    public requiresTransportation!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(userColumns, {
    sequelize,
    tableName: 'user',
    timestamps: false
});

User.beforeCreate(async (user: User) => {
    user.password = Math.random().toString(36).slice(2).substring(0, 5).toUpperCase();
});

User.beforeUpdate(async (user: User) => {
    user.updatedAt = new Date();
    
    if (user.changed('password')) {
        user.password = bcrypt.hashSync(user.password, 10);
        user.isPasswordHashed = true;
    }
});

export default User;