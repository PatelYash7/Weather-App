
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-search-weather]");
const userContainer = document.querySelector(".main-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// variables 

let currentTab = userTab;
const API_KEY= "0adcdc45e28887e27702549486adca0c";

currentTab.classList.add("current-tab");
getfromSessionStorage();


// For changing the tabs
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // this is a condition for clicked on search weather, so make search weather visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            
        }
        else{
            // this is a condition for clicked on your weather section, so make their property visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // here we have to show the weather of current location so, get coordinates from the local session stoarage
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates); 
    }
}

// Fetch weather information function

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grANT ACCESS invisible because we are finding the data
    grantAccessContainer.classList.remove("active");
    // make loading screen visible, because api is finding the data 
    loadingScreen.classList.add("active");
    // Make api call 
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        
        const data =await response.json();
        loadingScreen.classList.remove("active");
        // now we have to show the data so, make  user info container visible
        userInfoContainer.classList.add("active");
        // now we have to render data in userinfo container so we make dynamic fumction for it.
        renderWeatherInfo(data);   
        
        
    } catch (err) {
        loadingScreen.classList.remove("active");
        errorBox.classList.add("active");
        

    }
}
function renderWeatherInfo(weatherInfo){
    const cityName =document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0].description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    
    windspeed.innerText = weatherInfo?.wind?.speed;
    
    humidity.innerText = weatherInfo?.main?.humidity;
    
    clouds.innerText = weatherInfo?.clouds?.all;
    

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
        alert("Geoloction not available")
    }
}
function showPosition(position){
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    //  not set the user coordinates in session storage 
    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);  
}
// now we go for the case if coordinates are not there in session, then we have to give access to get coordinates
const grantAccessButton = document.querySelector("[data-grantAccess]");

// Grant access 
grantAccessButton.addEventListener("click",getLocation);



// For search 
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);

})
const errorBox = document.querySelector("[data-error]");
//  now we make fetchuserweather info for city arugument 
async function fetchSearchWeatherInfo(city){
      loadingScreen.classList.add("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
      } catch (e) {
        loadingScreen.classList.remove("active");
        errorBox.classList.add("active");
      }
}