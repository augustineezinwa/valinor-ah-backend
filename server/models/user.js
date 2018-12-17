export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'https://bit.ly/2UT01ax',
    },
    facebookId: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    twitterId: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    googleId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    bio: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    notification: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    confirmEmail: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    articlesRead: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    twitterUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    facebookUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    following: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followers: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  });

  User.associate = (models) => {
    const {
      Article,
      ArticleLike,
      Role,
      Comment,
      Rating,
      CommentLike,
      Follow,
      Bookmark,
      ReadingStats,
      ReportHistory,
      CommentReply,
      NotificationEvent
    } = models;

    User.belongsTo(Role, {
      foreignKey: 'roleId'
    });

    User.hasMany(Article, {
      as: 'publishedArticles',
      foreignKey: 'userId'
    });

    User.hasMany(Rating, {
      foreignKey: 'userId'
    });

    User.hasMany(ArticleLike, {
      foreignKey: 'userId'
    });

    User.hasMany(Comment, {
      foreignKey: 'userId'
    });

    User.hasMany(CommentLike, {
      foreignKey: 'userId'
    });

    User.belongsToMany(User, {
      as: 'authorId',
      through: Follow,
      foreignKey: 'authorId'
    });

    User.belongsToMany(User, {
      as: 'followerId',
      through: Follow,
      foreignKey: 'followerId'
    });
    User.belongsToMany(User, {
      as: 'receiverId',
      through: NotificationEvent,
      foreignKey: 'receiverId'
    });
    User.belongsToMany(User, {
      as: 'senderId',
      through: NotificationEvent,
      foreignKey: 'senderId'
    });
    User.hasMany(Bookmark, {
      as: 'myBookmarks',
      foreignKey: 'userId'
    });

    User.hasMany(ReadingStats, {
      foreignKey: 'userId'
    });

    User.hasMany(ReportHistory, {
      as: 'author',
      foreignKey: 'authorId'
    });

    User.hasMany(ReportHistory, {
      as: 'reporter',
      foreignKey: 'reporterId'
    });

    User.hasMany(CommentReply, {
      foreignKey: 'commentId',
      as: 'commenter',
    });
  };

  return User;
};
