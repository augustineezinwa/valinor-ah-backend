import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';


chai.should();

chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';
const articleBaseUrl = '/api/v1/articles';
const verifyUserUrl = '/api/v1/users/verify?token=';
let articleId;
let commentId;

const userData = {};

describe('Testing comment on articles', () => {
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        email: 'abiodun.abud@andela.com'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.user.token.should.be.a('string');
        res.body.user.fullName.should.be.a('string');
        res.body.user.email.should.be.a('string');
        res.body.user.fullName.should.be.eql('Solomon Kingsley');
        res.body.user.confirmEmail.should.be.eql(false);
        res.body.user.email.should.be.eql('abiodun.abud@andela.com');
        userData.id = res.body.user.id;
        userData.token = res.body.user.token;
        done();
      });
  });
  it('POST /article/:articleId/comments add new comment', () => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('authorization', userData.token)
      .send({
        body: 'Working as expected'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.comment.should.be.a('object');
        res.body.comment.body.should.be.a('string');
        res.body.comment.commentBy.should.be.a('object');
      });
  });
  it('POST /article/:articleId/comments should not add new comment', () => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('authorization', userData.token)
      .send({
        commentBody: 'Working as expected'
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.errors.should.be.a('object');
      });
  });
});
describe('Testing like or disliked comment', () => {
  articleId = 10;
  commentId = 1;
  it('should not like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.errors.message.should.be.eql(
          'please confirm your email then try again'
        );
        done();
      });
  });
  it('should not dislike comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.errors.message.should.be.eql(
          'please confirm your email then try again'
        );
        done();
      });
  });
  it('Should GET /api/users/verify?token=', (done) => {
    chai.request(app)
      .get(
        `${verifyUserUrl}${userData.token}`
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('user successfully verified');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully liked');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql(
          'you changed your mind, comment successfully disliked'
        );
        done();
      });
  });
  it(
    'Should undo like',
    (done) => {
      chai.request(app)
        .post(
          `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
        )
        .set('authorization', userData.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql(
            'you changed your mind, comment successfully liked'
          );
          done();
        });
    }
  );
  it('Should not like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', `${userData.token}s`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.message.should.be.eql('invalid token!');
        done();
      });
  });
  it('Should dislike comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully disliked');
        done();
      });
  });
  it('Should undo dislike', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment dislike reversed successfully');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully liked');
        done();
      });
  });
  it('Should not dislike', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          ${commentId}/reaction/dislikes`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('failure');
        res.body.errors.message.should.be.eql(
          'unknown action, you may either like or dislike only'
        );
        done();
      });
  });
});
