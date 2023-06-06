const authmodel = (sequelize, Sequelize) => {
    const Auth = sequelize.define("auth", {
        id:{
            type:Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        username:{
            type:Sequelize.STRING(50),
            allowNull: false
        },
        password:{
            type:Sequelize.STRING(128),
            allowNull: false
        },
        /*salt:{
            type:Sequelize.STRING(32),
            allowNull: false
        },*/
        role: {
            type:Sequelize.STRING(1),
            allowNull: false,
            defaultValue: 'C',
            comment: 'C - Customer; A - Admin; U - Cambrian User'
        },
        status:{
            type:Sequelize.STRING(1),
            allowNull: false,
            comment: 'A - Active; D - Deleted'
        },
        created_by:{
            type:Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'admin'
        }
    }, {
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                name: 'username',
                unique: true,
                fields: ['username']
            }
        ]
    });

    return Auth;
};

module.exports = authmodel;