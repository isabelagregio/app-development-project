/**
 * @swagger
 * /options/{userId}:
 *   get:
 *     summary: Retorna as opções de sintomas personalizadas do usuário
 *     tags:
 *       - Sintomas
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de opções de sintomas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SymptomOption'
 *       500:
 *         description: Erro ao buscar opções
 */
/**
 * @swagger
 * /options:
 *   post:
 *     summary: Cria uma nova opção de sintoma personalizada
 *     tags:
 *       - Sintomas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Dor de cabeça
 *     responses:
 *       201:
 *         description: Opção de sintoma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SymptomOption'
 *       500:
 *         description: Erro ao criar nova opção
 */
/**
 * @swagger
 * /:
 *   post:
 *     summary: Registra um sintoma para o usuário
 *     tags:
 *       - Sintomas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - symptomOptionId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               symptomOptionId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Sintoma registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Symptom'
 *       500:
 *         description: Erro ao registrar sintoma
 */
/**
 * @swagger
 * /{userId}:
 *   get:
 *     summary: Lista todos os sintomas registrados por um usuário
 *     tags:
 *       - Sintomas
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de sintomas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Symptom'
 *       500:
 *         description: Erro ao buscar sintomas
 */
/**
 * @swagger
 * /{userId}/today:
 *   get:
 *     summary: Lista os sintomas registrados pelo usuário no dia atual
 *     tags:
 *       - Sintomas
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de sintomas do dia atual
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Symptom'
 *       500:
 *         description: Erro ao buscar sintomas do dia
 */
/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Remove um sintoma registrado
 *     tags:
 *       - Sintomas
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Sintoma removido com sucesso
 *       500:
 *         description: Erro ao deletar sintoma
 */
