# Motivation, and what is this?

I want to view my vacation photos in a slideshow on my Mac. But if I only want to use the default apps, I need to jump through hoops. Why can't I just choose a folder to start a slideshow?

This app basically runs a slideshow by choosing a folder containing your photos.

# How to run this app.

Install the NPM dependencies.

`npm run start`

Open localhost in your web browser.

Choose a folder that contains your images.

To navigate through the images:
* Use the LEFT and RIGHT arrow keys.
* Or click on the thumbnails.

Other features:
* Sort the images by date.
* Randomly sort the images.
* If there is geo data, then the app displays the city's name and country's flag. This requires (1) running the API (https://github.com/lamh85/slideshow-rails), and (2) setting the environmental variable `API_URL` in the file `.env`

# To be added later: demo video and screenshots