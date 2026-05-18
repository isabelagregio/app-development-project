/**
 * @swagger
 * /:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags:
 *       - Agendamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - date
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [CONSULTATION, EXAM, TREATMENT]
 *                 example: CONSULTATION
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T14:00:00Z
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro ao criar agendamento
 */
/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Retorna todos os agendamentos de um usuário
 *     tags:
 *       - Agendamentos
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro ao buscar agendamentos
 */
/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Deleta um agendamento existente
 *     tags:
 *       - Agendamentos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 *       500:
 *         description: Erro ao deletar agendamento
 */
/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza os dados de um agendamento
 *     tags:
 *       - Agendamentos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - date
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 enum: [CONSULTATION, EXAM, TREATMENT]
 *                 example: EXAM
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-10T09:30:00Z
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro ao atualizar agendamento
 */
