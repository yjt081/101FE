
const allProperties = [
  { title: "2BHK Apartment in Noida", price: 0.75, location: "Noida", type: "Apartment", image: "assets/1.jpg" },
  { title: "3BHK Villa in Delhi", price: 1.25, location: "Delhi", type: "Villa", image: "assets/2.jpeg" },
  { title: "Plot in Gurgaon", price: 0.65, location: "Gurgaon", type: "Plot", image: "assets/3.jpeg" },
];


const listingsContainer = document.getElementById("listingsContainer");
const filterForm = document.getElementById("filterForm");
const resetBtn = document.getElementById("resetBtn");

function displayProperties(properties) {
  listingsContainer.innerHTML = "";
  if (properties.length === 0) {
    listingsContainer.innerHTML = `<p class="text-center">No properties found.</p>`;
    return;
  }

  properties.forEach((prop) => {
    listingsContainer.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${prop.image}" class="card-img-top" alt="${prop.title}">
          <div class="card-body">
            <h5 class="card-title">${prop.title}</h5>
            <p class="card-text">${prop.location} · ₹${prop.price} Cr · ${prop.type}</p>
          </div>
        </div>
      </div>
    `;
  });
}


filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = document.getElementById("location").value;
  const type = document.getElementById("type").value;
  const priceRange = parseFloat(document.getElementById("priceRange").value);

  const filtered = allProperties.filter((prop) => {
    return (
      (location === "" || prop.location === location) &&
      (type === "" || prop.type === type) &&
      (isNaN(priceRange) || prop.price <= priceRange)
    );
  });

  displayProperties(filtered);

  
  const filteredData = { location, type, priceRange, timestamp: new Date().toISOString() };
fetch("http://localhost:5050/listingSubmit", {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filteredData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("✅ Listing submitted to DB:", data.insertedId);
    } else {
      console.error("❌ Failed to submit listing:", data.error);
    }
  })
  .catch(err => {
    console.error("❌ Error sending listing data:", err);
  });
});


resetBtn.addEventListener("click", () => {
  filterForm.reset();
  displayProperties(allProperties);
  console.log("🔄 Filters reset. Showing all properties again.");
});


displayProperties(allProperties);
