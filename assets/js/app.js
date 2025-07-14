import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

// Import CSS files
import '../css/style.css';
import '../css/slider.css';
import '../css/skills.css';
import '../css/timeline.css';

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.email-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const encoded = "bW9jLmxpYW1nQHNuZWR5b2JuZWI=";
            const reversed = atob(encoded);
            const email = reversed.split("").reverse().join("");
            window.location.href = `mailto:${email}`;
        });
    });
});