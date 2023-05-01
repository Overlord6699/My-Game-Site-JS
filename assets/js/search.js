window.onload = () => {
    document.querySelector("#search").oninput = function () {
        let phrase = this.value.trim().toLowerCase();
        console.log(phrase);
        let items = document.querySelectorAll('.shop_card');
        let categories = document.querySelectorAll('.section_container');

        let countArr = {};

        //заполнение массива нулями
        categories.forEach(function (elem) {
            //берём имена категорий и записываем в массив-счётчик
            const category_DB_name = elem.querySelector(".category_name").textContent;
            countArr[category_DB_name] = 0;
        })

        let count = 0;

        if (phrase != "") {
            items.forEach(function (elem) {
                if (elem.innerText.toLowerCase().search(phrase) == -1)
                    elem.classList.add('hidden');
                else {
                    elem.classList.remove('hidden');

                    //получаем имя категории из предмета
                    const categoryName = elem.querySelector('.card_category').textContent;
                    countArr[categoryName]++;

                    console.log("найдено в  категории " +
                        categoryName
                    );

                    count = count + 1;
                    console.log("Всего найдено:" + count);
                }
            });

            //уменьшение высоты страницы
            if (count > 0) {
                //скрытие некоторых категорий
                categories.forEach(function (elem) {
                    for (let i = 0; i < 2; i++) {

                        let categoryName = elem.querySelector(".category_name").textContent;
                        console.log("Категория " + categoryName);

                        //если в данной категории не найдено 
                        if (countArr[categoryName] == 0) {
                            elem.classList.add('hidden');

                            console.log("Категория " + categoryName + " скрыта");
                        } else {
                            elem.classList.remove('hidden');
                        }
                    }
                });

            } else {

                //скрытие всех категорий
                categories.forEach(function (elem) {
                    elem.classList.add('hidden');
                });
            }

        } else {
            items.forEach(function (elem) {
                elem.classList.remove('hidden');
            });

            //открытие категорий
            categories.forEach(function (elem) {
                elem.classList.remove('hidden');
            });

            for (let $i = 0; $i < countArr.count; $i++) {
                countArr[categories[$i].querySelector(".category_name").textContent] = 0;
            }
        }
    }
}