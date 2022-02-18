const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../modules/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20)+ 10;

        const camp = new Campground({
            // your user ID
            author:'609178e9af572d152080e777',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            discription: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia aspernatur ipsa laborum? Vel, delectus nihil deserunt illo itaque ab dolorum ducimus laudantium, debitis ratione consequatur numquam. Non, alias distinctio. Quisquam!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dyogooaol/image/upload/v1642184656/YelpCamp/bwoerolnlhcneegpekee.jpg',
                  filename: 'YelpCamp/bwoerolnlhcneegpekee'
                }
              ],
            

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})