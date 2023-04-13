// const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/project" , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() =>{
//     console.log("connection successfull");
// }).catch((error) => {
//     console.log(error);
// })


const db = 'mongodb+srv://vishal:vishal@cluster0.qarbd.mongodb.net/BlogPoint?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.connect(db , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("connection successfull");
}).catch((error) => {
    console.log(error);
})