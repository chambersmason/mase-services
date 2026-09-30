# MASE LLC

Marketing site for MASE, served at [mase-services.com](https://mase-services.com) via GitHub Pages.

Plain HTML, CSS, and a small amount of vanilla JavaScript. There is no build step: edit the files and push.

## Structure

```
index.html              Homepage
privacy.html            Privacy notice
404.html                Not-found page (served automatically by GitHub Pages)
assets/css/styles.css   All styles
assets/js/main.js       Mobile menu, header state, contact form
assets/img/             Favicon, touch icon, social share image (og-image.png)
robots.txt, sitemap.xml Search engine configuration
CNAME                   Custom domain for GitHub Pages
```

## Contact form

The form in `index.html` (`#contact-form`) reads two attributes:

- `data-email`: the address inquiries go to (currently `hello@mase-services.com`).
- `data-endpoint`: optional form-service URL (for example a [Formspree](https://formspree.io) form URL).
  - **Set:** submissions are posted there and the visitor sees a confirmation on the page.
  - **Empty:** submitting opens the visitor's email app with the message pre-filled.

If you change the contact email, update it everywhere with:

```sh
grep -rl "hello@mase-services.com" . | xargs sed -i 's/hello@mase-services.com/you@yourdomain.com/g'
```

## Preview locally

```sh
python3 -m http.server 8080
```

Then open http://localhost:8080.
