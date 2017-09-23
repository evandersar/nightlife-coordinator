var async = require('async');
var request = require('request');

var Venue = require('./models/venue');
var foursquare = (require('foursquarevenues'))('PFRQ1PRIZW2CMBOMSCU03U4MLMVH2G2RXKTG5F5C33SKMT4I', 'EXDLNOPVKQUSE01HY3QQPR0AIAW5HDMEVBSJAC3RH1FKKXPY');

function VenueHandler() {

    this.getVenues = function(req, res) {
        //console.log("req.body => ", req.body);
        var city = req.body.city;

        console.log("CITY => ", city);

        var params = {
            "near": city,
            "query": "Nightlife",
            "venuePhotos": 1,
            "limit": 50,
            "offset": 0
        };

        foursquare.exploreVenues(params, function(error, venues) {
            if (!error) {
                console.log("foursquare.exploreVenues.totalResults => ", venues.response.totalResults);

                var updatePromises = [];

                for (let item of venues.response.groups[0].items) {
                    if (item.tips && item.venue.photos.groups[0]) {

                        updatePromises.push(
                            Venue.update({ venue_id: item.venue.id }, {
                                $setOnInsert: { venue_id: item.venue.id, going: 0, visitors: [] }
                            }, { upsert: true }, function(err, numAffected) {
                                if (err) throw err;
                                //console.log("numAffected => ", numAffected);
                            })
                        );

                    }
                }
                //console.log("updatePromises => ", updatePromises);

                var findPromises = [];

                Promise.all(updatePromises)
                    .then(() => {

                        for (let item of venues.response.groups[0].items) {
                            if (item.tips && item.venue.photos.groups[0]) {

                                findPromises.push(
                                    cb => {
                                        Venue.findOne({ venue_id: item.venue.id }, function(err, venue) {
                                            if (err) throw err;
                                            //console.log("venue => ", venue);

                                            cb(
                                                null, {
                                                    venue_id: item.venue.id,
                                                    name: item.venue.name,
                                                    rating: item.venue.rating,
                                                    description: item.tips[0].text,
                                                    tip_url: item.tips[0].canonicalUrl,
                                                    img: `${item.venue.photos.groups[0].items[0].prefix}100x100${item.venue.photos.groups[0].items[0].suffix}`,
                                                    going: venue.going
                                                }
                                            );
                                        });

                                    }
                                );
                            }
                        }

                        async.series(
                            findPromises,
                            // optional callback
                            function(err, venues) {
                                if (err) throw err;
                                //console.log("venues => ", venues);
                                res.writeHead(200, { 'Content-Type': 'text/json' });
                                res.end(JSON.stringify(venues));
                            });
                    });
            }
            else {
                console.log(error);
                return res.json([{ errMsg: 'No data for this city or wrong city name' }]);
            }
        });

    };

    this.updateVenue = function(req, res) {

        var venueID = req.params.id;
        var voter = req.body.voter;

        Venue.findOne({ venue_id: venueID }, function(err, venue) {
            if (err) throw err;
            console.log("venue => ", venue);

            if (!venue) {
                return res.json({ errMsg: `No venue with id: ${venueID} in Database. Search one more time and try again` });
            }
            else {
                if (venue.visitors.indexOf(voter) === -1) {
                    Venue.findOneAndUpdate({ venue_id: venueID }, { $inc: { going: 1 }, $push: { visitors: voter } }, { new: true },
                        function(err, doc) {
                            if (err) throw err;
                            console.log("doc => ", doc);
                            res.json(doc);
                        }
                    );
                }
                else {
                    Venue.findOneAndUpdate({ venue_id: venueID }, { $inc: { going: -1 }, $pull: { visitors: voter } }, { new: true },
                        function(err, doc) {
                            if (err) throw err;
                            console.log("doc => ", doc);
                            res.json(doc);
                        }
                    );
                }
            }

        });


    };
}

module.exports = VenueHandler;
