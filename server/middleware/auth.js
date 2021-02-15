const { exists } = require("../models/geo.model");
const { User } = require("../models/User");
const Geo = require("../models/geo.model");

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  console.log("token: ", req.cookies);

  let isPublished = false;
  let mapId = "";

  let ref = req.headers.referer;
  console.log("referr: ", ref);
  if (ref && ref.includes("/")) ref = ref.replace(/\/$/, "");

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        isAuth: false,
        error: true,
      });
    }

    req.user = user;
    req.token = token;
    next();
  });
};

module.exports = { auth };

/*
      if (ref.includes("/map/")) {
        let refAr = ref.split("/");
        let mapId = refAr[refAr.length - 1];
        console.log("mapId", mapId);

        Geo.findById(mapId, (err, geo) => {
          if (err) throw error;
          if (geo.published) {
            console.log("map published, using fake user");
            isPublished = true;
            req.token = "test";
            req.user = new User({
              _id: "anonym",
              first_name: "Suresh",
              last_name: "Khaniya",
              email: "sukhadukha2@gmail.com",
              password:
                "$2b$10$PWED3L9T4U96mpzS82cJCuxYRYRILQRDF6RNyiDprQGlfXd39mXPa",
              date: {
                $date: {
                  $numberLong: "1587914561701",
                },
              },
              __v: {
                $numberInt: "0",
              },
            });
            next();
            return;
          } else
            return res.json({
              isAuth: false,
              error: true,
            });
        });
      } else {
        return res.json({
          isAuth: false,
          error: true,
        });
      }
*/
