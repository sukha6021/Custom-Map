const Geo = require("../models/geo.model");

const SingleMap = require("../models/geoCollection.model");
const puppeteer = require("puppeteer");

// Simple version, without validation or sanitation
exports.test = function (req, res, next) {
  res.send("Hello Test controller!");
};

/* CREATE */
exports.geo_create = function (req, res, next) {
  console.log(req.body);
  var geo = new Geo(req.body);

  geo.save(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Feature created successfully");
  });
};

exports.new_map = function (req, res, next) {
  console.log(req.body);
  var geo = new Geo({ user_id: req.body.user_id });
  geo.name = req.body.name;

  geo.save(function (err, map) {
    if (err) {
      return next(err);
    }
    console.log(map.id);
    res.json({ mapId: map.id });
  });
};

exports.geomap_create = function (req, res, next) {
  console.log(req.body);
  var geo = new Geo();

  geo.save(function (err, map) {
    if (err) {
      return next(err);
    }

    console.log(map.id);
    res.json({ mapId: map.id });
  });
};

/* READ */
// return list of all features (geometry only)
exports.geo_list = function (req, res, next) {
  Geo.find({}, { geometry: 1 }, function (err, geo) {
    if (err) return next(err);
    res.send(geo);
  });
};

// return item that matches name
exports.geo_name = function (req, res, next) {
  Geo.findOne({ name: req.params.name }, {}, function (err, geo) {
    if (err) return next(err);
    res.send(geo);
  });
};

// return item that matches id
exports.geo_id = function (req, res, next) {
  Geo.findById(req.params.id, function (err, geo) {
    if (err) return next(err);
    res.json(geo);
  });
};

// return all names only
exports.geo_allnames = function (req, res, next) {
  Geo.find({}, { name: 1 }, function (err, geo) {
    if (err) return next(err);
    res.json(geo);
  });
};

// return geometry only
exports.geo_all = function (req, res, next) {
  Geo.find({}, {}, function (err, geo) {
    if (err) return next(err);
    res.send(geo);
  });
};

/* DELETE */
exports.geo_delete = function (req, res, next) {
  Geo.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send("Deleted successfully!");
  });
};

/**
 * get map by id
 */

exports.get_map_by_id = function (req, res, next) {
  const map = req.query.map;
  Geo.findById(req.params.id, function (err, geo) {
    if (err) return next(err);
    res.json(geo);
  });
};

/**
 * get all user maps by user_id
 */

exports.get_user_maps = function (req, res, next) {
  const user = req.query.user_id;
  if (user == null) {
    res.json([]);
    return;
  }

  console.log(user);
  Geo.find({ user_id: user }, {}, function (err, geo) {
    if (err) return next(err);
    res.send(geo);
  });
};

/**
 * Takes mapId , generates thumbnail base64 encoded image text and saves it to mongodb
 *
 * @param {*} mapId  Map Id to show
 * @param {*} url
 * @param {*} token
 * @param {*} next
 */

function make_save_image(mapId, url, cookie, userId, next) {
  (async () => {
    console.log("userId from make save image: ", userId);
    //pass headless parameter to test redirect

    /*
    // user headless for debugging puppeteer
    const browser = await puppeteer.launch({
      headless: false,
    });

    */

    //args for running on heroku
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    page.setExtraHTTPHeaders({
      Cookie: cookie,
    });
    await page.goto(url);

    // set localStorage userId so that map is revealed to
    await page.evaluate((userId) => {
      localStorage.setItem("userId", userId);
    }, userId);

    //refresh page again to contain the localStorage values
    await page.goto(url);

    // now wait a little for data to load
    await new Promise((r) => setTimeout(r, 1000));

    const base64 = await page.screenshot({ encoding: "base64" });
    Geo.findByIdAndUpdate(mapId, { img: base64 }, (err, geo) => {
      if (err) return next(geo);
      console.log("image saved to db");
    });

    //await browser.close();
  })();
}

/* UPDATE */
exports.geo_update = function (req, res, next) {
  console.log(req.body.center);
  let data = req.body.data;
  data.center = req.body.center;
  data.zoom = req.body.zoom;
  Geo.findByIdAndUpdate(req.params.id, { $set: data }, function (err, geo) {
    if (err) return next(err);
    make_save_image(
      req.params.id,
      req.body.url,
      req.body.token,
      req.body.userId,
      next
    );

    res.send("Geo updated.");
  });
};

/* Geo Publish */

exports.geo_publish = function (req, res, next) {
  Geo.findById(req.params.id, function (err, geo) {
    if (err) return next(err);
    geo.published = !geo.published;
    Geo.findByIdAndUpdate(req.params.id, { $set: geo }, function (err, geo) {
      if (err) return next(err);
      res.send("Geo published");
    });
  });
};
