# GlobalSdgIndicatorsAPI
Live Example @ [https://unstats-sdg-api.herokuapp.com/api/v1](https://unstats-sdg-api.herokuapp.com/api/v1/)

An API to retrieve information and metadata on the [Sustainable Development Goals](http://www.un.org/sustainabledevelopment/sustainable-development-goals/). 

This API does its best to follow the [JSONAPI Specification](http://jsonapi.org/), but is not a full implementation. It's recommended a full implementation of the JSON API Specification include a more robust approach such as [jsonapi-server](https://github.com/holidayextras/jsonapi-server)

So let's go build something that changes the world.

---

# Setup
- clone/fork repo
- `cd` into dir
- `npm install`
- `npm start`
- api now available @ `http://localhost:3000/api/v1`

---
# Documentation
You can navigate the API using the Goal -> Target -> Indicator -> Series pattern.

For example:

- [https://unstats-sdg-api.herokuapp.com/api/v1/goals](https://unstats-sdg-api.herokuapp.com/api/v1/goals) will return a list of **all** the Goals
- [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1) will return detailed information for **SDG 1**
- [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets) will return the **Targets** for SDG 1
- [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1) will return detailed information for SDG 1, **Target 1.1**
- [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1/indicators](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1/indicators) will return the **Indicators** SDG 1, Target 1.1
- [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1/indicators/1.1.1](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1/targets/1.1/indicators/1.1.1) will return detailed information for SDG 1, Target 1.1, **Indicator 1.1.1**

The same URL pattern applies for Targets, Indicators & Series

- [https://unstats-sdg-api.herokuapp.com/api/v1/targets](https://unstats-sdg-api.herokuapp.com/api/v1/targets)
- [https://unstats-sdg-api.herokuapp.com/api/v1/indicators](https://unstats-sdg-api.herokuapp.com/api/v1/indicators)
- [https://unstats-sdg-api.herokuapp.com/api/v1/series](https://unstats-sdg-api.herokuapp.com/api/v1/series)
  - Requesting a specific Series by id: [https://unstats-sdg-api.herokuapp.com/api/v1/series/SI_POV_DAY1](https://unstats-sdg-api.herokuapp.com/api/v1/series/SI_POV_DAY1)

## Returning Indicator Source data
Using the `sources=true` query parameter, you can tell the API to return the detailed source information for each Indicator that is requested. If not specified, the source information will **not** be returned by default. Whenever requesting Indicator information, be sure to set `sources=true` if you wish to return the detailed metadata.

For Example

- [https://unstats-sdg-api.herokuapp.com/api/v1/indicators?sources=true](https://unstats-sdg-api.herokuapp.com/api/v1/indicators?sources=true)
- [https://unstats-sdg-api.herokuapp.com/api/v1/targets/2.1?include=indicators&sources=true](https://unstats-sdg-api.herokuapp.com/api/v1/targets/2.1?include=indicators&sources=true)

## Including Related Information
Using the `include` query parameter, you are able to have the search result bring back related information. View the JSON API Spec for using [include](http://jsonapi.org/format/#fetching-includes).

For Example:

- Goals
  - [https://unstats-sdg-api.herokuapp.com/api/v1/goals?include=targets](https://unstats-sdg-api.herokuapp.com/api/v1/goals?include=targets)
- Targets
  - [https://unstats-sdg-api.herokuapp.com/api/v1/targets?include=goals](https://unstats-sdg-api.herokuapp.com/api/v1/targets?include=goals)
- Indicators
  - [https://unstats-sdg-api.herokuapp.com/api/v1/indicators?include=goals,targets](https://unstats-sdg-api.herokuapp.com/api/v1/indicators?include=goals,targets)
  - Note: this request will bring **all** of the available SDG Metadata for Goals, Targets & Indicators.
- Series
  - [https://unstats-sdg-api.herokuapp.com/api/v1/goals/1?include=series](https://unstats-sdg-api.herokuapp.com/api/v1/goals/1?include=series)

## Filtering
You can apply the `filter` query parameter to filter the search results. View the JSON API Spec for [filtering](http://jsonapi.org/format/#fetching-filtering).

For Example:

- Goals
  - [https://unstats-sdg-api.herokuapp.com/api/v1/goals?filter[id]=1,3,5](https://unstats-sdg-api.herokuapp.com/api/v1/goals?filter[id]=1,3,5)
- Targets
  - [https://unstats-sdg-api.herokuapp.com/api/v1/targets?filter[id]=1.1,2.a](https://unstats-sdg-api.herokuapp.com/api/v1/targets?filter[id]=1.1,2.a)
- Indicators
  - [https://unstats-sdg-api.herokuapp.com/api/v1/indicators?filter[id]=1.1.1,2.a.1](https://unstats-sdg-api.herokuapp.com/api/v1/indicators?filter[id]=1.1,2.a.1)

## Combining `include` & `filter`
You are able to combine both of these query parameters to only request specfic data

For Example:

- [https://unstats-sdg-api.herokuapp.com/api/v1/goals?filter[id]=1,3&include=targets](https://unstats-sdg-api.herokuapp.com/api/v1/goals?filter[id]=1,3&include=targets)
  - This request will return data for Goals 1 & 3 **and** the data for each related Target
- [https://unstats-sdg-api.herokuapp.com/api/v1/indicators?filter[id]=1.1.1,2.a.1&include=goals](https://unstats-sdg-api.herokuapp.com/api/v1/indicators?filter[id]=1.1.1,2.a.1&include=goals)
  - This request will return data for Indicators 1.1.1 & 2.a.1 **and** the data for each related Goal
  
## Returning Geographic Data
The API will allow for returning geographic data in [GeoJSON](http://geojson.org/geojson-spec.html), Esri supported JSON and JSON API (an included `geometry` property on each data element in GeoJSON format). Currently, only the `/series/{:id}` endpoint will return geographic data if the following query parameters are supplied in the request:

  - `refarea` **(required)** | 3 digit country code (ex: `FRA, THA, USA`)
  - `age` | Age Group Code (ex: `000_099_Y` for All age ranges or no breakdown by age)
  - `sex` | Sex Code (ex: `F,M,T`)
  - `years` | Time Periods (ex: `2015,2005`) (currently only supports year values in YYYY format)
  - `returnGeometry` | Boolean flag to include geographic data in response
  - `f`	| Response format (ex: `geojson` or `esrijson`)
  
For Example:

- [https://unstats-sdg-api.herokuapp.com/api/v1/series/EG_EGY_CLEAN?refarea=PRT,THA&returnGeometry=true&f=geojson]([https://unstats-sdg-api.herokuapp.com/api/v1//series/EG_EGY_CLEAN?refarea=PRT,THA&returnGeometry=true&f=geojson)
  - Will return data values on Series **EG_EGY_CLEAN** for Portugual and Thailand
  - The data values will be for the latest year available, per `refarea` specified
  - The **entire** response will be formatted in GeoJSON

You are also able to use this query method without having to return the geometry. This will let you query the data by country, age, sex and time period independently.

For Example:

- [https://unstats-sdg-api.herokuapp.com/api/v1/series/AG_LND_FRST?refarea=KEN&years=2015,2010,2005&include=goals,targets,indicators&sources=true](http://localhost:3000/api/v1/series/AG_LND_FRST?refarea=KEN&years=2015,2010,2005&include=goals,targets,indicators&sources=true)
  - Will return data values on Series **AG_LND_FRST** for Kenya
  - The data values will for be for **years** 2015, 2010, and 2005, if available