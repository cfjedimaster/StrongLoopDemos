var $name, $age, $breed, $picture, $resume, $catList;

var apiUrl = 'http://localhost:3000/api/';

$(document).ready(function() {

    $('#addCatForm').on('submit', handleForm);

    $name = $('#name');
    $age = $('#age');
    $breed = $('#breed');
    $picture = $('#picture');
    $resume = $('#resume');
    $catList = $('#catList');

    getCats();

});

function getCats() {

    var list = '';

    $.get(apiUrl + 'cats').then(function(res) {
        res.forEach(function(cat) {
            list += `
            <h2>${cat.name}</h2>
            <p>
            ${cat.name} is a ${cat.breed} and is ${cat.age} year(s) old.
            </p>`;
        });
        $catList.html(list);
    });
}

function handleForm(e) {
    e.preventDefault();

    var cat = {
        name:$name.val(),
        age:$age.val(),
        breed:$breed.val()
    }

    console.log(cat);

    $.post(apiUrl + 'cats', cat).then(function(res) {
        console.log(res);
        getCats();
    });

}