const apiKey = "0a185ef4297904d2336a7b94c81ce187";
const baseUrl = "https://api.themoviedb.org/3";
let currentPage = 1;

const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

// Toggle Sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  toggleBtn.textContent = sidebar.classList.contains("active") ? "✕" : "☰";
});

// Sidebar Links
document.querySelectorAll("#sidebar .nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = link.getAttribute("data-category");
    if (category) getMovies(category);
    sidebar.classList.remove("active");
    toggleBtn.textContent = "☰";
  });
});

// Search Inputs
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) await searchMovies(query);
  }
});

const searchWordInput = document.getElementById("searchWord");
searchWordInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const query = searchWordInput.value.trim();
    if (query) await searchMovies(query);
  }
});

// Helpers
function showLoading() {
  document.getElementById("loading").style.display = "block";
}
function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

// API Functions
async function getMovies(category = "popular", page = 1) {
  showLoading();
  let url =
    category === "trending"
      ? `${baseUrl}/trending/movie/week?api_key=${apiKey}&page=${page}`
      : `${baseUrl}/movie/${category}?api_key=${apiKey}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  hideLoading();
  displayMovies(data.results);
}

async function searchMovies(query) {
  showLoading();
  const response = await fetch(
    `${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`
  );
  const data = await response.json();
  hideLoading();
  displayMovies(data.results);
}

// Display Movies
function displayMovies(movies) {
  const moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = `
      <div class="col-md-3">
        <div class="card h-100" onclick="showMovieDetails(${movie.id})">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
               alt="${movie.title}" class="img-fluid rounded">
        </div>
      </div>`;
    moviesContainer.innerHTML += movieCard;
  });
}

// Movie Details
async function showMovieDetails(id) {
  const response = await fetch(
    `${baseUrl}/movie/${id}?api_key=${apiKey}&language=en-US`
  );
  const movie = await response.json();

  document.getElementById("movieTitle").innerText = movie.title;
  document.getElementById(
    "moviePoster"
  ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  document.getElementById("movieOverview").innerText = movie.overview;
  document.getElementById("movieDate").innerText = movie.release_date;
  document.getElementById("movieRating").innerText = movie.vote_average;
  document.getElementById("movieLang").innerText =
    movie.original_language.toUpperCase();

  const movieModal = new bootstrap.Modal(document.getElementById("movieModal"));
  movieModal.show();
}

// Contact Form Validation
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  alert("Form submitted successfully!");
  contactForm.reset();
});

// Start
getMovies("popular");
