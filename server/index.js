const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 7000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.user = decoded;
    next();
  });
};

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziugtg4.mongodb.net/YusufCarEra?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const allCarsCollection = client.db('yusufCarEra').collection('allCars');

    // Auth-related API
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      });
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });

    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true });
        console.log('Logout successful');
      } catch (err) {
        res.status(500).send(err);
      }
    });

    //Get All Cars From Database-------
    app.get('/cars', async (req, res) => {
      const { category, brandName, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
  
      let query = {};
      
      if (category && category !== 'All') {
          query.category = category;
      }
      
      if (brandName) {
          query.brandName = brandName;
      }
      
      if (minPrice && maxPrice) {
          query.price = {
              $gte: Number(minPrice),
              $lte: Number(maxPrice),
          };
      }
      
      let sortQuery = {};
      
      if (sort === 'price-asc') {
          sortQuery.price = 1; // Ascending order for price
      } else if (sort === 'price-desc') {
          sortQuery.price = -1; // Descending order for price
      } else if (sort === 'date-desc') {
          sortQuery.createdAt = -1; // Descending order for date added (Newest first)
      }
      
      try {
          const skip = (Number(page) - 1) * Number(limit);
          const totalCars = await allCarsCollection.countDocuments(query);
          const cars = await allCarsCollection.find(query)
              .sort(sortQuery)
              .skip(skip)
              .limit(Number(limit))
              .toArray();
          
          res.json({
              totalCars,
              currentPage: Number(page),
              totalPages: Math.ceil(totalCars / Number(limit)),
              cars,
          });
      } catch (error) {
          console.error('Error fetching cars:', error); // Log error for debugging
          res.status(500).json({ error: 'Failed to fetch cars' });
      }
  });
  
    

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close(); // Uncomment if you want to close the connection in the `finally` block
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Yusuf Car Era Start Now');
});

app.listen(port, () => {
  console.log(`Yusuf Car Era is running on port ${port}`);
});
