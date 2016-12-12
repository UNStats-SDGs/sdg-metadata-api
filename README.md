# GlobalSdgIndicatorsAPI
Live Example @ [https://unstats-sdg-api.herokuapp.com](https://unstats-sdg-api.herokuapp.com/)

An API to retrieve information and metadata on the [Sustainable Development Goals](http://www.un.org/sustainabledevelopment/sustainable-development-goals/). 

This API does its best to follow the [JSONAPI Specification](http://jsonapi.org/).

So let's go build something that changes the world.

---

# Setup
- clone/fork repo
- `cd` into dir
- `npm install`
- `npm start`
- api now available @ `http://localhost:3000`

---
# Documentation
You can navigate the API using the Goal -> Target -> Indicator pattern.

For example:

- [https://unstats-sdg-api.herokuapp.com/goals](https://unstats-sdg-api.herokuapp.com/goals) will return a list of **all** the Goals
- [https://unstats-sdg-api.herokuapp.com/goals/1](https://unstats-sdg-api.herokuapp.com/goals/1) will return detailed information for **SDG 1**
- [https://unstats-sdg-api.herokuapp.com/goals/1/targets](https://unstats-sdg-api.herokuapp.com/goals/1/targets) will return the **Targets** for SDG 1
- [https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1](https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1) will return detailed information for SDG 1, **Target 1.1**
- [https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1/indicators](https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1/indicators) will return the **Indicators** SDG 1, Target 1.1
- [https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1/indicators/1.1.1](https://unstats-sdg-api.herokuapp.com/goals/1/targets/1.1/indicators/1.1.1) will return detailed information for SDG 1, Target 1.1, **Indicator 1.1.1**

The same URL pattern applies for Targets, Indicators & Series

- [https://unstats-sdg-api.herokuapp.com/targets](https://unstats-sdg-api.herokuapp.com/targets)
- [https://unstats-sdg-api.herokuapp.com/indicators](https://unstats-sdg-api.herokuapp.com/indicators)
- [https://unstats-sdg-api.herokuapp.com/series](https://unstats-sdg-api.herokuapp.com/series)
  - Requesting a specific Series by id: [https://unstats-sdg-api.herokuapp.com/series/SI_POV_DAY1](https://unstats-sdg-api.herokuapp.com/series/SI_POV_DAY1)

## Returning Indicator Source data
Using the `sources=true` query parameter, you can tell the API to return the detailed source information for each Indicator that is requested. If not specified, the source information will **not** be returned by default. Whenever requesting Indicator information, be sure to set `sources=true` if you wish to return the detailed metadata.

For Example

- [https://unstats-sdg-api.herokuapp.com/indicators?sources=true](https://unstats-sdg-api.herokuapp.com/indicators?sources=true)
- [https://unstats-sdg-api.herokuapp.com/targets/2.1?include=indicators&sources=true](https://unstats-sdg-api.herokuapp.com/targets/2.1?include=indicators&sources=true)

## Including Related Information
Using the `include` query parameter, you are able to have the search result bring back related information. View the JSON API Spec for using [include](http://jsonapi.org/format/#fetching-includes).

For Example:

- Goals
  - [https://unstats-sdg-api.herokuapp.com/goals?include=targets](https://unstats-sdg-api.herokuapp.com/goals?include=targets)
- Targets
  - [https://unstats-sdg-api.herokuapp.com/targets?include=goals](https://unstats-sdg-api.herokuapp.com/targets?include=goals)
- Indicators
  - [https://unstats-sdg-api.herokuapp.com/indicators?include=goals,targets](https://unstats-sdg-api.herokuapp.com/indicators?include=goals,targets)
  - Note: this request will bring **all** of the available SDG Metadata for Goals, Targets & Indicators.
- Series
  - [https://unstats-sdg-api.herokuapp.com/goals/1?include=series](https://unstats-sdg-api.herokuapp.com/goals/1?include=series)

## Filtering
You can apply the `filter` query parameter to filter the search results. View the JSON API Spec for [filtering](http://jsonapi.org/format/#fetching-filtering).

For Example:

- Goals
  - [https://unstats-sdg-api.herokuapp.com/goals?filter[id]=1,3,5](https://unstats-sdg-api.herokuapp.com/goals?filter[id]=1,3,5)
- Targets
  - [https://unstats-sdg-api.herokuapp.com/targets?filter[id]=1.1,2.a](https://unstats-sdg-api.herokuapp.com/targets?filter[id]=1.1,2.a)
- Indicators
  - [https://unstats-sdg-api.herokuapp.com/indicators?filter[id]=1.1.1,2.a.1](https://unstats-sdg-api.herokuapp.com/indicators?filter[id]=1.1,2.a.1)

## Combining `include` & `filter`
You are able to combine both of these query parameters to only request specfic data

For Example:

- [https://unstats-sdg-api.herokuapp.com/goals?filter[id]=1,3&include=targets](https://unstats-sdg-api.herokuapp.com/goals?filter[id]=1,3&include=targets)
  - This request will return data for Goals 1 & 3 **and** the data for each related Target
- [https://unstats-sdg-api.herokuapp.com/indicators?filter[id]=1.1.1,2.a.1&include=goals](https://unstats-sdg-api.herokuapp.com/indicators?filter[id]=1.1.1,2.a.1&include=goals)
  - This request will return data for Indicators 1.1.1 & 2.a.1 **and** the data for each related Goal