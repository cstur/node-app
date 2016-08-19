module.exports = [
        { 
            $match: {
                "pv.pvid":"mobile-home",
                "createdAt":{"$gte":"","$lt":""}
            } 
        },
        { 
            $group : {
                _id: {
                    year : { $year : {$add:['$createdAt',28800000]} },          
                    month : { $month : {$add:['$createdAt',28800000]} },        
                    day : { $dayOfMonth : {$add:['$createdAt',28800000]} }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]