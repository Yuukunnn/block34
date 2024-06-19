import pg from 'pg';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/Reservation_Planner'
);

const createTables = async () => {
  await client.connect();

  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS Reservations; 
    DROP TABLE IF EXISTS Customers;
    DROP TABLE IF EXISTS Locations;

    CREATE TABLE Customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_name VARCHAR(255) NOT NULL
    );

    INSERT INTO Customers (customer_name)
    VALUES ('Mumu'), ('Lulu'), ('Momo');


    CREATE TABLE Locations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        location_name VARCHAR(255) NOT NULL
    );

    INSERT INTO Locations (location_name)
    VALUES ('Naya'), ('KFC'), ('Daxi');


    CREATE TABLE Reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE DEFAULT now(),
        party_count INTEGER NOT NULL,
        location_id UUID,
        customer_id UUID,
        FOREIGN KEY (location_id) REFERENCES Locations(id),
        FOREIGN KEY (customer_id) REFERENCES Customers(id)
    );

    INSERT INTO Reservations (party_count)
    VALUES ('2'), ('4'),('8')

    `;
  await client.query(SQL);
  console.log(chalk.green('database successfuly created && data seeded!!'));
};

export { client, createTables };
