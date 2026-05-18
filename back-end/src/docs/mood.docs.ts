/**
 * @swagger
 * /:
 *   post:
 *     summary: Registra um novo humor para um usuário
 *     tags:
 *       - Humor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - label
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               label:
 *                 type: string
 *                 example: feliz
 *     responses:
 *       201:
 *         description: Humor registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mood'
 *       500:
 *         description: Erro ao salvar humor
 */
/**
 * @swagger
 * /{userId}:
 *   get:
 *     summary: Lista os humores de um usuário em ordem decrescente por data
 *     tags:
 *       - Humor
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de humores do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mood'
 *       500:
 *         description: Erro ao buscar humores
 */
/**
 * @swagger
 * /{userId}/today:
 *   put:
 *     summary: Atualiza o humor do dia atual para o usuário
 *     tags:
 *       - Humor
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 example: cansado
 *     responses:
 *       200:
 *         description: Humor do dia atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mood'
 *       500:
 *         description: Erro ao atualizar humor
 */
