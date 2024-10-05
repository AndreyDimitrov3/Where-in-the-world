document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.custom-select-wrapper');

    // Toggle open(animation) when filter is clicked
    document.getElementById('filter').addEventListener('click', function () {
        wrapper.classList.toggle('open');
    });
  
    // Toggle open(animation) when a click occurs
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('open');
        }
    });

    // Remove open(animation) when the dropdown loses focus
    window.addEventListener('blur', function () {
        wrapper.classList.remove('open');
    });
});
