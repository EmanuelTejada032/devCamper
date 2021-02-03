 const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //copy of req.query
    const reqQuery = { ...req.query }

    //Fields to exclude from query
    const removeFields = ['select','sort','page', 'limit']

    // Loop over removeFields to exclude from the query
    removeFields.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators query to find match
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    
    //finding resources by match to the query
    query = model.find(JSON.parse(queryStr));

    //Select specific fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    //Sorting by fields.
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        //default sort
        query = query.sort('-createdAt')
    }


    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1 ) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();


    query = query.skip(startIndex).limit(limit)

    if(populate){
        query = query.populate(populate)
    }
    //Execute the query
    const results = await query

    //pagination result
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

   res.advancedResults = {
       success: true,
       count: results.length,
       pagination,
       data: results
   }

  

   next();

 };

 module.exports = advancedResults;