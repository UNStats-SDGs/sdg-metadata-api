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

- `/goals` will return a list of **all** the Goals
- `/goals/1` will return detailed information for **SDG 1**
- `/goals/1/targets` will return the **Targets** for SDG 1
- `/goals/1/targets/1.1` will return detailed information for SDG 1, **Target 1.1**
- `/goals/1/targets/1.1/indicators` will return the **Indicators** SDG 1, Target 1.1
- `/goals/1/targets/1.1/indicators/1.1.1` will return detailed information for SDG 1, Target 1.1, **Indicator 1.1.1**

The same URL pattern applies for Targets & Indicators

- `/targets/1.1`
- `/indicators/1.1.1`

You are also able to add the `ids` query parameter to the root endpoints of `/goals`, `/targets` & , `/indicators`

- `/goals?ids=1,3,5`
- `/targets?ids=1.1,2.a`
- `/indicators?ids=1.1.1,1.3.1`