
const mongoose=require("mongoose");
let datainit=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(`${process.env.ATLAS_URL}`);
}
// console.log(datainit.data);
 function initdb(){
  Listing.deleteMany({})
    .then(()=>{
        console.log("listing collection cleared");
    })
    .catch((err)=>{
        console.log(err);
    });
    datainit.data=datainit.data.map((obj)=> {
        let n={
            ...obj,
            owner: "65cf915f8c90b3b226acdda7"
        };
        return n;
    });
    Listing.insertMany(datainit.data)
    .then(()=>{
        console.log("in listing collection,all documents are inserted ");
    })
    .then((err)=>{
        console.log(err);
    });
    
}

initdb();