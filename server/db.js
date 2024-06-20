import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/Reservation_Planner');
client.connect();

const createTables = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS Reservation; 
    DROP TABLE IF EXISTS Customer;
    DROP TABLE IF EXISTS Restaurant;

    CREATE TABLE Customer (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_name VARCHAR(255) NOT NULL
    );

    CREATE TABLE Restaurant (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_name VARCHAR(255) NOT NULL
    );

    CREATE TABLE Reservation (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID,
        customer_id UUID,
        FOREIGN KEY (restaurant_id) REFERENCES Restaurant(id),
        FOREIGN KEY (customer_id) REFERENCES Customer(id)
    );
    `;
  await client.query(SQL);
  console.log(chalk.green('database successfuly created!'));
};

const createCustomer = async (customer_name) => {
  const SQL = `
  INSERT INTO Customer (customer_name)
  VALUES ('${customer_name}')
  RETURNING *
  `;
  try {
    const response = await client.query(SQL);
    console.log(chalk.green('A customer successfuly created!'));
    return response.rows;
  } catch {
    (error) => {
      console.log(chalk.red(error));
      return error;
    };
  }
};

const createRestaurant = async (restaurant_name) => {
  const SQL = `
  INSERT INTO Restaurant (restaurant_name)
  VALUES ('${restaurant_name}')
  RETURNING *
  `;
  const response = await client.query(SQL);
  console.log(chalk.green('A restanrant successfuly created!'));
  return response.rows;
};

const fetchCustomers = async () => {
  const SQL = `
  SELECT * FROM Customer;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
  SELECT * FROM Restaurant;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  const SQL = `
  SELECT * FROM Reservation;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createReservation = async (customer_id, restaurant_id, date, party_count) => {
  const SQL = `
  INSERT INTO Reservation(customer_id, restaurant_id, date, party_count)
  VALUES ('${customer_id}', '${restaurant_id}', '${date}', ${party_count})
  RETURNING *
  `;
  try {
    const response = await client.query(SQL);
    return response.rows;
  } catch (err) {
    console.log('error: ', err);
    throw err;
  }
};

const deleteReservation = async (customer_id, id) => {
  const SQL = `
  DELETE FROM Reservation
  WHERE id = '${id}' AND customer_id = '${customer_id}'
 `;
  const response = await client.query(SQL);
  return response.rows;
};

export {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  deleteReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
};
