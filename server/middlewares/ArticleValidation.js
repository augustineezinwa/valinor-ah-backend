import UserValidation from './UserValidation';

const { sendFormattedError } = UserValidation;

/**
 * @class ValidationHelper
 * @description Helps perform validations on article request body.
 */
class ArticleValidation {
  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateTitle(req) {
    req.checkBody('title', 'please enter a title').exists();
  }

  /**
   * This method validates the description
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateDescription(req) {
    req.checkBody('description', 'please enter a description').exists();
  }

  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateBody(req) {
    req.checkBody('body', 'please enter a body').exists();
  }

  /**
   * Validate the Article input field
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The callback function to the next middleware.
   * @return {void}
   */
  static validateArticleInput(req, res, next) {
    ArticleValidation.validateTitle(req);
    ArticleValidation.validateDescription(req);
    ArticleValidation.validateBody(req);
    sendFormattedError(req, res, next);
  }
}

export default ArticleValidation;
