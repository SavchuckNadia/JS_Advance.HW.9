const BACKEND_URL = 'http://localhost:3000/tasks'
const FIELD = document.querySelector('.textBlock');
const ADD_BTN = document.querySelector('.add');
let currentTask = null;
let currentID = null;

let a = document.querySelector('.a');
let b = document.querySelector('.b');
let btnClose1 = document.querySelector('#close1');
let btnClose2 = document.querySelector('#close2');

ADD_BTN.addEventListener('click', (event) => {
    event.preventDefault()
    const NEW_TASK = FIELD.value;
    if (NEW_TASK) {
        const DATA = {
            task: NEW_TASK
        }
        fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DATA)
            })
            .then(response => response.json())
            .then(() => getTasks())
            .catch(err => console.log(err))

    }
    if (!NEW_TASK) {
        a.style.display = 'block';
        btnClose1.addEventListener('click', function () {
            a.style.display = 'none';
        })
    }
    FIELD.value = ''
})

function getTasks() {
    fetch(BACKEND_URL)
        .then(response => response.json())
        .then(data => {
            render(data);
            console.log(data)
        })
        .catch(err => console.log(err))

}
getTasks()

function render(data) {
    const tasks = data;
    document.querySelector('.form-block').innerHTML = '';
    tasks.forEach(element => {
        let template =
            `
    <div class="block-task">
        <div class="delete" >
            <input class="checkbox" type="checkbox" data-id="${element.id}" data-name="delete" >
            <span class="text">${element.task}</span>
        </div>
        <div class=" edit" data-id="${element.id}" data-name="edit"></div>
    </div>
    `
        document.querySelector('.form-block').insertAdjacentHTML('beforeend', template)
    });
}

document.querySelector('.form-block').addEventListener('click', (event) => {
    event.preventDefault()
    let checkbox = document.getElementsByClassName('checkbox ')
    console.log(checkbox);
    console.log(event.target.dataset);
    if (event.target.dataset.name === 'delete') {
        if (checkbox.length > 1) {
            if (confirm('Are you sure ?')) {
                const id = event.target.dataset.id
                fetch(`${BACKEND_URL}/${id}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(() => getTasks())
                    .catch(err => console.log(err))
            }
        }
        if (checkbox.length == 1) {
            b.style.display = 'block';
            btnClose2.addEventListener('click', function () {
                b.style.display = 'none';
            })

        }

    }
    if (event.target.dataset.name === 'edit') {
        getOneTask(event.target.dataset.id)

            .then(data => {
                currentTask = data;
                FIELD.value = currentTask.task;
                currentID = event.target.dataset.id
            })
            .catch(err => console.log(err))
        document.querySelector('.add').style.display = 'none'
        document.querySelector('.save').style.display = 'block'
    }
})
document.querySelector('.form-block').addEventListener('click', (event) => {})

async function getOneTask(id) {
    const response = await fetch(`${BACKEND_URL}/${id}`);
    const data = await response.json();
    return data;
}


document.querySelector('.save').addEventListener('click', (event) => {
    event.preventDefault()
    const id = currentID
    const Edit_TASK = FIELD.value;
    if (Edit_TASK) {
        const DATA = {
            task: Edit_TASK
        }
        fetch(`${BACKEND_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(DATA)
            })
            .then(response => response.json())
            .then(() => getTasks())
            .catch(err => console.log(err))
    }
    FIELD.value = ''
    document.querySelector('.add').style.display = 'block'
    document.querySelector('.save').style.display = 'none'
})
