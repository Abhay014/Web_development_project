const Campground = require("../modules/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });




// fuction for showing all campgrounds in route

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/indexcampgrounds', { campgrounds });

}


//                  making fuctions for CRUD functionality for campground

// fucntion for creating new campground form
module.exports.renderNewForm =(req, res) => {

    res.render('campgrounds/new');
  
}

// fucntion for creating new campground 
module.exports.createCampground = async (req, res) => {
   
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Sucessfully made a new campground!')

    res.redirect(`/campgrounds/${campground._id}`);
}




// fuction for showing one campground in route
module.exports.showCampground = async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    
    if (!campground) {
        req.flash('error', 'Cannot find campground!!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}



// function for editing a campground form

module.exports.renderEditForm =async (req, res) => { 
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find campground!!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}


// fuction for editing a campground

module.exports.updateCampground = async (req, res)=>{
    
    const { id } = req.params;
    
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs); 

    await campground.save();
    
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(req.body);
     };
    req.flash('success', 'Successfully Updated Campground!'); 
    res.redirect(`/campgrounds/${campground._id}`);
    
  
}


// fuction for deleting a campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfull deleted campground!!')

    res.redirect('/campgrounds');
}



//                          ending CRUD functionality for campground


