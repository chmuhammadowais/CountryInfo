const find = document.getElementById('find');
const container = document.getElementById('container')
find.addEventListener('click', function(){
    container.style.display = 'flex';
    find.style.display = 'none';
});