const refreshButton = document.querySelector("#refresh");
const loadingText = document.querySelector("#loading");
const img = document.querySelector("img");

// Register with giphy to get a free use API Key
const API_KEY = "<API_KEY>"

function loadingSpinner() {
    let state = "enabled";

    const showSpinner = () => {
        if (state == "enabled") {
            console.log("Showing the spinner");
            loadingText.classList.remove("hidden");
            loadingText.textContent = "Timedout... Loading...";
        } else {
            console.warn("Spinner disabled can't show");
        }
    };

    const hideSpinner = () => {
        if (state == "enabled") {
            console.log("Hiding the spinner");
            loadingText.classList.add("hidden");
            loadingText.textContent = "Spinner hidden";
        } else {
            console.warn("Spinner disabled can't hide");
        }
    };

    const disableSpinner = () => {
        state = "disabled";
        console.log("Spinner disabled");
    };

    return { showSpinner, hideSpinner, disableSpinner };
}

async function fetchNewImage() {
    const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=cats`,
        { mode: "cors" }
    );
    const jsonResponse = await response.json();
    return jsonResponse.data.images.original.webp;
}

async function setNewImage(imgSrc) {
    img.src = imgSrc;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}

function getNewImage(fetchNewImage) {
    const spinner = loadingSpinner();
    spinner.hideSpinner();

    //     /* Command that is time consuming */
    const fetchPromise = fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=cats`,
        { mode: "cors" }
    )
        .then(function jsonfiyResponse(response) {
            // if (response.statusCode != 200) reject("Not a success");
            // return response.json();

            return new Promise((resolve, reject) => {
                console.log("In responseJson promise");
                if (response.status >= 200 && response.status < 300)
                    resolve(response.json());
                else {
                    reject("Error status code");
                }
            });
        })
        .then(function loadImage(response) {
            console.log("In image assign function");
            img.src = response.data.images.original.webp;
            console.log("Assigned!");
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    resolve(img);
                    console.log("loaded!");
                };
                img.onerror = (err) => reject(err);
            });
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(function cleanup()  {
            spinner.hideSpinner();
            spinner.disableSpinner();
        });

    // const setImagePromise = fetchNewImage()
    //     .then(setNewImage)
    //     .catch((err) => console.log(err))
    //     .finally(() => {
    //         spinner.hideSpinner();
    //         spinner.disableSpinner();
    //     });

    const timeoutPromise = setTimeout(spinner.showSpinner, 300);

    // return Promise.race([timeoutPromise, setImagePromise]);
    return Promise.race([timeoutPromise, fetchPromise]);
}

refreshButton.addEventListener("click", () => getNewImage(fetchNewImage));
