let modal = document.getElementById("my_modal"),
    span = document.getElementsByClassName("close_modal_window")[0],
    mod = document.getElementsByClassName('modal_servise')[0],
    divRes = document.getElementsByClassName("result")[0],
    api = 'https://swapi.dev/api/people/',
    heroList;

//Функция для вывода списка персонажей
async function start() {

    //Запрос к API на получение списка персонажей
    heroList = await getList(api); 

    if(heroList === undefined || heroList === null){
        return;
    }else{

    while (heroList.next != null) {
        let temp = await getList(heroList.next);
        heroList.results = heroList.results.concat(temp.results);
        heroList.next = temp.next;
    }

    //Отрисовка полученного списка персонажей на странице
    heroList.results.forEach((element) => {
        let div = document.createElement("div");
        div.className = element.name;

        document.querySelector('.result').appendChild(div);
        div.innerHTML += `<h3>${element.name}</h3>`;
        for (key in element) {
            if (key != 'name' && key != 'homeworld' && key != 'films' &&
                key != 'vehicles' && key != 'starships' && key != 'species' &&
                key != 'url') {
                div.innerHTML += `<div>${key}: ${element[key]}</div>`;
            } else if (key === 'vehicles' && element[key].length != 0) {
                div.innerHTML += `<input class="${element.name}" type="button" value="${key}">`;
            }
        }
    });
}
}
start();

//Обработчик нажатия на кнопку vehicles для запроса к API на вывод информации о ТС
divRes.addEventListener('click', (event) => {
    if (event.target.tagName === 'INPUT') {
        let vehicle = [];
        heroList.results.forEach(async (element) => {
            if (event.target.className === element.name) {
                let mes;
                if ((element.vehicles).length > 1) {
                    for (let i = 0; i < (element.vehicles).length; i++) {
                        mes = await getList(element.vehicles[i]);
                        if(mes === undefined || mes === null){
                            return;
                        }else{
                        vehicle.push(mes);
                    }
                }
                    modalWindow(element.name, vehicle);
                } else {
                    mes = await getList(element.vehicles);
                    if(mes === undefined || mes === null){
                        return;
                    }else{
                    vehicle.push(mes);
                    modalWindow(element.name, vehicle);
                }
            }
            }
        });
    
    }
});

//Функция для запроса к API
async function getList(url) {
        try 
        {
            let res = await fetch(url);
            let data = await res.json();
        return data;
    }
        catch(e){
           return alert("Ошибка обращения к серверу, повторите попытку позже");
        }
    }

//Функция отрисовки модального окна
function modalWindow(name, transport) {

    span.onclick = () => {
        modal.style.display = 'none';
        mod.innerHTML = '';
        document.body.style.overflow = 'visible';
    };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            mod.innerHTML = '';
            document.body.style.overflow = 'visible';
        }
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    mod.innerHTML += `<h2>${name}</h2>`;
    transport.forEach((elem) => {
        for (key in elem) {
            if (key === 'name') {
                mod.innerHTML += `<h4>${elem[key]}</h4>`;
            } else if (key != 'films' && key != 'pilots' && key != 'url') {
                mod.innerHTML += `<div>${key}: ${elem[key]}</div>`;
            }
        }
    });
}