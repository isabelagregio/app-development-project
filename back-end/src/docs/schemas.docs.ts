/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: João da Silva
 *         birthday:
 *           type: string
 *           format: date
 *           example: 1990-01-01
 *         email:
 *           type: string
 *           example: joao@email.com
 *         password:
 *           type: string
 *           example: password123
 *
 *     Symptom:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         symptomOptionId:
 *           type: integer
 *           example: 2
 *         intensity:
 *           type: integer
 *           example: 3
 *         date:
 *           type: string
 *           format: date
 *           example: 2024-07-30
 *
 *     SymptomOption:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Dor de cabeça
 *
 *     CreateSymptomRequest:
 *       type: object
 *       required:
 *         - userId
 *         - symptomOptionId
 *         - intensity
 *         - date
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         symptomOptionId:
 *           type: integer
 *           example: 1
 *         intensity:
 *           type: integer
 *           example: 2
 *         date:
 *           type: string
 *           format: date
 *           example: 2024-07-30
 *
 *     CreateSymptomOptionRequest:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Dor de cabeça
 */
