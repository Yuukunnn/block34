import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
import {
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  deleteReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
} from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const startServer = async () => {
  await createTables();

  app.listen(port, () => {
    console.log(chalk.green(`server successfully listening on port ${port}`));
  });
};

startServer();

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.send(customers);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});

app.post('/api/createCustomer', async (req, res) => {
  try {
    const customer = await createCustomer(req.body.name);
    res.send(customer);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});

app.post('/api/createRestaurant', async (req, res) => {
  try {
    const restaurant = await createRestaurant(req.body.name);
    res.send(restaurant);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});

app.get('/api/restaurant', async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.send(restaurants);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});

app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await fetchReservations();
    res.send(reservations);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});

app.post('/api/customers/:id/reservations', async (req, res) => {
  try {
    const createdReservation = await createReservation(req.params.id, req.body.restaurant_id, req.body.date, req.body.party_count);
    res.status(201).send(createdReservation);
  } catch (error) {
    console.log(chalk.red(error));
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  try {
    const response = await deleteReservation(req.params.customer_id, req.params.id);
    res.sendStatus(204);
  } catch {
    (error) => console.log(chalk.red(error));
  }
});
