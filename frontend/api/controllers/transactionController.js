const pool = require('../config/db');

const deposit = async (req, res) => {
  const { accountId, amount, description } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query('BEGIN');

    const { rows: accounts } = await connection.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [accountId]);
    const newBalance = parseFloat(accounts[0].balance) + parseFloat(amount);

    await connection.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newBalance, accountId]);
    await connection.query(
      'INSERT INTO transactions (account_id, type, amount, balance_after, description) VALUES ($1, $2, $3, $4, $5)',
      [accountId, 'DEPOSIT', amount, newBalance, description || 'Depósito en efectivo']
    );

    await connection.query('COMMIT');
    res.json({ message: 'Depósito exitoso', balance: newBalance });
  } catch (error) {
    await connection.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

const withdraw = async (req, res) => {
  const { accountId, amount, description } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query('BEGIN');

    const { rows: accounts } = await connection.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [accountId]);
    if (parseFloat(accounts[0].balance) < parseFloat(amount)) {
      throw new Error('Fondos insuficientes');
    }

    const newBalance = parseFloat(accounts[0].balance) - parseFloat(amount);

    await connection.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newBalance, accountId]);
    await connection.query(
      'INSERT INTO transactions (account_id, type, amount, balance_after, description) VALUES ($1, $2, $3, $4, $5)',
      [accountId, 'WITHDRAWAL', amount, newBalance, description || 'Retiro de efectivo']
    );

    await connection.query('COMMIT');
    res.json({ message: 'Retiro exitoso', balance: newBalance });
  } catch (error) {
    await connection.query('ROLLBACK');
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

const transfer = async (req, res) => {
  const { fromAccountId, toAccountNumber, amount, description } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.query('BEGIN');

    // Validar cuenta de origen y saldo
    const { rows: fromAccs } = await connection.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromAccountId]);
    if (parseFloat(fromAccs[0].balance) < parseFloat(amount)) {
      throw new Error('Fondos insuficientes para la transferencia');
    }

    // Validar cuenta de destino
    const { rows: toAccs } = await connection.query('SELECT id, balance FROM accounts WHERE account_number = $1 FOR UPDATE', [toAccountNumber]);
    if (toAccs.length === 0) {
      throw new Error('Cuenta de destino no existe');
    }
    const toAccountId = toAccs[0].id;

    const newFromBalance = parseFloat(fromAccs[0].balance) - parseFloat(amount);
    const newToBalance = parseFloat(toAccs[0].balance) + parseFloat(amount);

    // Actualizar balances
    await connection.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newFromBalance, fromAccountId]);
    await connection.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newToBalance, toAccountId]);

    // Registrar transacciones
    await connection.query(
      'INSERT INTO transactions (account_id, type, amount, balance_after, description) VALUES ($1, $2, $3, $4, $5)',
      [fromAccountId, 'TRANSFER_OUT', amount, newFromBalance, `Transferencia a cuenta ${toAccountNumber}`]
    );
    await connection.query(
      'INSERT INTO transactions (account_id, type, amount, balance_after, description) VALUES ($1, $2, $3, $4, $5)',
      [toAccountId, 'TRANSFER_IN', amount, newToBalance, `Transferencia recibida`]
    );

    // Registrar en tabla transfers
    await connection.query(
      'INSERT INTO transfers (from_account_id, to_account_id, amount) VALUES ($1, $2, $3)',
      [fromAccountId, toAccountId, amount]
    );

    await connection.query('COMMIT');
    res.json({ message: 'Transferencia exitosa', balance: newFromBalance });
  } catch (error) {
    await connection.query('ROLLBACK');
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

const getHistory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC',
      [req.params.accountId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { deposit, withdraw, transfer, getHistory };
