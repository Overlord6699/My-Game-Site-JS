const popupLinks = document.querySelectorAll('.pop_up-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

//против двойного нажатия
let unlock = true;

const timeOut = 800;


if(popupLinks.length > 0)
{
    for(let i = 0; i < popupLinks.length; i++)
    {
        const popupLink = popupLinks[i];

        popupLink.addEventListener('click', function(e)
        {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curPopup = document.getElementById(popupName);

            popupOpen(curPopup);


            //запрет перезагрузки страницы
            e.preventDefault();
        });
    }
}

const popupCloseIcons = document.querySelectorAll('.close-pop_up');
if(popupCloseIcons.length > 0)
{
    for(let i = 0; i < popupCloseIcons.length; i++)
    {
        const closeElem = popupCloseIcons[i];

        closeElem.addEventListener('click', function(e){

            popupClose(closeElem.closest('.pop_up'));
            e.preventDefault();
        });
    }
}

function popupOpen(currentPopup)
{
    if(currentPopup && unlock)
    {
        const popupActive = document.querySelector('.pop_up.open');

        if(popupActive)
        {
            popupClose(popupActive, false);
        }else{
            bodyLock();
        }

        currentPopup.classList.add('open');

        currentPopup.addEventListener('click', function(e)
        {
            if(!e.target.closest('.pop_up_content'))
                popupClose(e.target.closest('.pop_up'));
        });
    }
}

function popupClose(popupActive, doUnlock = true)
{
    if(unlock)
    {
        popupActive.classList.remove('open');

        if(doUnlock)
        {
            bodyUnlock();
        }
    }
}

function bodyLock()
{
    //рассчёт разности ширины окна и объекта внутри для получения ширины скролла
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if(lockPadding.length > 0){
        for(let i = 0; i < lockPadding.length; i++)
        {
            const el = lockPadding[i];

            el.style.paddingRight = lockPaddingValue;
            
        }
    }

    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function()
    {
        unlock = true;
    },timeOut);
}

function bodyUnlock()
{
    setTimeout(function() {
        if(lockPadding.length > 0){
            for(let i = 0; i < lockPadding.length; i++)
            {
                const el = lockPadding[i];
                el.style.paddingRight = '0px';
            }
        }   

        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeOut);
}