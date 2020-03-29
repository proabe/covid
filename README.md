# Welcome to Covid-19 APP!

This web app can be used to visualize covid19 data of india (** will be working on world soon**) on map. And can also be used to find **VRDL laboratories** across india capable of testing **covid19**. This application consists of various APIs that can provide covid19 data.

**Please note that  I have worked hard and for days to make this APIs and visualization, you may use it as you see fit but please have this attribution in place: [Created By: Abhishek Singh](https://www.linkedin.com/in/abhishek-singh-2939a0aa/). Thank you**

# Sources

- [Ministry Of Health and Family Welfare(India)](https://www.mohfw.gov.in/)
- For geoJSON I used various open source platform like openstreet maps and some of the geometries are created by using QGIS (**Therefore there might be chance that boundaries are not accurate | they are just for representational purposes**).

# Usage

 - You can access the app here : [Choropleth Map](https://c0v1d-19-app.herokuapp.com/india).
 - VRDLS on map: [link](https://c0v1d-19-app.herokuapp.com/india/vrdls)

# APIs

 - [To get statewise covid19 stats](https://c0v1d-19-app.herokuapp.com/covid/api/india/covidData)
	 - you can use two params: **sortBy** and **geojson**
	 - possible values for sortBy are:
		 - Total Confirmed cases (Indian National)
		 - Total Confirmed cases ( Foreign National )
		 - Total Cummulative Confirmed cases
		 - Cured/Discharged/Migrated
		 - Death
		 - **don't use any other values and the above values as is**
	- possible values of geojson: true/false
- [geojson data of vrdls across india](https://c0v1d-19-app.herokuapp.com/covid/api/india/vrdls/geojson)
- [helpline numbers and email addresses(state/central)](https://c0v1d-19-app.herokuapp.com/covid/api/india/helpline)
- `https://c0v1d-19-app.herokuapp.com/covid/api/india/state/:stateName/geoJSON`
	- user has to provide **stateName** in the url to fetch geojson for that state.

# Note

I will be updating the document soon, due to shortage of time code isn't documented well and usage instruction are not very crisp.
**As the data is changing rapidly, API may respond incorrectly or their may be discrepancies or for any kind of feedback. raise an issue on Github**